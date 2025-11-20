import LegalLayout from '../../layouts/LegalLayout';

export default function AboutUs() {
    return (
        <LegalLayout title="About OmeTV">
            <h2>🌍 Connecting People Worldwide</h2>
            <p>
                OmeTV is a free video chat platform that connects you with random people from around the world. Whether you're
                looking to make new friends, practice a language, or simply have interesting conversations, OmeTV makes it easy
                to meet people instantly.
            </p>

            <h2>Our Mission</h2>
            <p>
                We believe in the power of human connection. Our mission is to break down barriers and bring people together
                across cultures, languages, and borders. In a world that can feel increasingly divided, we're creating a space
                where anyone can connect with anyone, fostering understanding and friendship one conversation at a time.
            </p>

            <h2>How It Works</h2>
            <ol>
                <li><strong>Click Start:</strong> Grant camera and microphone permissions</li>
                <li><strong>Get Matched:</strong> We instantly connect you with a random person</li>
                <li><strong>Chat:</strong> Have a video conversation with your new connection</li>
                <li><strong>Next:</strong> Skip to meet someone new anytime you want</li>
            </ol>
            <p>It's that simple! No registration, no complicated setup—just instant connections.</p>

            <h2>Why Choose OmeTV?</h2>
            <ul>
                <li><strong>100% Free:</strong> No hidden fees, no premium tiers, completely free forever</li>
                <li><strong>Instant Connections:</strong> Start chatting in seconds with no delays</li>
                <li><strong>Global Community:</strong> Meet people from every corner of the world</li>
                <li><strong>Safe Environment:</strong> Active moderation and reporting tools keep our community safe</li>
                <li><strong>No Registration:</strong> Jump right in without creating an account</li>
                <li><strong>Mobile & Desktop:</strong> Use OmeTV on any device, anywhere</li>
            </ul>

            <h2>Our Values</h2>

            <h3>Safety First</h3>
            <p>
                We're committed to providing a safe environment for all users. Our moderation team works around the clock to
                review reports and remove users who violate our Community Guidelines.
            </p>

            <h3>Privacy Matters</h3>
            <p>
                We respect your privacy. We don't record your video chats, and we collect minimal data to operate the service.
                Your conversations are yours alone.
            </p>

            <h3>Inclusivity</h3>
            <p>
                OmeTV welcomes everyone. We celebrate diversity and have zero tolerance for discrimination, hate speech, or
                harassment of any kind.
            </p>

            <h3>Innovation</h3>
            <p>
                We're constantly improving our platform with new features and better technology to enhance your experience and
                make connections even more seamless.
            </p>

            <h2>By the Numbers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#6366f1' }}>10M+</h3>
                    <p style={{ margin: 0 }}>Monthly Users</p>
                </div>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#a855f7' }}>190+</h3>
                    <p style={{ margin: 0 }}>Countries</p>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#22c55e' }}>24/7</h3>
                    <p style={{ margin: 0 }}>Availability</p>
                </div>
            </div>

            <h2>Our Commitment to You</h2>
            <p>
                We're dedicated to maintaining a platform that's free, safe, and fun. We listen to our community and continuously
                work to improve based on your feedback. Your trust is important to us, and we take our responsibility seriously.
            </p>

            <h2>Join the Community</h2>
            <p>
                Ready to start meeting people from around the world? Click the button below to begin your OmeTV journey.
                Who knows—your next great friendship might be just one click away!
            </p>

            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    Start Chatting Now
                </a>
            </div>

            <h2>Contact Us</h2>
            <p>
                Have questions or feedback? We'd love to hear from you! Visit our <a href="/contact">Contact page</a> to get in touch.
            </p>
        </LegalLayout>
    );
}
