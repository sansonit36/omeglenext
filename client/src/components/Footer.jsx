import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Globe, Facebook } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-12 mt-auto font-sans border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Left: Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Link to="/" className="block no-underline">
                            <h2 className="text-2xl font-black tracking-wider uppercase text-white">Zingle</h2>
                        </Link>
                        <p className="text-gray-500 text-xs tracking-wide">
                            © {currentYear} Zingle Inc.
                        </p>
                    </div>

                    {/* Center: Compact Links (Horizontal) */}
                    <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
                        <FooterLink to="/about">About</FooterLink>
                        <FooterLink to="/features">Features</FooterLink>
                        <FooterLink to="/support/safety">Safety</FooterLink>
                        <FooterLink to="/guidelines">Guidelines</FooterLink>
                        <FooterLink to="/legal/terms">Terms</FooterLink>
                        <FooterLink to="/legal/privacy">Privacy</FooterLink>
                        <FooterLink to="/support/contact">Contact</FooterLink>
                    </div>

                    {/* Right: Socials */}
                    <div className="flex items-center gap-6">
                        <SocialLink href="#" icon={<Facebook size={16} />} />
                        <SocialLink href="#" icon={<Twitter size={16} />} />
                        <SocialLink href="#" icon={<Instagram size={16} />} />
                        <SocialLink href="#" icon={<Github size={16} />} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <Link to={to} className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 no-underline px-2">
        {children}
    </Link>
);

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:bg-white hover:text-black transition-all duration-300 no-underline"
    >
        {icon}
    </a>
);

export default Footer;
