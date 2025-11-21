import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './LegalLayout.css';

export default function LegalLayout({ children, title }) {
    return (
        <div className="legal-layout bg-[#0f0f13] min-h-screen flex flex-col">
            <SEO title={title} />
            <header className="legal-header border-b border-white/10 bg-[#1a1a23]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <span className="font-bold text-xl tracking-tight text-white">Zingle</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link to="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/legal/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
                        <Link to="/support/safety" className="hover:text-white transition-colors">Safety</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h1>
                    <div className="legal-content prose prose-invert max-w-none">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
