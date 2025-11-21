import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, FileText, Mail, Info, Twitter, Instagram, Github, Globe } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#0f0f13] border-t border-white/5 pt-12 pb-8 mt-auto overflow-hidden">
            {/* Background Glows - Subtle */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <span className="font-bold text-2xl tracking-tight text-white">Zingle</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Experience the next generation of random video chat. Connect globally, stay anonymous, and find your vibe instantly.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20">
                                <Github size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Links Container */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider opacity-80">
                                Discover
                            </h3>
                            <ul className="space-y-2.5 text-sm text-gray-400">
                                <li>
                                    <Link to="/" className="hover:text-indigo-400 transition-colors block">Home</Link>
                                </li>
                                <li>
                                    <Link to="/about" className="hover:text-indigo-400 transition-colors block">About Us</Link>
                                </li>
                                <li>
                                    <Link to="/support/safety" className="hover:text-indigo-400 transition-colors block">Safety Center</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider opacity-80">
                                Legal
                            </h3>
                            <ul className="space-y-2.5 text-sm text-gray-400">
                                <li>
                                    <Link to="/legal/terms" className="hover:text-indigo-400 transition-colors block">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link to="/legal/privacy" className="hover:text-indigo-400 transition-colors block">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/legal/cookies" className="hover:text-indigo-400 transition-colors block">Cookie Policy</Link>
                                </li>
                                <li>
                                    <Link to="/legal/guidelines" className="hover:text-indigo-400 transition-colors block">Guidelines</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider opacity-80">
                                Support
                            </h3>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                                    Need help? Our team is available 24/7.
                                </p>
                                <Link
                                    to="/support/contact"
                                    className="block w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        © {currentYear} Zingle Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <span>Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500" />
                        <span>globally</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
