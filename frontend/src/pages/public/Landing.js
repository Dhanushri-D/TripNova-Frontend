import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import { motion } from 'framer-motion';

const DESTINATIONS_PREVIEW = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
  { name: 'Switzerland', country: 'Europe', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80' },
  { name: 'Kerala', country: 'India', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=80' },
  { name: 'Manali', country: 'India', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
  { name: 'Goa', country: 'India', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Travel Blogger', text: 'TripNova made our Bali trip absolutely magical. Every detail was perfectly planned!', avatar: 'PS', rating: 5 },
  { name: 'Rahul Verma', role: 'Software Engineer', text: 'The Maldives package was worth every penny. Exceptional service and stunning locations.', avatar: 'RV', rating: 5 },
  { name: 'Ananya Patel', role: 'Photographer', text: 'Kerala backwaters on a houseboat was a dream come true. TripNova delivered perfection.', avatar: 'AP', rating: 5 },
];

const FEATURES = [
  { icon: 'bi-compass', title: 'Curated Destinations', desc: 'Handpicked destinations across India and the world' },
  { icon: 'bi-shield-check', title: 'Safe & Secure', desc: 'Verified hotels, packages, and travel partners' },
  { icon: 'bi-headset', title: '24/7 Support', desc: 'Round-the-clock travel assistance for peace of mind' },
  { icon: 'bi-wallet2', title: 'Best Prices', desc: 'Competitive pricing with no hidden charges' },
  { icon: 'bi-map', title: 'Custom Itineraries', desc: 'Personalized trip plans tailored to your preferences' },
  { icon: 'bi-star', title: 'Premium Experience', desc: 'Luxury travel experiences at every budget level' },
];

const Landing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,163,162,${p.opacity})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <div style={{ background: '#12212E', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }} />
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,33,46,0.9) 0%, rgba(48,112,130,0.6) 100%)' }} />
        {/* Particles */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              {/* Logo */}
              <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(234,153,64,0.4)' }}>
                  <i className="bi bi-compass text-white" style={{ fontSize: '1.6rem' }}></i>
                </div>
                <span style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: '2rem', letterSpacing: '-0.5px' }}>
                  Trip<em style={{ color: '#EA9940', fontStyle: 'normal' }}>Nova</em>
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <span style={{ background: 'rgba(234,153,64,0.2)', color: '#EA9940', padding: '6px 16px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>
                  ✦ Premium Travel Experiences
                </span>
                <h1 style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.15, marginTop: 16, marginBottom: 20 }}>
                  Discover the World's<br />
                  <span style={{ color: '#EA9940' }}>Most Beautiful</span><br />
                  Destinations
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
                  From the serene backwaters of Kerala to the pristine beaches of Maldives — TripNova crafts extraordinary journeys that become lifelong memories.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" style={{ background: 'linear-gradient(135deg, #EA9940, #d4882e)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 32px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(234,153,64,0.4)' }}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/destinations" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '14px 32px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block', backdropFilter: 'blur(10px)' }}>
                      <i className="bi bi-compass me-2"></i>Explore Trips
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="d-flex flex-wrap gap-4 mt-5">
                {[['500+', 'Destinations'], ['50K+', 'Happy Travelers'], ['200+', 'Tour Packages'], ['4.9★', 'Average Rating']].map(([num, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.6rem', color: '#EA9940' }}>{num}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right side floating cards */}
            <div className="col-lg-5 d-none d-lg-block">
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }} style={{ position: 'relative', height: 500 }}>
                {[
                  { img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80', name: 'Bali, Indonesia', top: 0, left: 20, rotate: -5 },
                  { img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=80', name: 'Maldives', top: 120, left: 160, rotate: 5 },
                  { img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=300&q=80', name: 'Kerala, India', top: 260, left: 40, rotate: -3 },
                ].map((card, i) => (
                  <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: card.top, left: card.left, width: 200, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', transform: `rotate(${card.rotate}deg)` }}>
                    <img src={card.img} alt={card.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                    <div style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 14px' }}>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: '#12212E' }}>{card.name}</div>
                      <div style={{ color: '#ffc107', fontSize: '0.75rem' }}>★★★★★</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div style={{ fontSize: '0.75rem', marginBottom: 6, letterSpacing: 2 }}>SCROLL</div>
          <i className="bi bi-chevron-double-down"></i>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: '#1a2f3f' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ background: 'rgba(234,153,64,0.2)', color: '#EA9940', padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>Why TripNova</span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '2.2rem', marginTop: 12 }}>Travel Smarter, Not Harder</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Everything you need for the perfect journey</p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <i className={`bi ${f.icon} text-white`} style={{ fontSize: '1.3rem' }}></i>
                  </div>
                  <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'white', marginBottom: 8 }}>{f.title}</h6>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', margin: 0 }}>{f.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Preview */}
      <section style={{ padding: '80px 0', background: '#12212E' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ background: 'rgba(48,112,130,0.3)', color: '#6CA3A2', padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>Popular Destinations</span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '2.2rem', marginTop: 12 }}>Where Will You Go Next?</h2>
          </div>
          <div className="row g-3">
            {DESTINATIONS_PREVIEW.map((dest, i) => (
              <div key={i} className="col-lg-4 col-md-6 col-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3' }}
                  onClick={() => navigate('/destinations')}>
                  <img src={dest.img} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(18,33,46,0.85))' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'white', fontSize: '1rem' }}>{dest.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{dest.country}</div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/home')}
              style={{ background: 'linear-gradient(135deg, #307082, #6CA3A2)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 40px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Explore All Destinations <i className="bi bi-arrow-right ms-2"></i>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 0', background: '#1a2f3f' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ background: 'rgba(234,153,64,0.2)', color: '#EA9940', padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>Testimonials</span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '2.2rem', marginTop: 12 }}>What Our Travelers Say</h2>
          </div>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-lg-4">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#ffc107', marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #307082, #12212E)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(234,153,64,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(108,163,162,0.1)' }} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>
              Ready to Start Your<br /><span style={{ color: '#EA9940' }}>Dream Journey?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
              Join thousands of happy travelers who trust TripNova for their adventures.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/home')}
                style={{ background: 'linear-gradient(135deg, #EA9940, #d4882e)', color: 'white', border: 'none', borderRadius: 12, padding: '16px 40px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(234,153,64,0.4)' }}>
                <i className="bi bi-compass me-2"></i>Start Exploring
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/signup" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '14px 36px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', display: 'inline-block', backdropFilter: 'blur(10px)' }}>
                  <i className="bi bi-person-plus me-2"></i>Create Free Account
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
