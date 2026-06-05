import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackages } from '../../context/PackageContext';
import PackageCard from '../../components/cards/PackageCard';

const Packages = () => {
  const { packages } = usePackages();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [maxBudget, setMaxBudget] = useState(200000);
  const [duration, setDuration] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const DURATIONS = ['All', '1-3 Days', '4-6 Days', '7-10 Days', '10+ Days'];

  const filtered = packages.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase());
    const matchBudget = p.price <= maxBudget;
    const days = parseInt(p.duration);
    const matchDuration = duration === 'All' ||
      (duration === '1-3 Days' && days <= 3) ||
      (duration === '4-6 Days' && days >= 4 && days <= 6) ||
      (duration === '7-10 Days' && days >= 7 && days <= 10) ||
      (duration === '10+ Days' && days > 10);
    return matchSearch && matchBudget && matchDuration;
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
            <h1>Tour Packages</h1>
            <p>Carefully crafted itineraries for every type of traveler</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          {/* Filters */}
          <div className="col-lg-3">
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)', position: 'sticky', top: 80 }}>
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}><i className="bi bi-funnel me-2 text-teal"></i>Filters</h6>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Search</label>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages..." className="form-control" style={{ borderRadius: 8 }} />
              </div>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Max Budget: ₹{maxBudget.toLocaleString()}</label>
                <input type="range" min="10000" max="200000" step="5000" value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))} className="form-range" style={{ accentColor: '#307082' }} />
              </div>
              <div className="mb-4">
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>Duration</label>
                {DURATIONS.map(d => (
                  <div key={d} className="form-check mb-1">
                    <input className="form-check-input" type="radio" name="duration" id={d} checked={duration === d} onChange={() => setDuration(d)} style={{ accentColor: '#307082' }} />
                    <label className="form-check-label" htmlFor={d} style={{ fontSize: '0.88rem', cursor: 'pointer' }}>{d}</label>
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
              <button onClick={() => { setSearch(''); setMaxBudget(200000); setDuration('All'); setSortBy('default'); }} className="btn btn-outline-teal w-100 btn-sm">Reset Filters</button>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-9">
            <p style={{ color: '#666', marginBottom: 20 }}>Showing <strong>{filtered.length}</strong> packages</p>
            {filtered.length === 0 ? (
              <div className="empty-state"><i className="bi bi-briefcase"></i><h5>No packages found</h5></div>
            ) : (
              <div className="row g-4">
                {filtered.map((pkg, i) => (
                  <div key={pkg.id} className="col-md-6 col-xl-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <PackageCard pkg={pkg} />
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

export default Packages;
