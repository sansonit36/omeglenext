import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, FileText, Mail, Info } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f0f13] border-t border-white/10 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <span className="font-bold text-xl tracking-tight text-white">Zingle</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connect with strangers worldwide instantly. Safe, anonymous, and free video chat.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" />
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link to="/legal/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/legal/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/legal/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link>
                            </li>
                            <li>
                                <Link to="/legal/guidelines" className="hover:text-indigo-400 transition-colors">Community Guidelines</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Shield size={16} className="text-indigo-500" />
                            Support
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link to="/support/safety" className="hover:text-indigo-400 transition-colors">Safety Center</Link>
                            </li>
                            <li>
                                <Link to="/support/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Info size={16} className="text-indigo-500" />
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Zingle. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span>for the world</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
