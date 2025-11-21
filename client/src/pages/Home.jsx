import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LandingPage from '../components/LandingPage';
import VideoChat from '../components/VideoChat';
import GroupVideoChat from '../components/GroupVideoChat';
import Footer from '../components/Footer';

function Home() {
    const [inChat, setInChat] = useState(false);
    const [isGroupMode, setIsGroupMode] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection - use env var for production
        console.log('App Version: 1.1.0 (STUN Fix Applied)');
        const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');
        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    const handleEnter = () => {
        setInChat(true);
        setIsGroupMode(false);
    };

    const handleCreateRoom = (limit) => {
        socket.emit('create_room', { limit });
        socket.once('room_created', ({ roomId }) => {
            setRoomId(roomId);
            setIsGroupMode(true);
            setInChat(true);
        });
    };

    const handleJoinRoom = (id) => {
        setRoomId(id);
        setIsGroupMode(true);
        setInChat(true);
    };

    const handleJoinRandom = () => {
        socket.emit('find_random_room');
        socket.once('random_room_found', ({ roomId }) => {
            setRoomId(roomId);
            setIsGroupMode(true);
            setInChat(true);
        });
        socket.once('error', ({ message }) => {
            alert(message);
        });
    };

    const handleLeave = () => {
        setInChat(false);
        setIsGroupMode(false);
        setRoomId(null);
        if (isGroupMode) {
            socket.emit('leave_room'); // Ensure cleanup
        }
    };

    if (!socket) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0f0f13]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Connecting to Zingle...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0f0f13]">
            <div className="flex-grow">
                {inChat ? (
                    isGroupMode ? (
                        <GroupVideoChat socket={socket} roomId={roomId} onLeave={handleLeave} />
                    ) : (
                        <VideoChat socket={socket} onLeave={handleLeave} />
                    )
                ) : (
                    <LandingPage
                        onEnter={handleEnter}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoom={handleJoinRoom}
                        onJoinRandom={handleJoinRandom}
                    />
                )}
            </div>
            {!inChat && <Footer />}
        </div>
    );
}

export default Home;
