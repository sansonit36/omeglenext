import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f0f13] text-white pt-24 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-[#1a1a23] border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                                <User size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">My Dashboard</h1>
                                <p className="text-gray-400">Welcome back!</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm font-medium mb-2">Account Status</h3>
                            <p className="text-xl font-bold text-green-400">Active</p>
                        </div>
                        {/* Add more stats or user info here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
