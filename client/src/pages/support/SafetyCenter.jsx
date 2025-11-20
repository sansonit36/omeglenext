import LegalLayout from '../../layouts/LegalLayout';

export default function SafetyCenter() {
    return (
        <LegalLayout title="Safety Center">
            <p>
                Your safety is our top priority. This guide provides tips and resources to help you have a safe and positive
                experience on OmeTV.
            </p>

            <h2>🛡️ Safety Tips</h2>

            <h3>Protect Your Personal Information</h3>
            <ul>
                <li><strong>Never share:</strong> Full name, address, phone number, email, or financial information</li>
                <li><strong>Be cautious with:</strong> Social media profiles, workplace, school name, or specific location</li>
                <li><strong>Remember:</strong> Once shared, information cannot be taken back</li>
            </ul>

            <h3>Stay in Control</h3>
            <ul>
                <li><strong>Skip freely:</strong> You can skip to the next person at any time for any reason</li>
                <li><strong>Trust your instincts:</strong> If something feels wrong, end the conversation</li>
                <li><strong>Set boundaries:</strong> You're not obligated to answer personal questions</li>
                <li><strong>Report immediately:</strong> Use the report button if you see inappropriate behavior</li>
            </ul>

            <h3>Recognize Warning Signs</h3>
            <p>Be cautious if someone:</p>
            <ul>
                <li>Asks for personal information repeatedly</li>
                <li>Pressures you to move the conversation off-platform</li>
                <li>Makes you feel uncomfortable or unsafe</li>
                <li>Asks for money or financial help</li>
                <li>Appears to be underage</li>
                <li>Displays aggressive or threatening behavior</li>
                <li>Shares explicit content</li>
            </ul>

            <h2>🚨 How to Report</h2>
            <p>If you encounter inappropriate behavior:</p>
            <ol>
                <li><strong>Click the Report button</strong> during or immediately after the chat</li>
                <li><strong>Select the reason</strong> for your report (harassment, explicit content, underage user, etc.)</li>
                <li><strong>Provide details</strong> to help our moderation team understand the situation</li>
                <li><strong>Skip to next chat</strong> - you'll be matched with someone new</li>
            </ol>
            <p>
                Our moderation team reviews all reports promptly. Serious violations may result in immediate bans and, if necessary,
                reports to law enforcement.
            </p>

            <h2>👤 Privacy Best Practices</h2>
            <ul>
                <li><strong>Camera placement:</strong> Ensure your background doesn't reveal personal information</li>
                <li><strong>Screen sharing:</strong> Never share your screen with strangers</li>
                <li><strong>Recording:</strong> Assume any conversation could be recorded by the other person</li>
                <li><strong>Screenshots:</strong> Don't take screenshots of others without permission</li>
            </ul>

            <h2>👨‍👩‍👧‍👦 For Parents and Guardians</h2>
            <p>
                <strong>OmeTV is for users 18 and older.</strong> If you're a parent or guardian:
            </p>
            <ul>
                <li>Monitor your child's online activities</li>
                <li>Educate them about online safety and stranger danger</li>
                <li>Use parental controls and internet filters</li>
                <li>Keep computers in common areas of the home</li>
                <li>Have open conversations about their online experiences</li>
            </ul>
            <p>
                If you discover a minor using OmeTV, please report it immediately through our Contact page.
            </p>

            <h2>🆘 Crisis Resources</h2>
            <p>If you're in immediate danger, contact local emergency services (911 in the US).</p>

            <h3>International Resources</h3>
            <ul>
                <li><strong>Cyberbullying:</strong> <a href="https://www.stopbullying.gov" target="_blank" rel="noopener noreferrer">StopBullying.gov</a></li>
                <li><strong>Mental Health:</strong> <a href="https://www.nami.org" target="_blank" rel="noopener noreferrer">NAMI</a> or call 988 (US Suicide & Crisis Lifeline)</li>
                <li><strong>Child Safety:</strong> <a href="https://www.ncmec.org" target="_blank" rel="noopener noreferrer">National Center for Missing & Exploited Children</a></li>
                <li><strong>Online Safety:</strong> <a href="https://www.internetsafety101.org" target="_blank" rel="noopener noreferrer">Internet Safety 101</a></li>
            </ul>

            <h2>🔒 Technical Safety</h2>
            <ul>
                <li><strong>Use HTTPS:</strong> Always access OmeTV through a secure connection</li>
                <li><strong>Keep software updated:</strong> Use the latest browser version</li>
                <li><strong>Antivirus protection:</strong> Keep your device protected</li>
                <li><strong>Public WiFi:</strong> Avoid using OmeTV on unsecured public networks</li>
                <li><strong>VPN consideration:</strong> Consider using a VPN for additional privacy</li>
            </ul>

            <h2>📱 Device Permissions</h2>
            <p>OmeTV requires camera and microphone access to function. We recommend:</p>
            <ul>
                <li>Only granting permissions when actively using the service</li>
                <li>Revoking permissions when you're done</li>
                <li>Checking your browser's permission settings regularly</li>
                <li>Using browser extensions to manage permissions</li>
            </ul>

            <h2>💡 Additional Tips</h2>
            <ul>
                <li><strong>Use a nickname:</strong> You don't need to use your real name</li>
                <li><strong>Limit session time:</strong> Take breaks to avoid fatigue and maintain awareness</li>
                <li><strong>Stay sober:</strong> Don't use the service while impaired</li>
                <li><strong>Public space:</strong> Use OmeTV in a well-lit, appropriate environment</li>
                <li><strong>Read guidelines:</strong> Familiarize yourself with our Community Guidelines</li>
            </ul>

            <h2>📞 Contact Us</h2>
            <p>
                If you have safety concerns, questions, or need to report an incident, please visit our Contact page.
                We take all safety reports seriously and respond promptly.
            </p>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                <strong>Remember:</strong> Your safety is in your hands. Stay alert, trust your instincts, and don't hesitate
                to skip or report. Enjoy meeting new people, but always prioritize your wellbeing! 💙
            </p>
        </LegalLayout>
    );
}
