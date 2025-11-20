import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Video, VideoOff, SkipForward, MessageSquare, RefreshCw, X } from 'lucide-react';

const VideoChat = ({ socket, onLeave }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSearching, setIsSearching] = useState(true);
    const [partnerId, setPartnerId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [mediaError, setMediaError] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [showChatMobile, setShowChatMobile] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const chatEndRef = useRef(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showChatMobile]);

    // Toggle mic
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = micOn;
            });
        }
    }, [micOn]);

    // Toggle camera
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = cameraOn;
            });
        }
    }, [cameraOn]);

    const switchCamera = async () => {
        try {
            const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = newStream;
            }

            if (peerConnectionRef.current) {
                const videoTrack = newStream.getVideoTracks()[0];
                const senders = peerConnectionRef.current.getSenders();
                const sender = senders.find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            }

            const oldStream = localStreamRef.current;
            if (oldStream) {
                oldStream.getTracks().forEach(track => track.stop());
            }

            localStreamRef.current = newStream;
            newStream.getAudioTracks().forEach(track => track.enabled = micOn);
            newStream.getVideoTracks().forEach(track => track.enabled = cameraOn);

        } catch (err) {
            console.error('Error switching camera:', err);
        }
    };

    const handleNext = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        });

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
        }

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && partnerId) {
                socket.emit('signal', {
                    target: partnerId,
                    signal: { type: 'candidate', candidate: event.candidate }
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                setMessages(prev => [...prev, { type: 'system', text: `Connection issue: ${pc.iceConnectionState}. Try refreshing.` }]);
            }
        };

        peerConnectionRef.current = pc;

        setIsSearching(true);
        setMessages([]);
        setPartnerId(null);
        setRoomId(null);

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        socket.emit('join_queue');
    }, [partnerId, socket]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                const pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun3.l.google.com:19302' },
                        { urls: 'stun:stun4.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                });

                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                pc.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate && partnerId) {
                        socket.emit('signal', {
                            target: partnerId,
                            signal: { type: 'candidate', candidate: event.candidate }
                        });
                    }
                };

                pc.oniceconnectionstatechange = () => {
                    console.log('ICE Connection State:', pc.iceConnectionState);
                    if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                        setMessages(prev => [...prev, { type: 'system', text: `Connection issue: ${pc.iceConnectionState}. Try refreshing.` }]);
                    }
                };

                peerConnectionRef.current = pc;
                socket.emit('join_queue');
            })
            .catch(err => {
                console.error('Error accessing media:', err);
                setMediaError(err);
            });

        socket.on('paired', ({ roomId: rid }) => {
            setRoomId(rid);
            setIsSearching(false);
            setMessages([{ type: 'system', text: 'Paired with a stranger. Establishing video connection...' }]);
        });

        socket.on('partner_found', async ({ partnerId: pid, initiator }) => {
            setPartnerId(pid);
            const pc = peerConnectionRef.current;
            if (initiator) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('signal', { target: pid, signal: { type: 'offer', sdp: offer } });
            }
        });

        socket.on('signal', async ({ sender, signal }) => {
            const pc = peerConnectionRef.current;
            if (!pc || pc.signalingState === 'closed') return;

            try {
                if (signal.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    if (pc.signalingState === 'closed') return;
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('signal', { target: sender, signal: { type: 'answer', sdp: answer } });
                } else if (signal.type === 'answer') {
                    if (pc.signalingState === 'have-local-offer') {
                        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    }
                } else if (signal.type === 'candidate') {
                    if (pc.remoteDescription && pc.signalingState !== 'closed') {
                        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                    }
                }
            } catch (err) {
                console.error('Signaling error:', err);
            }
        });

        socket.on('message', (data) => {
            setMessages(prev => [...prev, { type: 'remote', text: data.message }]);
            if (!showChatMobile && window.innerWidth < 768) {
                // Optional: Show notification dot or toast
            }
        });

        socket.on('partner_disconnected', () => {
            setMessages(prev => [...prev, { type: 'system', text: 'Stranger has disconnected.' }]);
            setTimeout(() => {
                handleNext();
            }, 1500);
        });

        return () => {
            if (peerConnectionRef.current) peerConnectionRef.current.close();
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
            socket.off('paired');
            socket.off('partner_found');
            socket.off('signal');
            socket.off('message');
            socket.off('partner_disconnected');
        };
    }, [socket, partnerId, handleNext]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !roomId) return;
        const msgText = message.trim();
        socket.emit('message', { roomId, message: msgText });
        setMessages(prev => [...prev, { type: 'local', text: msgText }]);
        setMessage('');
    };

    if (mediaError) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white p-4">
                <div className="max-w-md text-center space-y-6 glass-card p-8 rounded-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <VideoOff size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Camera Access Failed</h2>
                    <p className="text-gray-400">
                        Please allow camera and microphone access to use this app.
                    </p>
                    <button
                        onClick={onLeave}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black overflow-hidden relative">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* Stranger's Video */}
                <div className="h-[50%] md:h-full w-full md:w-[50%] relative bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    {isSearching ? (
                        <div className="text-center space-y-6 animate-fade-in px-4">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-indigo-500/30 rounded-full animate-ping absolute inset-0"></div>
                                <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
                            </div>
                            <p className="text-xl font-medium text-indigo-400 animate-pulse">Finding a stranger...</p>
                        </div>
                    ) : (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    )}
                    {!isSearching && (
                        <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-xs font-medium text-white/90 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Stranger
                        </div>
                    )}
                </div>

                {/* Local Video */}
                <div className="h-[50%] md:h-full w-full md:w-[50%] relative bg-[#0a0a0f]">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-xs font-medium text-white/90">
                        You
                    </div>
                </div>
            </div>

            {/* Floating Controls - Desktop & Mobile */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                <div className="glass-strong rounded-2xl p-2 flex items-center justify-between shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-1">
                        <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-xl transition-all ${micOn ? 'hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>
                        <button onClick={() => setCameraOn(!cameraOn)} className={`p-3 rounded-xl transition-all ${cameraOn ? 'hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>
                            {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>
                        <button onClick={switchCamera} className="p-3 rounded-xl hover:bg-white/10 text-white transition-all md:hidden">
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
                            if (peerConnectionRef.current) peerConnectionRef.current.close();
                            socket.emit('next');
                            onLeave();
                        }}
                        className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl font-medium transition-all text-sm"
                    >
                        Stop
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSearching}
                        className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <SkipForward size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Toggle (Mobile) */}
            <button
                onClick={() => setShowChatMobile(!showChatMobile)}
                className="md:hidden absolute top-4 right-4 z-50 p-3 glass rounded-full text-white shadow-lg"
            >
                {showChatMobile ? <X size={20} /> : <MessageSquare size={20} />}
            </button>

            {/* Chat Area - Desktop (Sidebar) / Mobile (Overlay) */}
            <div className={`
                fixed md:absolute inset-y-0 right-0 w-full md:w-80 bg-[#0a0a0f]/95 md:bg-[#0a0a0f] backdrop-blur-xl md:backdrop-blur-none border-l border-white/10 transform transition-transform duration-300 z-40 flex flex-col
                ${showChatMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Chat</h3>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'local' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.type === 'local'
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-500/20'
                                    : msg.type === 'system'
                                        ? 'bg-transparent text-gray-500 text-center w-full text-xs'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a0f]">
                    <form onSubmit={sendMessage} className="relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isSearching}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
