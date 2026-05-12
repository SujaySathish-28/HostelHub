import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Coffee,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Zap,
  Car,
  Dumbbell,
  Stethoscope,
  Thermometer,
  ClipboardCheck,
  CalendarCheck,
  MessageCircle,
  Bell,
  ListChecks,
  Star,
  UserPlus,
  BellRing,
  MapPin,
  CheckCircle,
  Moon,
  Sun,
} from 'lucide-react';
import './Home.css';

const facilities = [
  {
    title: 'High Speed WiFi',
    description: 'Reliable connectivity across rooms, common areas, and study halls.',
    icon: Wifi,
    accent: 'facility-glow-a',
  },
  {
    title: 'Mess Facility',
    description: 'Fresh, nutritious meals served in a modern dining space.',
    icon: Coffee,
    accent: 'facility-glow-b',
  },
  {
    title: 'CCTV Security',
    description: '24/7 protected campus with secure entry and round-the-clock monitoring.',
    icon: ShieldCheck,
    accent: 'facility-glow-c',
  },
  {
    title: 'Study Room',
    description: 'Quiet study corners and collaborative learning spaces.',
    icon: BookOpen,
    accent: 'facility-glow-d',
  },
  {
    title: 'Library Access',
    description: 'Resource-rich library with books, journals, and study materials.',
    icon: Sparkles,
    accent: 'facility-glow-e',
  },
  {
    title: 'Power Backup',
    description: 'Uninterrupted living with emergency power systems.',
    icon: Zap,
    accent: 'facility-glow-f',
  },
  {
    title: 'Vehicle Parking',
    description: 'Safe, organized parking for bikes and vehicles.',
    icon: Car,
    accent: 'facility-glow-g',
  },
  {
    title: 'Modern Gym',
    description: 'Fitness space with expert equipment and wellness programs.',
    icon: Dumbbell,
    accent: 'facility-glow-h',
  },
  {
    title: 'Medical Support',
    description: 'On-call medical assistance and wellness supervision.',
    icon: Stethoscope,
    accent: 'facility-glow-i',
  },
  {
    title: 'Hot Water',
    description: 'Comfort with instant hot water supply in every washroom.',
    icon: Thermometer,
    accent: 'facility-glow-j',
  },
  {
    title: 'Housekeeping',
    description: 'Daily housekeeping for clean, comfortable living areas.',
    icon: ListChecks,
    accent: 'facility-glow-k',
  },
];

