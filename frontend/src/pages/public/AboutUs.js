import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const team = [
    { name: 'Arjun Mehta', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Priya Sharma', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Rahul Verma', role: 'Travel Expert', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { name: 'Ananya Patel', role: 'Customer Experience', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>About TripNova</h1>
            <p>Your trusted partner for extraordinary travel experiences</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Mission */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-badge">Our Story</span>
              <h2 className="section-title">We Make Travel Dreams Come True</h2>
              <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 16 }}>
                Founded in 2020, TripNova was born from a passion for travel and a desire to make extraordinary experiences accessible to everyone. We believe that travel is not just about visiting places — it's about creating memories that last a lifetime.
              </p>
              <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 24 }}>
                Our team of experienced travel experts curates the finest destinations, packages, and accommodations to ensure every journey is perfect. From the serene backwaters of Kerala to the majestic Swiss Alps, we've got your dream destination covered.
              </p>
              <div className="row g-3">
                {[['500+', 'Destinations'], ['50K+', 'Happy Travelers'], ['200+', 'Tour Packages'], ['10+', 'Years Experience']].map(([num, label]) => (
                  <div key={label} className="col-6">
                    <div style={{ background: 'rgba(48,112,130,0.08)', borderRadius: 12, padding: '16px 20px' }}>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#307082' }}>{num}</div>
                      <div style={{ color: '#666', fontSize: '0.85rem' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80" alt="About TripNova" style={{ width: '100%', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} />
            </motion.div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-5">
          <span className="section-badge">Our Values</span>
          <h2 className="section-title">What Drives Us</h2>
        </div>
        <div className="row g-4 mb-5">
          {[
            { icon: 'bi-heart', title: 'Passion for Travel', desc: 'We are travelers ourselves, and we bring that passion to every trip we plan.' },
            { icon: 'bi-shield-check', title: 'Trust & Safety', desc: 'Your safety and satisfaction are our top priorities on every journey.' },
            { icon: 'bi-star', title: 'Excellence', desc: 'We strive for excellence in every detail, from booking to return.' },
            { icon: 'bi-globe', title: 'Sustainability', desc: 'We promote responsible tourism that respects local cultures and environments.' },
          ].map((v, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', height: '100%' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <i className={`bi ${v.icon} text-white`} style={{ fontSize: '1.4rem' }}></i>
                </div>
                <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 8 }}>{v.title}</h6>
                <p style={{ color: '#666', fontSize: '0.88rem', margin: 0 }}>{v.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-5">
          <span className="section-badge">Our Team</span>
          <h2 className="section-title">Meet the Experts</h2>
        </div>
        <div className="row g-4">
          {team.map((member, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                <img src={member.img} alt={member.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '3px solid #307082' }} />
                <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{member.name}</h6>
                <p style={{ color: '#307082', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{member.role}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
