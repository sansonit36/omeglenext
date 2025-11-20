import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Video, VideoOff, SkipForward, MessageSquare, RefreshCw } from 'lucide-react';

const VideoChat = ({ socket, onLeave }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSearching, setIsSearching] = useState(true);
    const [partnerId, setPartnerId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [mediaError, setMediaError] = useState(null);
    const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const chatEndRef = useRef(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    // Switch Camera
    const switchCamera = async () => {
        try {
            const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: true
            });

            // Update local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = newStream;
            }

            // Replace video track in peer connection
            if (peerConnectionRef.current) {
                const videoTrack = newStream.getVideoTracks()[0];
                const senders = peerConnectionRef.current.getSenders();
                const sender = senders.find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            }

            // Stop old tracks but keep audio if we want to reuse it? 
            // Actually getUserMedia returns a new stream with both audio and video.
            // We should probably replace audio track too or just use the new stream entirely.
            // Let's just replace the tracks in the local stream ref.

            const oldStream = localStreamRef.current;
            if (oldStream) {
                oldStream.getTracks().forEach(track => track.stop());
            }

            localStreamRef.current = newStream;

            // Re-apply mute states
            newStream.getAudioTracks().forEach(track => track.enabled = micOn);
            newStream.getVideoTracks().forEach(track => track.enabled = cameraOn);

        } catch (err) {
            console.error('Error switching camera:', err);
        }
    };

    // Handle next button - defined before useEffect to avoid dependency issues
    const handleNext = useCallback(() => {
        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Create new peer connection
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
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

        peerConnectionRef.current = pc;

        // Reset state
        setIsSearching(true);
        setMessages([]);
        setPartnerId(null);
        setRoomId(null);

        // Clear remote video
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        // Rejoin queue
        socket.emit('join_queue');
    }, [partnerId, socket]);

    // Initialize WebRTC and Socket listeners
    useEffect(() => {
        // Request media permissions
        navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Initialize PeerConnection
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
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

                peerConnectionRef.current = pc;

                // Join queue
                socket.emit('join_queue');
            })
            .catch(err => {
                console.error('Error accessing media:', err);
                setMediaError(err);
            });

        // Socket event listeners
        socket.on('paired', ({ roomId: rid }) => {
            setRoomId(rid);
            setIsSearching(false);
            setMessages([{ type: 'system', text: 'You are now connected with a stranger. Say hi!' }]);
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
            if (!pc) return;

            if (signal.type === 'offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('signal', { target: sender, signal: { type: 'answer', sdp: answer } });
            } else if (signal.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            } else if (signal.type === 'candidate') {
                await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
            }
        });

        socket.on('message', (data) => {
            setMessages(prev => [...prev, { type: 'remote', text: data.message }]);
        });

        socket.on('partner_disconnected', () => {
            setMessages(prev => [...prev, { type: 'system', text: 'Stranger has disconnected.' }]);
            setTimeout(() => {
                handleNext();
            }, 1500);
        });

        return () => {
            // Cleanup
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            // Stop tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            socket.off('paired');
            socket.off('partner_found');
            socket.off('signal');
            socket.off('message');
            socket.off('partner_disconnected');
        };
    }, [socket, partnerId, handleNext]); // Removed facingMode from dependency to prevent full re-init on switch

    // Handle sending messages
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
                <div className="max-w-md text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <VideoOff size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold">Camera Access Failed</h2>
                    <p className="text-gray-400">
                        {mediaError.name === 'NotAllowedError'
                            ? 'Please allow camera and microphone access to use this app.'
                            : 'Could not access camera or microphone.'}
                    </p>
                    <p className="text-sm text-gray-500">
                        Note: On mobile devices and over the network, you may need a secure connection (HTTPS) to access the camera.
                    </p>
                    <button
                        onClick={onLeave}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black">
            {/* Header */}
            <header className="h-14 sm:h-16 border-b border-white/10 flex items-center justify-between px-3 sm:px-6 bg-[#1a1a23] z-50 relative">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-base sm:text-lg tracking-tight">Omegle<span className="text-indigo-500">Next</span></span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={switchCamera} className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
                        <RefreshCw size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => setMicOn(!micOn)} className={`p-2 sm:p-3 rounded-full transition-all ${micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 text-red-500'}`}>
                        {micOn ? <Mic size={18} className="sm:w-5 sm:h-5" /> : <MicOff size={18} className="sm:w-5 sm:h-5" />}
                    </button>
                    <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 sm:p-3 rounded-full transition-all ${cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 text-red-500'}`}>
                        {cameraOn ? <Video size={18} className="sm:w-5 sm:h-5" /> : <VideoOff size={18} className="sm:w-5 sm:h-5" />}
                    </button>

                    <button
                        onClick={() => {
                            // Stop all tracks
                            if (localStreamRef.current) {
                                localStreamRef.current.getTracks().forEach(track => track.stop());
                            }
                            // Close peer connection
                            if (peerConnectionRef.current) {
                                peerConnectionRef.current.close();
                            }
                            // Notify partner
                            socket.emit('next');
                            // Return to landing page
                            onLeave();
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all text-sm sm:text-base font-medium"
                    >
                        Stop
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Video Area */}
                <div className="flex-1 flex flex-col md:flex-row relative bg-black">
                    {/* Stranger's Video - Full on mobile, main on desktop */}
                    <div className="flex-1 relative bg-black flex items-center justify-center h-full">
                        {isSearching ? (
                            <div className="text-center space-y-3 sm:space-y-4 animate-pulse px-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-lg sm:text-xl font-medium text-indigo-400">Looking for someone...</p>
                            </div>
                        ) : (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Local Video - PIP on mobile (top-right), PIP on desktop (bottom-right) */}
                    <div className="absolute top-4 right-4 w-32 h-48 md:bottom-6 md:right-6 md:top-auto md:w-48 md:h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl z-10 transition-all duration-300 hover:scale-105">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Chat Area - Fixed height on mobile, full height on desktop */}
                <div className="w-full h-[40vh] md:w-96 md:h-auto bg-[#0f0f13] border-t md:border-t-0 md:border-l border-white/10 flex flex-col absolute bottom-0 md:relative z-20 md:z-0 shadow-lg md:shadow-none">
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'local' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-sm sm:text-base ${msg.type === 'local'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : msg.type === 'system'
                                        ? 'bg-transparent text-gray-400 text-center w-full text-xs sm:text-sm'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-3 sm:p-4 border-t border-white/10 space-y-3 sm:space-y-4 bg-[#0f0f13]">
                        <form onSubmit={sendMessage} className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                disabled={isSearching}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 sm:pl-4 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base focus:border-indigo-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </form>

                        <button
                            onClick={handleNext}
                            disabled={isSearching}
                            className="w-full bg-white text-black font-bold py-2.5 sm:py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipForward size={18} className="sm:w-5 sm:h-5" />
                            Next Stranger
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
