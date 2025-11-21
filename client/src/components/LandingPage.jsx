import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Video, Users, Zap, Globe, LogIn } from 'lucide-react';

import AdsterraNativeBanner from './ads/AdsterraNativeBanner';

const LandingPage = ({ onEnter, onCreateRoom, onJoinRoom, onJoinRandom }) => {
    const [interest, setInterest] = useState('');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomLimit, setRoomLimit] = useState(5);
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-indigo-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
            </div>

            {/* Logo Header */}
            <nav className="absolute top-0 left-0 w-full p-4 sm:p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <span className="font-bold text-2xl tracking-tight text-white">Zingle</span>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/dashboard" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/25">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all backdrop-blur-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12 animate-fade-in">
                <div className="space-y-4 sm:space-y-6">
                    <div className="text-center space-y-6 mb-12">
                        <div className="relative inline-block">
                            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x pb-2">
                                Zingle
                            </h1>
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20 animate-pulse"></div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-gray-300 font-medium">24,000+ users online</span>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight px-2">
                        Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Strangers</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Skip the small talk. Dive into random video conversations with people from around the globe.
                        No registration, no strings attached. Just pure connection.
                    </p>
                </div>



                // ... (imports)

                // ... (inside component)

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {/* Random Chat Panel */}
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5 transform hover:scale-[1.02] transition-transform duration-300">
                        <h2 className="text-xl font-bold text-white">Random Chat</h2>
                        <div className="space-y-2 text-left">
                            <label className="text-xs sm:text-sm font-medium text-gray-300 ml-1">Interests (optional)</label>
                            <input
                                type="text"
                                placeholder="coding, music..."
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={onEnter}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                        >
                            <Video className="w-4 h-4" />
                            Start Random Chat
                        </button>
                    </div>

                    {/* Group Room Panel */}
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5 transform hover:scale-[1.02] transition-transform duration-300">
                        <h2 className="text-xl font-bold text-white">Group Rooms</h2>
                        <div className="space-y-2 text-left">
                            <label className="text-xs sm:text-sm font-medium text-gray-300 ml-1">Join Room ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Room ID"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500/50 transition-all"
                                />
                                <button
                                    onClick={() => onJoinRoom(joinRoomId)}
                                    disabled={!joinRoomId.trim()}
                                    className="bg-white text-purple-600 hover:bg-purple-50 font-bold px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    Join
                                    <LogIn size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0f0f13] px-2 text-gray-500">Or</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onJoinRandom}
                                className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Join Random
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Create Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Adsterra Native Banner */}
                <div className="max-w-2xl mx-auto w-full">
                    <AdsterraNativeBanner />
                </div>

                <div className="pt-4 border-t border-white/5 text-xs text-gray-500 flex flex-wrap justify-center gap-3 sm:gap-6">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 100% Anonymous</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Match</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global</span>
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a23] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-white">Create Group Room</h3>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Max Participants (2-10)</label>
                            <input
                                type="number"
                                min="2"
                                max="10"
                                value={roomLimit}
                                onChange={(e) => setRoomLimit(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-indigo-500/50"
                            />
                            <p className="text-xs text-gray-500">Recommended: 4-5 users for best performance.</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onCreateRoom(roomLimit)}
                                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
