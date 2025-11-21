import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, FileText, Mail, Info, Twitter, Instagram, Github, Globe } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#0f0f13] border-t border-white/5 pt-16 pb-8 mt-auto overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <span className="font-bold text-2xl tracking-tight text-white">Zingle</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Experience the next generation of random video chat. Connect globally, stay anonymous, and find your vibe instantly.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Globe size={16} className="text-indigo-500" />
                            Discover
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/support/safety" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Safety Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Shield size={16} className="text-indigo-500" />
                            Legal
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link to="/legal/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/cookies" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/guidelines" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Community Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact / Support */}
                    <div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Mail size={16} className="text-indigo-500" />
                            Support
                        </h3>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="text-gray-400 text-sm mb-4">
                                Need help or have questions? Our support team is here for you 24/7.
                            </p>
                            <Link
                                to="/support/contact"
                                className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold text-center rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Zingle Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                            <span>Made with</span>
                            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                            <span>globally</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
