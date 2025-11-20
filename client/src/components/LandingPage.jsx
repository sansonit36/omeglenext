import React, { useState } from 'react';
import { Video, Users, Zap, Globe } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
    const [interest, setInterest] = useState('');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-indigo-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
            </div>

            <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12 animate-fade-in">
                <div className="space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-indigo-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="hidden xs:inline">24,102 users online now</span>
                        <span className="xs:hidden">24K online</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight px-2">
                        Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Strangers</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Skip the small talk. Dive into random video conversations with people from around the globe.
                        No registration, no strings attached. Just pure connection.
                    </p>
                </div>

                <div className="glass-panel p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-w-md mx-auto space-y-5 sm:space-y-6 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="space-y-2 text-left">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 ml-1">Add your interests (optional)</label>
                        <input
                            type="text"
                            placeholder="coding, music, travel..."
                            value={interest}
                            onChange={(e) => setInterest(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={onEnter}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                        Start Video Chat
                    </button>

                    <div className="pt-3 sm:pt-4 border-t border-white/5 text-xs text-gray-500 flex flex-wrap justify-center gap-3 sm:gap-6">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 100% Anonymous</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Match</span>
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
