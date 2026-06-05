import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDestinations } from '../../context/DestinationContext';
import { usePackages } from '../../context/PackageContext';
import { useHotels } from '../../context/HotelContext';
import DestinationCard from '../../components/cards/DestinationCard';
import PackageCard from '../../components/cards/PackageCard';
import HotelCard from '../../components/cards/HotelCard';
import LoginModal from '../../components/common/LoginModal';

const CATEGORIES = [
  { icon: '⛰️', label: 'Hill & Mountains' }, { icon: '🏛️', label: 'Heritage' },
  { icon: '🕌', label: 'Pilgrimage' }, { icon: '🧗', label: 'Adventure' },
  { icon: '🥾', label: 'Trekking' }, { icon: '🏖️', label: 'Beaches' },
  { icon: '🦁', label: 'Wildlife' }, { icon: '💑', label: 'Honeymoon' },
  { icon: '👨‍👩‍👧', label: 'Family Tours' }, { icon: '✈️', label: 'International Destinations' },
];

const MONTHS = [
  { icon: '❄️', name: 'Jan', season: 'Winter' }, { icon: '❄️', name: 'Feb', season: 'Winter' },
  { icon: '🌸', name: 'Mar', season: 'Spring' }, { icon: '🌸', name: 'Apr', season: 'Spring' },
  { icon: '☀️', name: 'May', season: 'Summer' }, { icon: '🌧️', name: 'Jun', season: 'Monsoon' },
  { icon: '🌧️', name: 'Jul', season: 'Monsoon' }, { icon: '🌧️', name: 'Aug', season: 'Monsoon' },
  { icon: '🍂', name: 'Sep', season: 'Autumn' }, { icon: '🍂', name: 'Oct', season: 'Autumn' },
  { icon: '🌤️', name: 'Nov', season: 'Winter' }, { icon: '❄️', name: 'Dec', season: 'Winter' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Travel Blogger', text: 'TripNova made our Bali trip absolutely magical. Every detail was perfectly planned!', avatar: 'PS', rating: 5 },
  { name: 'Rahul Verma', role: 'Engineer', text: 'The Maldives package was worth every penny. Exceptional service and stunning locations.', avatar: 'RV', rating: 5 },
  { name: 'Ananya Patel', role: 'Photographer', text: 'Kerala backwaters on a houseboat was a dream come true. TripNova delivered perfection.', avatar: 'AP', rating: 5 },
];

const Home = () => {
  const navigate = useNavigate();
  const { destinations } = useDestinations();
  const { packages } = usePackages();
  const { hotels } = useHotels();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('destinations');
  const [activeMonth, setActiveMonth] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/${searchType}?search=${encodeURIComponent(searchQuery)}`);
  };

  const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  return (
    <div>
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)}
        onLogin={() => { setShowLoginModal(false); navigate('/login'); }}
        onSignup={() => { setShowLoginModal(false); navigate('/signup'); }} />

      {/* Hero Banner */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,33,46,0.8) 0%, rgba(48,112,130,0.4) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center">
            <span style={{ background: 'rgba(234,153,64,0.25)', color: '#EA9940', padding: '6px 18px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>
              ✦ Explore the World
            </span>
            <h1 style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1.15, marginTop: 16, marginBottom: 20 }}>
              Your Next Adventure<br /><span style={{ color: '#EA9940' }}>Starts Here</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
              Discover breathtaking destinations, curated packages, and luxury stays across India and the world.
            </p>

            {/* Search Bar */}
            <div style={{ background: 'white', borderRadius: 20, padding: '20px 24px', maxWidth: 700, margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <form onSubmit={handleSearch}>
                <div className="row g-2 align-items-center">
                  <div className="col-md-3">
                    <select value={searchType} onChange={e => setSearchType(e.target.value)} className="form-select" style={{ border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.9rem' }}>
                      <option value="destinations">Destinations</option>
                      <option value="packages">Packages</option>
                      <option value="hotels">Hotels</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Where do you want to go?" style={{ border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '11px 16px', fontFamily: 'Inter', fontSize: '0.9rem', width: '100%' }} />
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-orange w-100" style={{ borderRadius: 10, padding: '11px', fontWeight: 700 }}>
                      <i className="bi bi-search me-2"></i>Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-padding bg-cream">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Popular Destinations</span>
            <h2 className="section-title">Explore Top Destinations</h2>
            <p className="section-subtitle">Handpicked destinations loved by thousands of travelers</p>
          </motion.div>
          <div className="row g-4">
            {destinations.slice(0, 6).map((dest, i) => (
              <div key={dest.id} className="col-lg-4 col-md-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <DestinationCard destination={dest} onLoginRequired={() => setShowLoginModal(true)} />
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button onClick={() => navigate('/destinations')} className="btn btn-teal px-5 py-3" style={{ borderRadius: 12, fontSize: '1rem' }}>
              View All Destinations <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Destination Categories */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Browse by Category</span>
            <h2 className="section-title">Find Your Travel Style</h2>
            <p className="section-subtitle">Choose from our wide range of travel categories</p>
          </motion.div>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => navigate(`/destinations?category=${encodeURIComponent(cat.label)}`)} className="category-pill">
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                  {cat.label}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Month */}
      <section className="section-padding bg-cream">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Plan by Season</span>
            <h2 className="section-title">Explore by Month</h2>
            <p className="section-subtitle">Find the best destinations for every time of year</p>
          </motion.div>
          <div className="row g-3">
            {MONTHS.map((m, i) => (
              <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <motion.div whileHover={{ y: -4 }} className={`month-card ${activeMonth === i ? 'active' : ''}`} onClick={() => setActiveMonth(activeMonth === i ? null : i)}>
                  <div className="month-icon">{m.icon}</div>
                  <div className="month-name">{m.name}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 2 }}>{m.season}</div>
                </motion.div>
              </div>
            ))}
          </div>
          {activeMonth !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4">
              <p style={{ color: '#307082', fontWeight: 600, fontFamily: 'Poppins' }}>
                Best destinations for {MONTHS[activeMonth].name}: Goa, Kerala, Rajasthan, Manali
              </p>
              <button onClick={() => navigate('/destinations')} className="btn btn-teal btn-sm">Explore Now</button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trending Packages */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Trending Now</span>
            <h2 className="section-title">Popular Tour Packages</h2>
            <p className="section-subtitle">Carefully crafted itineraries for unforgettable experiences</p>
          </motion.div>
          <div className="row g-4">
            {packages.slice(0, 3).map((pkg, i) => (
              <div key={pkg.id} className="col-lg-4 col-md-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <PackageCard pkg={pkg} />
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button onClick={() => navigate('/packages')} className="btn btn-teal px-5 py-3" style={{ borderRadius: 12, fontSize: '1rem' }}>
              View All Packages <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Resorts & Villas */}
      <section className="section-padding bg-cream">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Luxury Stays</span>
            <h2 className="section-title">Resorts & Villas</h2>
            <p className="section-subtitle">Premium accommodations for a truly luxurious experience</p>
          </motion.div>
          <div className="row g-4">
            {hotels.slice(0, 3).map((hotel, i) => (
              <div key={hotel.id} className="col-lg-4 col-md-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <HotelCard hotel={hotel} />
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button onClick={() => navigate('/hotels')} className="btn btn-teal px-5 py-3" style={{ borderRadius: 12, fontSize: '1rem' }}>
              View All Hotels <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #12212E, #307082)' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span style={{ background: 'rgba(234,153,64,0.2)', color: '#EA9940', padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>Testimonials</span>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '2.2rem', marginTop: 12 }}>Happy Travelers</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)' }}>Real experiences from real travelers</p>
          </motion.div>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-lg-4">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ color: '#ffc107', marginBottom: 12, fontSize: '1.1rem' }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
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

      {/* Gallery Preview */}
      <section className="section-padding bg-cream">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-5">
            <span className="section-badge">Travel Memories</span>
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">Beautiful moments captured by our travelers</p>
          </motion.div>
          <div className="row g-3">
            {[
              'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
              'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80',
              'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
              'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
              'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80',
              'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
            ].map((img, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <motion.div whileHover={{ scale: 1.05 }} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', cursor: 'pointer' }} onClick={() => navigate('/gallery')}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button onClick={() => navigate('/gallery')} className="btn btn-teal px-4">View Full Gallery</button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div {...fadeUp}>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '1.8rem', marginBottom: 8 }}>Get Travel Deals & Updates</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0 }}>Subscribe to our newsletter and never miss a great travel deal.</p>
              </motion.div>
            </div>
            <div className="col-lg-6">
              {subscribed ? (
                <div className="alert alert-success" style={{ borderRadius: 12 }}>
                  <i className="bi bi-check-circle me-2"></i>Thanks for subscribing! Great deals coming your way.
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="d-flex">
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email address" className="newsletter-input" required />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
