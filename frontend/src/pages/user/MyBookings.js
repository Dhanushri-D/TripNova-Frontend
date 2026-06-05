import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings, PENALTY_RATE } from '../../context/BookingContext';
import { formatPrice, formatDate } from '../../utils/helpers';

const TABS = ['All', 'Packages', 'Hotels', 'Trips'];

const CancelModal = ({ booking, onConfirm, onClose }) => {
  const penalty = Math.round(booking.price * PENALTY_RATE);
  const refund = booking.price - penalty;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,33,46,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(231,76,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ color: '#e74c3c', fontSize: '1.8rem' }}></i>
          </div>
          <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 8 }}>Cancel Booking?</h5>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Are you sure you want to cancel <strong>{booking.title}</strong>?</p>
        </div>

        <div style={{ background: '#fff8f0', border: '1px solid #fde8cc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#EA9940', fontSize: '0.85rem', marginBottom: 10 }}>
            <i className="bi bi-info-circle-fill me-2"></i>Cancellation Policy
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span style={{ color: '#666', fontSize: '0.88rem' }}>Booking Amount</span>
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatPrice(booking.price)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span style={{ color: '#e74c3c', fontSize: '0.88rem' }}>Penalty ({PENALTY_RATE * 100}%)</span>
            <span style={{ fontWeight: 600, color: '#e74c3c', fontSize: '0.88rem' }}>- {formatPrice(penalty)}</span>
          </div>
          <div style={{ borderTop: '1px solid #fde8cc', paddingTop: 8, marginTop: 4 }} className="d-flex justify-content-between">
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Refund Amount</span>
            <span style={{ fontWeight: 800, color: '#28a745', fontSize: '0.9rem' }}>{formatPrice(refund)}</span>
          </div>
        </div>

        <p style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', marginBottom: 20 }}>
          The penalty covers arrangement costs (transport, food, logistics) already organized by TripNova.
        </p>

        <div className="d-flex gap-3">
          <button onClick={onClose} className="btn btn-outline-teal w-100" style={{ borderRadius: 10 }}>Keep Booking</button>
          <button onClick={() => onConfirm(booking.id)} className="btn w-100" style={{ background: '#e74c3c', color: 'white', borderRadius: 10, border: 'none', fontWeight: 600 }}>
            Cancel & Get {formatPrice(refund)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MyBookings = () => {
  const { bookings, cancelBooking, completeBooking, deleteBooking } = useBookings();
  const [activeTab, setActiveTab] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelledMsg, setCancelledMsg] = useState(false);

  const filtered = bookings.filter(b => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Packages') return b.type === 'package';
    if (activeTab === 'Hotels') return b.type === 'hotel';
    if (activeTab === 'Trips') return b.type === 'trip';
    return true;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const confirmed = filtered.filter(b => b.status === 'confirmed');
  const completed = filtered.filter(b => b.status === 'completed');
  const cancelled = filtered.filter(b => b.status === 'cancelled');

  const handleConfirmCancel = (id) => {
    cancelBooking(id);
    setCancelTarget(null);
    setCancelledMsg(true);
    setTimeout(() => setCancelledMsg(false), 3000);
  };

  const typeIcon = (type) => type === 'hotel' ? 'bi-building' : type === 'trip' ? 'bi-geo-alt' : 'bi-briefcase';
  const typeColor = (type) => type === 'hotel' ? '#307082' : type === 'trip' ? '#6CA3A2' : '#EA9940';
  const typeLink = (b) => b.type === 'hotel' ? `/hotels/${b.itemId}` : b.type === 'trip' ? `/destinations/${b.itemId}` : `/packages/${b.itemId}`;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>My Bookings</h1>
            <p>Manage all your confirmed trips and hotel stays</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        {cancelledMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="alert d-flex align-items-center gap-2 mb-4"
            style={{ background: '#d4edda', border: 'none', borderRadius: 12, color: '#155724' }}>
            <i className="bi bi-check-circle-fill"></i> Booking cancelled. Refund will be processed within 5-7 business days.
          </motion.div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: 'bi-calendar-check', color: '#307082' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: 'bi-check-circle', color: '#28a745' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: 'bi-patch-check', color: '#307082' },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: 'bi-x-circle', color: '#e74c3c' },
          ].map((s, i) => (
            <div key={i} className="col-md-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 15px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.3rem' }}></i>
                </div>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#888', fontSize: '0.82rem', marginTop: 2 }}>{s.label}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 20px', borderRadius: 50, border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab ? '#307082' : 'white',
                color: activeTab === tab ? 'white' : '#666',
                boxShadow: activeTab === tab ? '0 4px 12px rgba(48,112,130,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Confirmed Bookings */}
        {confirmed.length > 0 && (
          <div className="mb-5">
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16, color: '#28a745' }}>
              <i className="bi bi-check-circle-fill me-2"></i>Confirmed ({confirmed.length})
            </h6>
            <div className="row g-3">
              {confirmed.map((b, i) => (
                <div key={b.id} className="col-lg-6">
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', display: 'flex', border: '1.5px solid #e8f5e9' }}>
                    <div style={{ position: 'relative', width: 120, flexShrink: 0 }}>
                      <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 8, left: 8, background: typeColor(b.type), borderRadius: 6, padding: '2px 8px', fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>
                        <i className={`bi ${typeIcon(b.type)} me-1`}></i>{b.type}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.92rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{b.title}</h6>
                        <span style={{ background: '#d4edda', color: '#155724', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          <i className="bi bi-check-circle-fill me-1"></i>Confirmed
                        </span>
                      </div>
                      {b.destination && <p style={{ color: '#888', fontSize: '0.78rem', margin: '0 0 6px' }}><i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{b.destination}</p>}
                      <div className="d-flex gap-2 flex-wrap mb-8" style={{ marginBottom: 8 }}>
                        <span style={{ color: '#307082', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem' }}>{formatPrice(b.price)}</span>
                        {b.duration && <span style={{ background: 'rgba(234,153,64,0.1)', color: '#EA9940', padding: '1px 8px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600 }}>{b.duration}</span>}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: '#aaa', fontSize: '0.72rem' }}>{formatDate(b.createdAt)}</span>
                        <div className="d-flex gap-2">
                          <Link to={typeLink(b)} style={{ fontSize: '0.75rem', color: '#307082', textDecoration: 'none', fontWeight: 600 }}>View</Link>
                          <button onClick={() => completeBooking(b.id)}
                            style={{ background: 'none', border: 'none', color: '#307082', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                            Complete
                          </button>
                          <button onClick={() => setCancelTarget(b)}
                            style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Bookings */}
        {completed.length > 0 && (
          <div className="mb-5">
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16, color: '#307082' }}>
              <i className="bi bi-patch-check-fill me-2"></i>Completed ({completed.length})
            </h6>
            <div className="row g-3">
              {completed.map((b, i) => (
                <div key={b.id} className="col-lg-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                    style={{ background: '#f8fbfc', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', border: '1.5px solid #d0e8f0' }}>
                    <div style={{ width: 100, flexShrink: 0 }}>
                      <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1 }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>{b.title}</h6>
                        <span style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          <i className="bi bi-patch-check-fill me-1"></i>Completed
                        </span>
                      </div>
                      {b.destination && <p style={{ color: '#888', fontSize: '0.78rem', margin: '0 0 6px' }}><i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{b.destination}</p>}
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span style={{ color: '#aaa', fontSize: '0.72rem' }}>Completed {formatDate(b.completedAt)}</span>
                        <button onClick={() => deleteBooking(b.id)}
                          style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {cancelled.length > 0 && (
          <div>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16, color: '#e74c3c' }}>
              <i className="bi bi-x-circle-fill me-2"></i>Cancelled ({cancelled.length})
            </h6>
            <div className="row g-3">
              {cancelled.map((b, i) => (
                <div key={b.id} className="col-lg-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                    style={{ background: '#fafafa', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', border: '1.5px solid #fde8e8', opacity: 0.8 }}>
                    <div style={{ width: 100, flexShrink: 0, position: 'relative' }}>
                      <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%)' }} />
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1 }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem', margin: 0, color: '#888' }}>{b.title}</h6>
                        <span style={{ background: '#fde8e8', color: '#e74c3c', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>Cancelled</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Refund: <strong style={{ color: '#28a745' }}>{formatPrice(b.price - Math.round(b.price * PENALTY_RATE))}</strong></span>
                        <button onClick={() => deleteBooking(b.id)}
                          style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <h5>No bookings yet</h5>
            <p>Start exploring and book your dream trip!</p>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <Link to="/packages" className="btn btn-teal btn-sm">Browse Packages</Link>
              <Link to="/hotels" className="btn btn-outline-teal btn-sm">Browse Hotels</Link>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelTarget && (
          <CancelModal booking={cancelTarget} onConfirm={handleConfirmCancel} onClose={() => setCancelTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
