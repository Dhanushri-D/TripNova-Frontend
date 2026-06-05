import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHotels } from '../../context/HotelContext';
import HotelCard from '../../components/cards/HotelCard';

const Hotels = () => {
  const { hotels } = useHotels();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [amenity, setAmenity] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const ALL_AMENITIES = ['All', 'Pool', 'Spa', 'Beach Access', 'Gym', 'Restaurant', 'WiFi', 'Mountain View'];

  const filtered = hotels.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const matchPrice = h.price <= maxPrice;
    const matchAmenity = amenity === 'All' || (h.amenities || []).includes(amenity);
    return matchSearch && matchPrice && matchAmenity;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Hotels & Villas</h1>
            <p>Luxury accommodations for every type of traveler</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          <div className="col-lg-3">
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)', position: 'sticky', top: 80 }}>
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}><i className="bi bi-funnel me-2 text-teal"></i>Filters</h6>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Search</label>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels..." className="form-control" style={{ borderRadius: 8 }} />
              </div>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Max Price/Night: ₹{maxPrice.toLocaleString()}</label>
                <input type="range" min="2000" max="100000" step="2000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="form-range" style={{ accentColor: '#307082' }} />
              </div>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Amenities</label>
                {ALL_AMENITIES.map(a => (
                  <div key={a} className="form-check mb-1">
                    <input className="form-check-input" type="radio" name="amenity" id={a} checked={amenity === a} onChange={() => setAmenity(a)} style={{ accentColor: '#307082' }} />
                    <label className="form-check-label" htmlFor={a} style={{ fontSize: '0.88rem', cursor: 'pointer' }}>{a}</label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{ borderRadius: 8, fontSize: '0.88rem' }}>
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <button onClick={() => { setSearch(''); setMaxPrice(100000); setAmenity('All'); setSortBy('default'); }} className="btn btn-outline-teal w-100 btn-sm">Reset Filters</button>
            </div>
          </div>

          <div className="col-lg-9">
            <p style={{ color: '#666', marginBottom: 20 }}>Showing <strong>{filtered.length}</strong> hotels</p>
            {filtered.length === 0 ? (
              <div className="empty-state"><i className="bi bi-building"></i><h5>No hotels found</h5></div>
            ) : (
              <div className="row g-4">
                {filtered.map((hotel, i) => (
                  <div key={hotel.id} className="col-md-6 col-xl-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <HotelCard hotel={hotel} />
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

export default Hotels;
