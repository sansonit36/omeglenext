import { useState } from 'react';
import LegalLayout from '../../layouts/LegalLayout';
import './ContactUs.css';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <LegalLayout title="Contact Us">
            <p>
                Have questions, concerns, or feedback? We'd love to hear from you. Fill out the form below and our team
                will get back to you as soon as possible.
            </p>

            <div className="contact-methods">
                <div className="contact-method">
                    <h3>📧 Email Support</h3>
                    <p>For general inquiries: <a href="mailto:support@ometv.com">support@ometv.com</a></p>
                    <p>For safety concerns: <a href="mailto:safety@ometv.com">safety@ometv.com</a></p>
                </div>

                <div className="contact-method">
                    <h3>⏱️ Response Time</h3>
                    <p>We typically respond within 24-48 hours during business days.</p>
                </div>
            </div>

            <h2>Send Us a Message</h2>

            {submitted ? (
                <div className="success-message">
                    <h3>✅ Message Sent!</h3>
                    <p>Thank you for contacting us. We'll get back to you soon.</p>
                </div>
            ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject *</label>
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="safety">Safety Concern</option>
                            <option value="ban">Ban Appeal</option>
                            <option value="feedback">Feedback</option>
                            <option value="partnership">Partnership/Business</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message *</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Tell us more about your inquiry..."
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Send Message
                    </button>
                </form>
            )}

            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>

                <div className="faq-item">
                    <h3>How do I report inappropriate behavior?</h3>
                    <p>Use the Report button during or immediately after a chat. For urgent safety concerns, email safety@ometv.com.</p>
                </div>

                <div className="faq-item">
                    <h3>Why was I banned?</h3>
                    <p>Bans occur when users violate our Community Guidelines. Review the guidelines and submit a ban appeal if you believe it was in error.</p>
                </div>

                <div className="faq-item">
                    <h3>How do I delete my data?</h3>
                    <p>Email us at support@ometv.com with your request. We'll process data deletion requests within 30 days.</p>
                </div>

                <div className="faq-item">
                    <h3>Is my video chat recorded?</h3>
                    <p>No, we do not record or store video chats. However, we cannot control what other users may do.</p>
                </div>
            </div>
        </LegalLayout>
    );
}
