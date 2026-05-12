import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">HostelHub</h3>
                    <p className="footer-text">
                        Your trusted platform for hostel management and student accommodation.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4 className="footer-subheading">Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/"><span className="footer-link-icon">🏠</span>Home</a></li>
                        <li><a href="/"><span className="footer-link-icon">ℹ️</span>About</a></li>
                        <li><a href="/"><span className="footer-link-icon">💼</span>Services</a></li>
                        <li><a href="/"><span className="footer-link-icon">📞</span>Contact</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h4 className="footer-subheading">Contact Us</h4>
                    <ul className="footer-links">
                        <li><a href="mailto:support@hostelhub.com">📧 support@hostelhub.com</a></li>
                        <li><a href="tel:+1234567890">📞 +1 (234) 567-890</a></li>
                        <li><a href="/">📍 123 Main Street, City</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div className="footer-section">
                    <h4 className="footer-subheading">Follow Us</h4>
                    <div className="social-links">
                        <a href="/" title="Facebook" className="social-link">f</a>
                        <a href="/" title="Twitter" className="social-link">𝕏</a>
                        <a href="/" title="Instagram" className="social-link">📷</a>
                        <a href="/" title="LinkedIn" className="social-link">in</a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} HostelHub. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <a href="/">Privacy Policy</a>
                    <span>•</span>
                    <a href="/">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;