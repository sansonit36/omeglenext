import { Link } from 'react-router-dom';
import './LegalLayout.css';

export default function LegalLayout({ children, title }) {
    return (
        <div className="legal-layout">
            <header className="legal-header">
                <div className="legal-header-content">
                    <Link to="/" className="logo-link">
                        <h1 className="logo">OmeTV</h1>
                    </Link>
                    <nav className="legal-nav">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/guidelines">Guidelines</Link>
                        <Link to="/safety">Safety</Link>
                    </nav>
                </div>
            </header>

            <main className="legal-main">
                <div className="legal-container">
                    <h1 className="legal-title">{title}</h1>
                    <div className="legal-content">
                        {children}
                    </div>
                </div>
            </main>

            <footer className="legal-footer">
                <div className="legal-footer-content">
                    <div className="footer-links">
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/cookies">Cookie Policy</Link>
                        <Link to="/guidelines">Community Guidelines</Link>
                        <Link to="/safety">Safety Center</Link>
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/about">About</Link>
                    </div>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} OmeTV. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
