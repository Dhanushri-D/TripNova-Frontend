import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../../utils/helpers';

const Section = ({ icon, title, items, color }) => (
  <div style={{ marginBottom: 20 }}>
    <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#12212E', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
      <i className={`bi ${icon}`} style={{ color }}></i>{title}
    </h6>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: `${color}12`, borderRadius: 8, padding: '8px 12px' }}>
          <i className="bi bi-check-circle-fill" style={{ color, fontSize: '0.8rem', marginTop: 3, flexShrink: 0 }}></i>
          <span style={{ fontSize: '0.88rem', color: '#444', fontFamily: 'Inter' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const TripDetailModal = ({ show, onClose, dest, onBook, alreadyBooked }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(18,33,46,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.25)', position: 'relative' }}
        >
          {/* Hero */}
          <div style={{ position: 'relative', height: 180, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
            <img src={dest?.image} alt={dest?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 20%, rgba(18,33,46,0.82))' }} />
            <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <i className="bi bi-x" style={{ color: 'white', fontSize: '1.2rem' }}></i>
            </button>
            <div style={{ position: 'absolute', bottom: 14, left: 20, right: 56 }}>
              <span style={{ background: '#EA9940', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6, display: 'inline-block' }}>{dest?.duration || dest?.category}</span>
              <h5 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0, fontSize: '1.2rem' }}>{dest?.title}</h5>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}><i className="bi bi-geo-alt-fill me-1" style={{ color: '#EA9940' }}></i>{dest?.location}</span>
            </div>
          </div>

          <div style={{ padding: '24px 24px 20px' }}>
            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: 'linear-gradient(135deg,#f0f8fa,#eef6f7)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(48,112,130,0.15)' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#307082', fontFamily: 'Poppins' }}>{formatPrice(dest?.price)}</div>
                <div style={{ color: '#888', fontSize: '0.78rem' }}>per person</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#12212E', fontSize: '0.9rem' }}>{dest?.duration}</div>
                <div style={{ color: '#888', fontSize: '0.78rem' }}>★ {dest?.rating}/5</div>
              </div>
            </div>

            {dest?.pickupPoints && <Section icon="bi-geo-alt-fill" title="Pickup Points" items={dest.pickupPoints} color="#307082" />}
            {dest?.coveringPlaces && <Section icon="bi-map-fill" title="Places Covered" items={dest.coveringPlaces} color="#EA9940" />}
            {dest?.tripHotels && <Section icon="bi-building-fill" title="Hotels Provided" items={dest.tripHotels} color="#6CA3A2" />}
            {dest?.droppingPoints && <Section icon="bi-flag-fill" title="Dropping Points" items={dest.droppingPoints} color="#e74c3c" />}

            {alreadyBooked ? (
              <div style={{ background: '#d4edda', borderRadius: 10, padding: '14px', textAlign: 'center', marginTop: 8 }}>
                <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745' }}></i>
                <span style={{ color: '#155724', fontWeight: 700 }}>Already Booked!</span>
                <div style={{ fontSize: '0.78rem', color: '#28a745', marginTop: 4 }}>
                  View in <a href="/my-bookings" style={{ color: '#307082', fontWeight: 600 }}>My Bookings</a>
                </div>
              </div>
            ) : (
              <button onClick={onBook} className="btn btn-orange w-100" style={{ borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: '1rem', marginTop: 8 }}>
                <i className="bi bi-calendar-check me-2"></i>Book This Trip
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default TripDetailModal;
