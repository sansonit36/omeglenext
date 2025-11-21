import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Globe, Activity } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    if (response.status === 401) navigate('/admin/login');
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, [navigate]);

    if (!stats) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}
                        className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<Users className="text-indigo-400" />} label="Live Users" value={stats.activeUsers} />
                    <StatCard icon={<Activity className="text-green-400" />} label="Total Visits" value={stats.totalVisits} />
                    <StatCard icon={<Clock className="text-orange-400" />} label="Avg Time (s)" value={stats.avgTimeSpent} />
                    <StatCard icon={<Globe className="text-blue-400" />} label="Countries" value={Object.keys(stats.countryDistribution).length} />
                </div>

                {/* Country Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Visitor Distribution</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.countryDistribution).map(([country, count]) => (
                            <div key={country} className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                                <span className="font-medium text-gray-300">{country}</span>
                                <span className="font-bold text-indigo-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default Dashboard;
