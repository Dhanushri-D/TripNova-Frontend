import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackages } from '../../context/PackageContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { renderStars, formatPrice } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import BookingSuccessModal from '../../components/common/BookingSuccessModal';
import EnquiryModal from '../../components/common/EnquiryModal';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPackageById } = usePackages();
  const { currentUser } = useAuth();
  const { addBooking, isBooked } = useBookings();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const pkg = getPackageById(id);
  const alreadyBooked = isBooked(id, 'package');
  const wishlisted = isInWishlist(id, 'package');

  const toggleWishlist = () => {
    if (!currentUser) return;
    if (wishlisted) removeFromWishlist(id, 'package');
    else addToWishlist({ ...pkg, itemType: 'package' }, 'package');
  };

  if (!pkg) return (
    <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <i className="bi bi-briefcase" style={{ fontSize: '4rem', color: '#ddd' }}></i>
      <h5>Package not found</h5>
      <button onClick={() => navigate('/packages')} className="btn btn-teal mt-3">Back to Packages</button>
    </div>
  );

  const handleBook = () => {
    if (!currentUser) return;
    addBooking(pkg, 'package');
    setShowSuccess(true);
  };

  return (
    <div>
      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} item={pkg} type="package" />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} item={pkg} type="package" />

      {/* Hero */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(18,33,46,0.85))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge-orange mb-2 d-inline-block">{pkg.duration}</span>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 8 }}>{pkg.title}</h1>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span style={{ color: 'rgba(255,255,255,0.85)' }}><i className="bi bi-geo-alt-fill me-1" style={{ color: '#EA9940' }}></i>{pkg.destination}</span>
                <span style={{ color: '#ffc107' }}>{renderStars(pkg.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)} <span style={{ color: 'white' }}>{pkg.rating}</span></span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 12 }}>About This Package</h4>
              <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 28 }}>{pkg.description}</p>

              {/* Includes */}
              {pkg.includes && (
                <div className="mb-4">
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>What's Included</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {pkg.includes.map((inc, i) => (
                      <span key={i} style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '6px 14px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600 }}>
                        <i className="bi bi-check-circle-fill me-1"></i>{inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && (
                <div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Day-by-Day Itinerary</h5>
                  {pkg.itinerary.map((day, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="itinerary-day">
                      <div className="itinerary-day-label">Day {day.day}</div>
                      <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 6 }}>{day.title}</h6>
                      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{day.activities}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', position: 'sticky', top: 80 }}>
              <div className="price-tag" style={{ fontSize: '1.8rem', marginBottom: 4 }}>{formatPrice(pkg.price)}</div>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 20 }}>per person</p>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginBottom: 20 }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Duration</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pkg.duration}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Destination</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pkg.destination}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Rating</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffc107' }}>★ {pkg.rating}/5</span>
                </div>
              </div>
              {alreadyBooked ? (
                <div style={{ background: '#d4edda', borderRadius: 10, padding: '12px', textAlign: 'center', marginBottom: 12 }}>
                  <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745' }}></i>
                  <span style={{ color: '#155724', fontWeight: 700 }}>Already Booked!</span>
                  <div style={{ fontSize: '0.78rem', color: '#28a745', marginTop: 4 }}>View in <a href="/my-bookings" style={{ color: '#307082', fontWeight: 600 }}>My Bookings</a></div>
                </div>
              ) : (
                <button onClick={handleBook} className="btn btn-orange w-100 mb-3" style={{ borderRadius: 10, padding: '12px', fontWeight: 700 }}>
                  <i className="bi bi-calendar-check me-2"></i>Book This Package
                </button>
              )}
              <button onClick={() => setShowEnquiry(true)} className="btn btn-outline-teal w-100" style={{ borderRadius: 10, padding: '10px' }}>
                <i className="bi bi-chat-dots me-2"></i>Enquire Now
              </button>
              <button onClick={toggleWishlist} className="btn w-100 mt-2" style={{ borderRadius: 10, padding: '10px', border: `1.5px solid ${wishlisted ? '#e74c3c' : '#ddd'}`, background: wishlisted ? '#fff5f5' : 'transparent', color: wishlisted ? '#e74c3c' : '#888', fontWeight: 600, transition: 'all 0.2s' }}>
                <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
