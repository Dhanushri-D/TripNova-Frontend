import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, renderStars } from '../../utils/helpers';

const TABS = [
  { key: 'destinations', label: 'Destinations', icon: 'bi-geo-alt' },
  { key: 'hotels',       label: 'Hotels',       icon: 'bi-building' },
  { key: 'packages',     label: 'Packages',     icon: 'bi-briefcase' },
];

const getLink = (item) => {
  if (item.itemType === 'hotel') return `/hotels/${item.id}`;
  if (item.itemType === 'package') return `/packages/${item.id}`;
  return `/destinations/${item.id}`;
};

const getLabel = (itemType) => {
  if (itemType === 'hotel') return 'Book Now';
  if (itemType === 'package') return 'View Package';
  return 'Explore';
};

const getPriceLabel = (itemType) => itemType === 'hotel' ? 'night' : 'person';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('destinations');

  const destinations = wishlist.filter(w => w.itemType === 'destination' || !w.itemType);
  const hotels       = wishlist.filter(w => w.itemType === 'hotel');
  const packages     = wishlist.filter(w => w.itemType === 'package');

  const countMap = { destinations: destinations.length, hotels: hotels.length, packages: packages.length };
  const items = activeTab === 'destinations' ? destinations : activeTab === 'hotels' ? hotels : packages;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>My Wishlist</h1>
            <p>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Tabs */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '10px 22px', borderRadius: 50, border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                background: activeTab === tab.key ? '#307082' : 'white',
                color: activeTab === tab.key ? 'white' : '#666',
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(48,112,130,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
              <span style={{ background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(48,112,130,0.1)', color: activeTab === tab.key ? 'white' : '#307082', borderRadius: 50, padding: '1px 8px', fontSize: '0.78rem', fontWeight: 700 }}>
                {countMap[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <i className={`bi ${TABS.find(t => t.key === activeTab)?.icon}`}></i>
            <h5>No {activeTab} saved yet</h5>
            <p>Start exploring and save your favourites!</p>
            <Link to={`/${activeTab}`} className="btn btn-teal mt-3">
              Explore {TABS.find(t => t.key === activeTab)?.label}
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {items.map((item, i) => (
              <div key={`${item.id}-${item.itemType}`} className="col-md-6 col-lg-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }} className="card-premium h-100">
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title || item.name}
                      style={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <button onClick={() => removeFromWishlist(item.id, item.itemType || 'destination')}
                      style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <i className="bi bi-heart-fill" style={{ color: '#e74c3c' }}></i>
                    </button>
                    {(item.category || item.type || item.duration) && (
                      <span className="badge-teal" style={{ position: 'absolute', bottom: 12, left: 12 }}>
                        {item.category || item.type || item.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{item.title || item.name}</h6>
                    <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: 10 }}>
                      <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>
                      {item.location || item.destination}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="star-rating mb-1">
                          {renderStars(item.rating).map((cls, j) => <i key={j} className={`bi ${cls}`}></i>)}
                        </div>
                        <div className="price-tag">
                          {formatPrice(item.price)}<span>/{getPriceLabel(item.itemType)}</span>
                        </div>
                      </div>
                      <Link to={getLink(item)} className="btn btn-teal btn-sm">
                        {getLabel(item.itemType)}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
