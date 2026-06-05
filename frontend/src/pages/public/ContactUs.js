import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { enquiriesAPI } from '../../services/api';
import { useDestinations } from '../../context/DestinationContext';

const ContactUs = () => {
  const { destinations } = useDestinations();
  const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiriesAPI.create({ ...form, enquiryType: 'General Information' });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', destination: '', message: '' });
    } catch (err) {
      console.error('Enquiry failed', err);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Let's plan your dream trip together!</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 24 }}>Get in Touch</h4>
              {[
                { icon: 'bi-geo-alt-fill', title: 'Our Office', info: '123 Travel Street, Mumbai, Maharashtra 400001' },
                { icon: 'bi-telephone-fill', title: 'Phone', info: '+91 98765 43210' },
                { icon: 'bi-envelope-fill', title: 'Email', info: 'hello@tripnova.com' },
                { icon: 'bi-clock-fill', title: 'Working Hours', info: 'Mon-Sat: 9AM - 7PM' },
              ].map((item, i) => (
                <div key={i} className="d-flex gap-3 mb-4">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(48,112,130,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${item.icon}`} style={{ color: '#307082', fontSize: '1.1rem' }}></i>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ color: '#666', fontSize: '0.88rem' }}>{item.info}</div>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 12 }}>Follow Us</h6>
                <div>
                  {['bi-facebook', 'bi-instagram', 'bi-twitter-x', 'bi-youtube'].map((icon, i) => (
                    <a key={i} href="#!" className="social-icon" style={{ background: 'rgba(48,112,130,0.1)', color: '#307082' }}>
                      <i className={`bi ${icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enquiry Form */}
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 24 }}>Send an Enquiry</h4>
              {submitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4">
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(40,167,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', color: '#28a745' }}></i>
                  </div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Enquiry Submitted!</h5>
                  <p style={{ color: '#666' }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-teal">Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Name *</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Your full name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email *</label>
                      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="form-control" placeholder="your@email.com" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Phone</label>
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="+91 98765 43210" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Destination of Interest</label>
                      <select value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="form-select">
                        <option value="">Select destination...</option>
                        {destinations.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Message *</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="form-control" rows={4} placeholder="Tell us about your travel plans, dates, group size, budget..." required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-teal px-5 py-3" style={{ borderRadius: 10, fontWeight: 700 }}>
                        <i className="bi bi-send me-2"></i>Send Enquiry
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
