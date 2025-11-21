import React from 'react';
import { X, Circle } from 'lucide-react';

const TicTacToe = ({ board, turn, myId, onMove, status, winner, onClose }) => {
    const isMyTurn = turn === myId && status === 'playing';
    const getStatusMessage = () => {
        if (status === 'playing') {
            return isMyTurn ? "Your Turn" : "Opponent's Turn";
        }
        if (status === 'won') {
            return winner === myId ? "You Won! 🎉" : "You Lost 😔";
        }
        if (status === 'draw') {
            return "It's a Draw! 🤝";
        }
    };

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1a23] p-6 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-indigo-500">#</span> Tic Tac Toe
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="text-center mb-6">
                    <div className={`text-lg font-bold ${status === 'won' && winner === myId ? 'text-green-400' :
                            status === 'won' ? 'text-red-400' :
                                status === 'draw' ? 'text-yellow-400' :
                                    isMyTurn ? 'text-indigo-400' : 'text-gray-400'
                        }`}>
                        {getStatusMessage()}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {board.map((cell, i) => (
                        <button
                            key={i}
                            onClick={() => isMyTurn && !cell && onMove(i)}
                            disabled={!isMyTurn || cell !== null || status !== 'playing'}
                            className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold transition-all ${cell
                                    ? 'bg-white/10'
                                    : isMyTurn
                                        ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                                        : 'bg-black/20 cursor-not-allowed'
                                } ${cell === 'X' ? 'text-indigo-400' : 'text-pink-400'
                                }`}
                        >
                            {cell === 'X' && <X size={40} strokeWidth={2.5} />}
                            {cell === 'O' && <Circle size={36} strokeWidth={2.5} />}
                        </button>
                    ))}
                </div>

                {status !== 'playing' && (
                    <button onClick={onClose} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                        Close Game
                    </button>
                )}
            </div>
        </div>
    );
};

export default TicTacToe;
