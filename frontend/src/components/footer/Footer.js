import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-compass text-white" style={{ fontSize: '1.2rem' }}></i>
              </div>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '1.3rem' }}>
                Trip<em style={{ color: '#EA9940', fontStyle: 'normal' }}>Nova</em>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
              Your premium travel companion. Discover extraordinary destinations, curated packages, and unforgettable experiences worldwide.
            </p>
            <div>
              <a href="#!" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-twitter-x"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-youtube"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-title">Explore</h6>
            <Link to="/home" className="footer-link">Home</Link>
            <Link to="/destinations" className="footer-link">Destinations</Link>
            <Link to="/packages" className="footer-link">Packages</Link>
            <Link to="/hotels" className="footer-link">Hotels & Villas</Link>
            <Link to="/gallery" className="footer-link">Gallery</Link>
            <Link to="/reviews" className="footer-link">Reviews</Link>
          </div>

          {/* Company */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-title">Company</h6>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms & Conditions</Link>
            <Link to="/contact" className="footer-link">Enquiry</Link>
          </div>

          {/* Contact & Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-title">Stay Connected</h6>
            <div className="mb-3">
              <div className="d-flex align-items-start gap-2 mb-2">
                <i className="bi bi-geo-alt-fill" style={{ color: '#EA9940', marginTop: 2 }}></i>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>123 Travel Street, Mumbai, Maharashtra 400001</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-telephone-fill" style={{ color: '#EA9940' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>+91 98765 43210</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-envelope-fill" style={{ color: '#EA9940' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>hello@tripnova.com</span>
              </div>
            </div>
            {subscribed ? (
              <div className="alert alert-success py-2 px-3" style={{ borderRadius: 8, fontSize: '0.85rem' }}>
                <i className="bi bi-check-circle me-2"></i>Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginBottom: 10 }}>Subscribe for travel deals & updates</p>
                <div className="d-flex">
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Your email address" className="newsletter-input" required />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </div>
              </form>
            )}
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
            © 2024 TripNova. All rights reserved. Made with <i className="bi bi-heart-fill" style={{ color: '#EA9940' }}></i> for travelers.
          </p>
          <div className="d-flex gap-3">
            <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none' }}>Terms</Link>
            <Link to="/faq" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none' }}>FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
