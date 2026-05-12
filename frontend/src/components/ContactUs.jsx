import { Globe, Mail, MessageCircle, Phone, Share2, MapPin, Clock3 } from 'lucide-react';
import './ContactUs.css';

const contactChannels = [
  {
    title: 'Admissions Support',
    icon: Phone,
    value: '+91 98765 43210',
    description: 'Talk to our admissions team for room availability and application help.',
  },
  {
    title: 'WhatsApp Support',
    icon: MessageCircle,
    value: '+91 91234 56789',
    description: 'Send us a message on WhatsApp for fast replies and status updates.',
  },
  {
    title: 'Email',
    icon: Mail,
    value: 'contact@hostelhq.com',
    description: 'Use email for detailed inquiries, documents, or partnership requests.',
  },
  {
    title: 'Visiting Address',
    icon: MapPin,
    value: '125 College Road, Knowledge City, Campus District',
    description: 'Visit our hostel office for guided tours and admissions counselling.',
  },
];

const socialLinks = [
  {
    title: 'Instagram',
    icon: Share2,
    handle: '@HostelHubOfficial',
    url: 'https://www.instagram.com/HostelHubOfficial',
  },
  {
    title: 'LinkedIn',
    icon: Globe,
    handle: '/company/hostelhub',
    url: 'https://www.linkedin.com/company/hostelhub',
  },
];

const ContactUs = () => {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <span className="section-label">Contact Us</span>
          <h1>Have a question? Let’s connect.</h1>
          <p>
            Our team is ready to support your hostel application, stay management, and student services requests.
            Reach us through phone, email, WhatsApp, or social channels.
          </p>

          <div className="contact-hero-cards">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <article key={channel.title} className="contact-hero-card">
                  <div className="contact-hero-icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="contact-card-title">{channel.title}</p>
                    <p className="contact-card-value">{channel.value}</p>
                    <p className="contact-card-text">{channel.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="contact-hero-side">
          <div className="contact-hero-box">
            <p className="contact-side-label">Office Hours</p>
            <h2>Mon - Sat</h2>
            <p>8:00 AM - 8:00 PM</p>
            <div className="contact-side-row">
              <Clock3 size={18} />
              <p>Weekend support available via WhatsApp.</p>
            </div>
          </div>
          <div className="contact-hero-visual">
            <div className="contact-visual-card">
              <div className="contact-visual-image" />
            </div>
          </div>
        </div>
      </section>

      <section className="social-section">
        <div className="section-header">
          <div>
            <span className="section-label">Social</span>
            <h2>Connect with us on social platforms.</h2>
          </div>
          <p>Follow our latest updates, student stories, and admission announcements.</p>
        </div>

        <div className="social-grid">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a key={social.title} href={social.url} target="_blank" rel="noreferrer" className="social-card">
                <div className="social-icon">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="social-title">{social.title}</p>
                  <p className="social-handle">{social.handle}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
