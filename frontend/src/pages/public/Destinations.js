import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDestinations } from '../../context/DestinationContext';
import DestinationCard from '../../components/cards/DestinationCard';
import LoginModal from '../../components/common/LoginModal';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Hill & Mountains', 'Heritage', 'Pilgrimage', 'Adventure', 'Trekking', 'Beaches', 'Wildlife', 'Honeymoon', 'Family Tours', 'International Destinations'];
// const SEASONS = ['All', 'January-March', 'April-June', 'July-September', 'October-December'];

const Destinations = () => {
  const { destinations } = useDestinations();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const filtered = destinations
    .filter(d => {
      const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || d.category === category;
      const matchRating = d.rating >= minRating;
      const matchPrice = d.price <= maxPrice;
      return matchSearch && matchCat && matchRating && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)}
        onLogin={() => { setShowLoginModal(false); navigate('/login'); }}
        onSignup={() => { setShowLoginModal(false); navigate('/signup'); }} />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Explore Destinations</h1>
            <p>Discover breathtaking places across India and the world</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)', position: 'sticky', top: 80 }}>
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20, color: '#12212E' }}>
                <i className="bi bi-funnel me-2 text-teal"></i>Filters
              </h6>

              {/* Search */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Search</label>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations..." className="form-control-premium form-control" />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Category</label>
                {CATEGORIES.map(cat => (
                  <div key={cat} className="form-check mb-1">
                    <input className="form-check-input" type="radio" name="category" id={cat} checked={category === cat} onChange={() => setCategory(cat)} style={{ accentColor: '#307082' }} />
                    <label className="form-check-label" htmlFor={cat} style={{ fontSize: '0.88rem', cursor: 'pointer' }}>{cat}</label>
                  </div>
                ))}
              </div>

              {/* Min Rating */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Min Rating: {minRating}★</label>
                <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="form-range" style={{ accentColor: '#307082' }} />
              </div>

              {/* Max Price */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Max Price: ₹{maxPrice.toLocaleString()}</label>
                <input type="range" min="5000" max="200000" step="5000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="form-range" style={{ accentColor: '#307082' }} />
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{ borderRadius: 8, fontSize: '0.88rem' }}>
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button onClick={() => { setSearch(''); setCategory('All'); setMinRating(0); setMaxPrice(200000); setSortBy('default'); }} className="btn btn-outline-teal w-100 btn-sm">
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <p style={{ margin: 0, color: '#666', fontFamily: 'Inter' }}>
                Showing <strong>{filtered.length}</strong> destinations
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-geo-alt"></i>
                <h5>No destinations found</h5>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="row g-4">
                {filtered.map((dest, i) => (
                  <div key={dest.id} className="col-md-6 col-xl-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <DestinationCard destination={dest} onLoginRequired={() => setShowLoginModal(true)} />
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
