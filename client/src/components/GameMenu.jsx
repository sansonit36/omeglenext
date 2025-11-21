import React from 'react';
import { Gamepad2, X } from 'lucide-react';

const GameMenu = ({ onSelectGame, onClose }) => {
    const games = [
        { id: 'tictactoe', name: 'Tic Tac Toe', icon: '❌⭕️', color: 'from-indigo-500 to-purple-500' },
        { id: 'ludo', name: 'Ludo', icon: '🎲', color: 'from-green-500 to-emerald-500', disabled: true },
        { id: 'chess', name: 'Chess', icon: '♟️', color: 'from-orange-500 to-red-500', disabled: true },
    ];

    return (
        <div className="absolute bottom-20 right-6 bg-[#1a1a23] border border-white/10 rounded-2xl shadow-2xl p-4 w-64 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Gamepad2 size={18} className="text-indigo-500" />
                    Play a Game
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-2">
                {games.map(game => (
                    <button
                        key={game.id}
                        onClick={() => !game.disabled && onSelectGame(game.id)}
                        disabled={game.disabled}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${game.disabled
                                ? 'opacity-50 cursor-not-allowed bg-white/5'
                                : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center text-lg shadow-lg`}>
                            {game.icon}
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm text-white">{game.name}</div>
                            <div className="text-xs text-gray-400">{game.disabled ? 'Coming Soon' : 'Play Now'}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameMenu;
