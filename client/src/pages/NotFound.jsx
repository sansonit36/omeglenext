import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1 className="error-title">Page Not Found</h1>
                <p className="error-description">
                    Oops! The page you're looking for seems to have wandered off into the digital void.
                    It might have been moved, deleted, or never existed in the first place.
                </p>

                <div className="error-actions">
                    <Link to="/" className="primary-button">
                        Go Home
                    </Link>
                    <Link to="/contact" className="secondary-button">
                        Contact Support
                    </Link>
                </div>

                <div className="helpful-links">
                    <h3>Maybe you were looking for:</h3>
                    <ul>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/guidelines">Community Guidelines</Link></li>
                        <li><Link to="/safety">Safety Center</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>
            </div>

            <div className="error-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
        </div>
    );
}
