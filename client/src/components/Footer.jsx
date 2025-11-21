import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Globe, Shield, Mail, Circle } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
                    {/* Brand Column - Spans 2 columns */}
                    <div className="col-span-2 md:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all duration-300"></div>
                            <span className="font-bold text-2xl tracking-tight text-white">Zingle</span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            The next generation of anonymous video chat. Connect instantly, safely, and globally.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Twitter size={18} />} />
                            <SocialLink href="#" icon={<Instagram size={18} />} />
                            <SocialLink href="#" icon={<Github size={18} />} />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="col-span-1">
                        <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><FooterLink to="/">Home</FooterLink></li>
                            <li><FooterLink to="/about">About</FooterLink></li>
                            <li><FooterLink to="/features">Features</FooterLink></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-semibold text-white mb-4 text-sm">Resources</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><FooterLink to="/support/safety">Safety Center</FooterLink></li>
                            <li><FooterLink to="/guidelines">Guidelines</FooterLink></li>
                            <li><FooterLink to="/blog">Blog</FooterLink></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><FooterLink to="/legal/terms">Terms</FooterLink></li>
                            <li><FooterLink to="/legal/privacy">Privacy</FooterLink></li>
                            <li><FooterLink to="/legal/cookies">Cookies</FooterLink></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><FooterLink to="/support/contact">Contact Us</FooterLink></li>
                            <li><FooterLink to="/status">System Status</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-emerald-500">All Systems Operational</span>
                        </div>
                    </div>
                    <p className="text-zinc-600 text-sm">
                        © {currentYear} Zingle Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <Link to={to} className="hover:text-indigo-400 transition-colors duration-200 block">
        {children}
    </Link>
);

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-200"
    >
        {icon}
    </a>
);

export default Footer;