const plans = [
  {
    label: 'Single Sharing AC',
    price: '16,499',
    occupancy: '1 Student',
    features: ['Private study nook', 'Daily housekeeping', 'Premium mattress', 'AC & WiFi'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    popular: false,
  },
  {
    label: 'Double Sharing AC',
    price: '12,800',
    occupancy: '2 Students',
    features: ['Shared lounge', 'AC comfort', 'Wardrobe & study desk', 'Secure storage'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    popular: true,
  },
  {
    label: 'Triple Sharing Non-AC',
    price: '9,999',
    occupancy: '3 Students',
    features: ['Balanced affordability', 'Social living', 'Shared washroom', 'Community vibe'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    popular: false,
  },
  {
    label: 'Deluxe Premium Room',
    price: '18,999',
    occupancy: '1 Student',
    features: ['Executive suite', 'King size bed', 'Private washroom', 'Lounge access'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    popular: false,
  },
];

const features = [
  { title: 'Online Leave Requests', icon: ClipboardCheck, color: 'feature-glow-a' },
  { title: 'Digital Attendance', icon: CalendarCheck, color: 'feature-glow-b' },
  { title: 'Complaint Management', icon: MessageCircle, color: 'feature-glow-c' },
  { title: 'Smart Notice Board', icon: Bell, color: 'feature-glow-d' },
  { title: 'Mess Menu Updates', icon: Coffee, color: 'feature-glow-e' },
  { title: 'Student Remarks', icon: Star, color: 'feature-glow-f' },
  { title: 'Visitor Management', icon: UserPlus, color: 'feature-glow-g' },
  { title: 'Real-Time Alerts', icon: BellRing, color: 'feature-glow-h' },
];

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    label: 'Student Room',
  },
  {
    src: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1200&q=80',
    label: 'Mess Area',
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    label: 'Study Zone',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    label: 'Recreation',
  },
  {
    src: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
    label: 'Campus Walk',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    label: 'Welcome Lounge',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'B.Sc. Computer Science',
    quote: 'The hostel feels like a second home. The study spaces and security make every day easy.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Rohan Mehta',
    role: 'MBA Year 2',
    quote: 'Fresh food, friendly staff, and fast WiFi — everything we need is right here.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Anjali Kapoor',
    role: 'B.Tech Electronics',
    quote: 'A premium living experience with modern amenities and constant support.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
];

const announcements = [
  {
    title: 'New admissions open for summer intake',
    date: 'May 10, 2026',
    badge: 'Admissions',
    priority: 'High',
  },
  {
    title: 'Hostel reopens after summer break',
    date: 'Jun 1, 2026',
    badge: 'Notice',
    priority: 'Medium',
  },
  {
    title: 'Guest visitor rules updated',
    date: 'Apr 28, 2026',
    badge: 'Policy',
    priority: 'Low',
  },
  {
    title: 'Annual cultural evening registrations live',
    date: 'May 21, 2026',
    badge: 'Event',
    priority: 'High',
  },
];

const faqItems = [
  {
    question: 'How can I apply for a hostel room?',
    answer: 'Complete the application form, upload your documents, and our admissions team will review your request within 48 hours.',
  },
  {
    question: 'What is included in the monthly fees?',
    answer: 'Monthly fees include room rent, mess service, utilities, WiFi, housekeeping, and security support.',
  },
  {
    question: 'How do I raise a leave request?',
    answer: 'Use the digital leave request portal inside your student dashboard and submit your dates for approval.',
  },
  {
    question: 'Can visitors stay overnight?',
    answer: 'Visitor rules allow daytime access only. Overnight stays require prior permission from hostel management.',
  },
  {
    question: 'What is the room allocation policy?',
    answer: 'Rooms are assigned based on availability, academic year, and preference requests.',
  },
];

const statistics = [
  { label: 'Students', value: '700+' },
  { label: 'Rooms', value: '300+' },
  { label: 'Satisfaction', value: '98%' },
  { label: 'Years Experience', value: '15+' },
  { label: 'Security', value: '24/7' },
];

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleFaq = (index) => {
    setActiveFaq((current) => (current === index ? -1 : index));
  };

  return (
    <main className="home-page">
      <section id="home" className="hero-section">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="hero-copy"
          >
            <div className="hero-top-row">
              <span className="hero-badge">Premium Student Living</span>
              <button
                type="button"
                className="theme-switch"
                onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            <h1 className="hero-title">Safe, Smart & Comfortable Student Living</h1>
            <p className="hero-text">
              Discover a modern hostel community with cozy rooms, reliable support, and a student-first experience designed for academic success and wellbeing.
            </p>

            <div className="hero-actions">
              <a href="/sign-up" className="btn btn-primary">
                Apply for Hostel
              </a>
              <a href="#rooms" className="btn btn-secondary">
                Explore Rooms
              </a>
            </div>

            <div className="hero-stat-grid">
              {[
                { value: '700+', label: 'Students' },
                { value: '300+', label: 'Rooms' },
                { value: '24/7', label: 'Security' },
                { value: 'High-Speed', label: 'WiFi' },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -4 }}
                  className="hero-stat-card"
                >
                  <p className="hero-stat-value">{item.value}</p>
                  <p className="hero-stat-label">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="hero-visual"
          >
            <div className="hero-visual-card">
              <div className="hero-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern hostel living room"
                  loading="lazy"
                />
              </div>

              <div className="hero-floating-card hero-floating-a">
                <div className="floating-icon">
                  <Wifi size={18} />
                </div>
                <div>
                  <p className="floating-label">24/7 Connectivity</p>
                  <p className="floating-text">Campus-wide WiFi and fast room access.</p>
                </div>
              </div>

              <div className="hero-floating-card hero-floating-b">
                <div className="floating-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="floating-label">Secure Access</p>
                  <p className="floating-text">Round-the-clock CCTV and access management.</p>
                </div>
              </div>

              <div className="hero-floating-badge">
                <Sparkles size={16} />
                <span>Vibrant study life</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="about-section section-split">
        <div className="about-media">
          <div className="about-pill">Live your best college chapter in comfort</div>
          <div className="about-image-card">
            <img
              src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1000&q=80"
              alt="Student studying in modern hostel"
              loading="lazy"
            />
          </div>
          <div className="about-glass-card">
            <p className="glass-title">Mission</p>
            <p className="glass-text">Create a vibrant hostel environment rooted in safety, comfort, and academic growth.</p>
          </div>
        </div>

        <div className="about-copy">
          <span className="section-label">About the Hostel</span>
          <h2>Designed for students, built for the future.</h2>
          <p className="section-text">
            Our hostel blends premium living with cultural warmth. Enjoy private study corners, engaging common zones, secure campus access, and modern amenities tailored to your student journey.
          </p>

          <div className="about-grid">
            <div className="about-card">
              <p className="about-card-title">Safety-first living</p>
              <p className="about-card-text">Card access, security patrols, and responsive staff on duty.</p>
            </div>
            <div className="about-card">
              <p className="about-card-title">Academic atmosphere</p>
              <p className="about-card-text">Focused workspaces and peer study groups for better results.</p>
            </div>
            <div className="about-card">
              <p className="about-card-title">Community spirit</p>
              <p className="about-card-text">Student events, wellness clubs, and shared experiences every month.</p>
            </div>
          </div>

          <div className="about-stats">
            <div className="about-stat">
              <span>98%</span>
              <p>Resident satisfaction</p>
            </div>
            <div className="about-stat">
              <span>4.9/5</span>
              <p>Support rating</p>
            </div>
            <div className="about-stat">
              <span>15+</span>
              <p>Years of excellence</p>
            </div>
          </div>
        </div>
      </section>

      <section id="facilities" className="facilities-section">
        <div className="section-header">
          <div>
            <span className="section-label">Facilities</span>
            <h2>Everything your lifestyle needs in one place.</h2>
          </div>
          <p className="section-text">Explore the thoughtful amenities that make hostel life efficient, safe, and enjoyable.</p>
        </div>

        <div className="facility-grid">
          {facilities.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`facility-card ${item.accent}`}
              >
                <div className="facility-icon">
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="rooms" className="pricing-section">
        <div className="section-header">
          <div>
            <span className="section-label">Rooms</span>
            <h2>Room categories built for comfort and community.</h2>
          </div>
          <p className="section-text">Explore room types with practical layouts, modern amenities, and student-friendly living support.</p>
        </div>

        <div className="rooms-grid">
          {[
            {
              title: 'Single & Double Sharing',
              description: 'Private or shared rooms designed for focus, comfort, and a calm study experience.',
              icon: BookOpen,
            },
            {
              title: 'Secure Living Spaces',
              description: 'Controlled access, CCTV monitoring, and responsive staff for safe daily life.',
              icon: ShieldCheck,
            },
            {
              title: 'Community Wellness',
              description: 'Modern common areas, housekeeping, and healthy dining support included.',
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="room-card">
                <div className="room-icon">
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="pricing-meta rooms-meta">
          <div className="meta-card">
            <p>Flexible occupancy</p>
            <strong>Single, double, and shared room options</strong>
          </div>
          <div className="meta-card">
            <p>Wellness support</p>
            <strong>Daily housekeeping and mess support available</strong>
          </div>
          <div className="meta-card">
            <p>Easy application</p>
            <strong>Apply online and reserve your hostel room quickly</strong>
          </div>
        </div>
      </section>

      <section id="features" className="smart-features-section">
        <div className="section-header">
          <div>
            <span className="section-label">Smart Features</span>
            <h2>Digital tools for every student need.</h2>
          </div>
          <p className="section-text">Manage requests, notifications, attendance, and more from one intuitive portal.</p>
        </div>

        <div className="feature-grid">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.03 }}
                className={`feature-card ${item.color}`}
              >
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-header">
          <div>
            <span className="section-label">Gallery</span>
            <h2>Snapshots of the hostel experience.</h2>
          </div>
          <p className="section-text">See the rooms, facilities, and student lifestyle that make our community special.</p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((item) => (
            <motion.div whileHover={{ scale: 1.03 }} key={item.label} className="gallery-card">
              <img src={item.src} alt={item.label} loading="lazy" />
              <div className="gallery-overlay">
                <p>{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <div>
            <span className="section-label">Testimonials</span>
            <h2>What students and parents are saying.</h2>
          </div>
          <p className="section-text">Real reviews from people who live and thrive in our hostel.</p>
        </div>

        <div className="testimonial-slider">
          {testimonials.map((item) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="testimonial-card"
            >
              <div className="testimonial-meta">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div>
                  <p className="testimonial-name">{item.name}</p>
                  <p className="testimonial-role">{item.role}</p>
                </div>
              </div>
              <p className="testimonial-quote">“{item.quote}”</p>
              <div className="rating-row">
                {[...Array(item.rating)].map((_, index) => (
                  <Star key={index} size={16} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="announcements-section">
        <div className="section-header">
          <div>
            <span className="section-label">Announcements</span>
            <h2>Important updates and hostel news.</h2>
          </div>
          <p className="section-text">Stay current with all announcements, events, and rule updates.</p>
        </div>

        <div className="announcement-panel">
          {announcements.map((item) => (
            <div key={item.title} className="announcement-card">
              <div className="announcement-left">
                <span className="announcement-date">{item.date}</span>
                <span className="announcement-badge">{item.badge}</span>
              </div>
              <div>
                <p className="announcement-title">{item.title}</p>
                <span className={`announcement-priority priority-${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {statistics.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -8 }}
              className="stats-card"
            >
              <p className="stats-value">{item.value}</p>
              <p className="stats-label">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="location-section" id="contact">
        <div className="section-header">
          <div>
            <span className="section-label">Location</span>
            <h2>Find us at the heart of campus life.</h2>
          </div>
          <p className="section-text">Reach out for tours, admissions, or emergency support.</p>
        </div>

        <div className="location-grid">
          <div className="location-card map-card">
            <div className="map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.5829123844433!2d77.44386866323958!3d12.88195099904351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae389716ac10bf%3A0xc5c5afdafde66fe2!2sVCJV%2BX95%2C%20Kumbalgodu%2C%20Karnataka%20560074!5e0!3m2!1sen!2sin!4v1778354498772!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p>Interactive map view coming soon</p>
            </div>
          </div>
          <div className="location-card contact-card">
            <div className="contact-row">
              <span>Address</span>
              <p>125 College Road, Knowledge City, Campus District</p>
            </div>
            <div className="contact-row">
              <span>Phone</span>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-row">
              <span>Email</span>
              <p>admissions@hostelhq.com</p>
            </div>
            <div className="contact-row">
              <span>Office Hours</span>
              <p>Mon to Sat / 8:00 AM - 8:00 PM</p>
            </div>
            <div className="contact-row">
              <span>Emergency</span>
              <p>+91 90000 12345</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-header">
          <div>
            <span className="section-label">FAQ</span>
            <h2>Common questions answered.</h2>
          </div>
          <p className="section-text">Get clarity on admissions, pricing, and hostel policies.</p>
        </div>

        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className={`faq-card ${activeFaq === index ? 'faq-open' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <p>{item.question}</p>
                <span>{activeFaq === index ? '-' : '+'}</span>
              </div>
              {activeFaq === index && <p className="faq-answer">{item.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-copy">
          <span className="section-label">Join Now</span>
          <h2>Join Our Hostel Community Today</h2>
          <p className="section-text">
            Secure your room and become part of a supportive campus community built for modern student living.
          </p>
          <div className="hero-actions">
            <a href="/sign-up" className="btn btn-primary">
              Apply Now
            </a>
            <a href="/contact-us" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;