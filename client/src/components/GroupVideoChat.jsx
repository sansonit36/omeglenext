import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Shield, Ban, VolumeX, Volume2, Copy } from 'lucide-react';

const GroupVideoChat = ({ socket, roomId, onLeave }) => {
    const [peers, setPeers] = useState([]); // Array of { userId, stream, isMuted }
    const [localStream, setLocalStream] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const localVideoRef = useRef(null);
    const peersRef = useRef({}); // { [userId]: RTCPeerConnection }
    const localStreamRef = useRef(null);

    // Initialize
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Join the room
                socket.emit('join_room', { roomId });
            })
            .catch(err => console.error('Error accessing media:', err));

        return () => {
            // Cleanup
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            Object.values(peersRef.current).forEach(pc => pc.close());
            socket.emit('leave_room'); // Optional, disconnect handles it
        };
    }, [roomId, socket]);

    const pendingCandidates = useRef({}); // { [userId]: RTCIceCandidate[] }

    // Toggle Mic
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = micOn;
            });
        }
    }, [micOn]);

    // Toggle Camera
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = cameraOn;
            });
        }
    }, [cameraOn]);

    // Socket Events
    useEffect(() => {
        socket.on('room_joined', ({ users, admin }) => {
            console.log('Joined room. Existing users:', users, 'Admin:', admin, 'My ID:', socket.id);
            setIsAdmin(socket.id === admin);
            setMessages(prev => [...prev, { type: 'system', text: `Joined room ${roomId}` }]);

            // Initiate connections to existing users
            users.forEach(userId => {
                createPeer(userId, socket.id, true);
            });
        });

        socket.on('user_joined', ({ userId }) => {
            console.log('User joined:', userId);
            setMessages(prev => [...prev, { type: 'system', text: 'A user joined the room.' }]);
            // Wait for offer from new user (they are initiator? No, we are existing, they initiate? 
            // Actually, usually the new joiner initiates to existing users or vice versa.
            // Let's stick to: Existing users initiate to new user? Or New user initiates to all?
            // In 'room_joined', I iterate and create offers.
            // Here in 'user_joined', I just prepare to receive? 
            // Actually, I don't need to do anything here if they initiate.
        });

        socket.on('signal', async ({ sender, signal }) => {
            console.log(`Received signal from ${sender}:`, signal.type);
            let pc = peersRef.current[sender];

            if (!pc) {
                // Incoming offer from new user
                pc = createPeer(sender, socket.id, false);
            }

            try {
                if (signal.type === 'offer') {
                    if (pc.signalingState !== 'stable') {
                        console.warn('Received offer in unstable state, ignoring or rolling back');
                        // Simple collision handling: if we are also initiator (unlikely in this flow), we might need to compare IDs
                        // For now, assume new joiner always initiates.
                    }
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('signal', { target: sender, signal: { type: 'answer', sdp: answer } });

                    // Process queued candidates
                    if (pendingCandidates.current[sender]) {
                        for (const candidate of pendingCandidates.current[sender]) {
                            await pc.addIceCandidate(candidate);
                        }
                        delete pendingCandidates.current[sender];
                    }
                } else if (signal.type === 'answer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                } else if (signal.type === 'candidate') {
                    const candidate = new RTCIceCandidate(signal.candidate);
                    if (pc.remoteDescription) {
                        await pc.addIceCandidate(candidate);
                    } else {
                        console.log('Queueing candidate for', sender);
                        if (!pendingCandidates.current[sender]) {
                            pendingCandidates.current[sender] = [];
                        }
                        pendingCandidates.current[sender].push(candidate);
                    }
                }
            } catch (err) {
                console.error('Signaling error:', err);
            }
        });

        socket.on('user_left', ({ userId }) => {
            console.log('User left:', userId);
            setMessages(prev => [...prev, { type: 'system', text: 'User left.' }]);
            if (peersRef.current[userId]) {
                peersRef.current[userId].close();
                delete peersRef.current[userId];
            }
            setPeers(prev => prev.filter(p => p.userId !== userId));
        });

        socket.on('kicked', () => {
            alert('You have been kicked from the room.');
            onLeave();
        });

        socket.on('user_muted', ({ userId, muted }) => {
            if (userId === socket.id) {
                setMicOn(!muted);
                if (muted) alert('You have been muted by the admin.');
            }
            setPeers(prev => prev.map(p => {
                if (p.userId === userId) {
                    return { ...p, isMuted: muted };
                }
                return p;
            }));
        });

        socket.on('new_admin', ({ admin }) => {
            if (socket.id === admin) {
                setIsAdmin(true);
                setMessages(prev => [...prev, { type: 'system', text: 'You are now the admin.' }]);
            }
        });

        return () => {
            socket.off('room_joined');
            socket.off('user_joined');
            socket.off('signal');
            socket.off('user_left');
            socket.off('kicked');
            socket.off('user_muted');
            socket.off('new_admin');
        };
    }, [socket, roomId, onLeave]);

    const createPeer = (targetId, myId, initiator) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        });

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
        }

        pc.ontrack = (event) => {
            console.log('Received remote track from:', targetId);
            setPeers(prev => {
                if (prev.some(p => p.userId === targetId)) return prev;
                return [...prev, { userId: targetId, stream: event.streams[0], isMuted: false }];
            });
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('signal', {
                    target: targetId,
                    signal: { type: 'candidate', candidate: event.candidate }
                });
            }
        };

        if (initiator) {
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer);
                socket.emit('signal', { target: targetId, signal: { type: 'offer', sdp: offer } });
            });
        }

        peersRef.current[targetId] = pc;
        return pc;
    };

    const handleKick = (userId) => {
        socket.emit('kick_user', { userId });
    };

    const handleMute = (userId, currentMuteStatus) => {
        socket.emit('mute_user', { userId, muted: !currentMuteStatus });
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        alert('Room ID copied to clipboard!');
    };

    const handleMuteAll = () => {
        peers.forEach(peer => {
            if (!peer.isMuted) handleMute(peer.userId, peer.isMuted);
        });
    };

    return (
        <div className="h-screen flex flex-col bg-[#0f0f13] text-white">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a23] z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="text-indigo-500" size={20} />
                        <span className="font-bold text-lg">Room: {roomId}</span>
                    </div>
                    <button onClick={copyRoomId} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Copy Room ID">
                        <Copy size={16} className="text-gray-400" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {/* Local Controls in Header */}
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                        <button onClick={() => setMicOn(!micOn)} className={`p-2 rounded-full transition-colors ${micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 text-white'}`} title="Toggle Mic">
                            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                        </button>
                        <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 rounded-full transition-colors ${cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 text-white'}`} title="Toggle Camera">
                            {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                        </button>
                    </div>

                    {isAdmin && (
                        <>
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">ADMIN</span>
                            <button onClick={handleMuteAll} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors" title="Mute Everyone">
                                <VolumeX size={18} />
                            </button>
                        </>
                    )}
                    <button onClick={onLeave} className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <PhoneOff size={18} /> Leave
                    </button>
                </div>
            </header>

            {/* Video Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className={`grid gap-4 auto-rows-fr h-full ${(peers.length + 1) <= 1 ? 'grid-cols-1' :
                    (peers.length + 1) === 2 ? 'grid-cols-1 md:grid-cols-2' :
                        (peers.length + 1) <= 4 ? 'grid-cols-2' :
                            (peers.length + 1) <= 6 ? 'grid-cols-2 md:grid-cols-3' :
                                'grid-cols-2 md:grid-cols-4'
                    }`}>
                    {/* Local Video */}
                    <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 aspect-video group">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-medium z-20">You</div>
                        <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-100 transition-opacity">
                            <button onClick={() => setMicOn(!micOn)} className={`p-2 rounded-full ${micOn ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-red-500 text-white'}`}>
                                {micOn ? <Mic size={14} /> : <MicOff size={14} />}
                            </button>
                            <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 rounded-full ${cameraOn ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-red-500 text-white'}`}>
                                {cameraOn ? <Video size={14} /> : <VideoOff size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Remote Peers */}
                    {peers.map(peer => (
                        <div key={peer.userId} className="relative bg-black rounded-2xl overflow-hidden border border-white/10 aspect-video group">
                            <video
                                autoPlay
                                playsInline
                                ref={el => {
                                    if (el) el.srcObject = peer.stream;
                                }}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-medium flex items-center gap-2 z-20">
                                User {peer.userId.substr(0, 4)}
                                {peer.isMuted && <VolumeX size={12} className="text-red-500" />}
                            </div>

                            {/* Admin Controls */}
                            {isAdmin && (
                                <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleMute(peer.userId, peer.isMuted)}
                                        className={`p-2 rounded-full ${peer.isMuted ? 'bg-red-500 text-white' : 'bg-gray-800/80 hover:bg-gray-700'}`}
                                        title={peer.isMuted ? "Unmute User" : "Mute User"}
                                    >
                                        {peer.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleKick(peer.userId)}
                                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white"
                                        title="Kick User"
                                    >
                                        <Ban size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupVideoChat;
