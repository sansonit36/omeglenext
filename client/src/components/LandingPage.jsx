import React, { useState } from 'react';
import { Video, Users, Zap, Globe, Shield, Heart } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
    const [interest, setInterest] = useState('');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-black">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[100px] animate-float"></div>
            </div>

            <div className="max-w-5xl w-full text-center space-y-12 relative z-10 animate-fade-in">
                {/* Hero Section */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-indigo-300 animate-float">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        <span>24,102 users online now</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight px-4 leading-tight">
                        Talk to <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                            Strangers
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Skip the small talk. Dive into random video conversations with people from around the globe.
                    </p>
                </div>

                {/* Action Card */}
                <div className="glass-card p-8 rounded-3xl max-w-md mx-auto space-y-8 transform hover:scale-[1.02] transition-all duration-500">
                    <div className="space-y-3 text-left">
                        <label className="text-sm font-medium text-gray-300 ml-1">Add your interests (optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="coding, music, travel..."
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onEnter}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Start Video Chat
                    </button>

                    <div className="pt-6 border-t border-white/5 text-xs text-gray-500 flex flex-wrap justify-center gap-6">
                        <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-indigo-400" /> Secure</span>
                        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /> Fast</span>
                        <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-400" /> Free</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
