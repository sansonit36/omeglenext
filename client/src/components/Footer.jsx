import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Globe, Facebook } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-20 pb-10 mt-auto font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Top Section: Logo/Slogan vs Links */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">

                    {/* Left: Logo & Slogan */}
                    <div className="lg:w-1/4 space-y-2">
                        <Link to="/" className="block">
                            <h2 className="text-3xl font-black tracking-wider uppercase">Zingle</h2>
                        </Link>
                        <p className="text-xs tracking-widest text-gray-400 uppercase">
                            Talk to Strangers
                        </p>
                    </div>

                    {/* Right: Link Columns */}
                    <div className="flex-1 w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Platform</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><FooterLink to="/">Home</FooterLink></li>
                                <li><FooterLink to="/about">About Us</FooterLink></li>
                                <li><FooterLink to="/features">Features</FooterLink></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Support</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><FooterLink to="/support/safety">Safety Center</FooterLink></li>
                                <li><FooterLink to="/guidelines">Guidelines</FooterLink></li>
                                <li><FooterLink to="/support/contact">Contact Us</FooterLink></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Legal</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><FooterLink to="/legal/terms">Terms of Service</FooterLink></li>
                                <li><FooterLink to="/legal/privacy">Privacy Policy</FooterLink></li>
                                <li><FooterLink to="/legal/cookies">Cookie Policy</FooterLink></li>
                            </ul>
                        </div>

                        {/* Column 4 */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Community</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><FooterLink to="/blog">Blog</FooterLink></li>
                                <li><FooterLink to="/partners">Partners</FooterLink></li>
                                <li><FooterLink to="/status">System Status</FooterLink></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 w-full mb-12"></div>

                {/* Bottom Section: Socials & Copyright */}
                <div className="flex flex-col items-center space-y-8">
                    {/* Social Icons */}
                    <div className="flex items-center gap-6">
                        <SocialLink href="#" icon={<Facebook size={18} />} />
                        <SocialLink href="#" icon={<Twitter size={18} />} />
                        <SocialLink href="#" icon={<Instagram size={18} />} />
                        <SocialLink href="#" icon={<Github size={18} />} />
                        <SocialLink href="#" icon={<Globe size={18} />} />
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-500 text-xs tracking-wide">
                        © {currentYear} Zingle Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <Link to={to} className="text-gray-300 hover:text-white transition-colors duration-200 block">
        {children}
    </Link>
);

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
    >
        {icon}
    </a>
);

export default Footer;
