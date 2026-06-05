import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDestinations } from '../../context/DestinationContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { renderStars, formatPrice } from '../../utils/helpers';
import LoginModal from '../../components/common/LoginModal';
import TripDetailModal from '../../components/common/TripDetailModal';
import BookingSuccessModal from '../../components/common/BookingSuccessModal';
import EnquiryModal from '../../components/common/EnquiryModal';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDestinationById } = useDestinations();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const { addBooking, isBooked } = useBookings();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const dest = getDestinationById(id);
  const alreadyBooked = isBooked(id, 'trip');

  if (!dest) return (
    <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <i className="bi bi-geo-alt" style={{ fontSize: '4rem', color: '#ddd' }}></i>
      <h5>Destination not found</h5>
      <button onClick={() => navigate('/destinations')} className="btn btn-teal mt-3">Back to Destinations</button>
    </div>
  );

  const inWishlist = isInWishlist(dest.id);

  const handleWishlist = () => {
    if (!currentUser) { setShowLoginModal(true); return; }
    inWishlist ? removeFromWishlist(dest.id) : addToWishlist(dest);
  };

  const handleBook = () => {
    if (!currentUser) { setShowLoginModal(true); return; }
    setShowTripDetail(true);
  };

  const handleConfirmBooking = () => {
    addBooking({ ...dest, destination: dest.location }, 'trip');
    setShowTripDetail(false);
    setShowSuccess(true);
  };

  return (
    <div>
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)}
        onLogin={() => { setShowLoginModal(false); navigate('/login'); }}
        onSignup={() => { setShowLoginModal(false); navigate('/signup'); }} />

      <TripDetailModal show={showTripDetail} onClose={() => setShowTripDetail(false)} dest={dest} onBook={handleConfirmBooking} alreadyBooked={alreadyBooked} />
      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} item={{ ...dest, destination: dest.location }} type="trip" />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} item={{ ...dest, destination: dest.location }} type="package" />

      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <img src={dest.image} alt={dest.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(18,33,46,0.85))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge-teal mb-2 d-inline-block">{dest.category}</span>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 900, color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 8 }}>{dest.title}</h1>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span style={{ color: 'rgba(255,255,255,0.85)' }}><i className="bi bi-geo-alt-fill me-1" style={{ color: '#EA9940' }}></i>{dest.location}</span>
                <span style={{ color: '#ffc107' }}>{renderStars(dest.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)} <span style={{ color: 'white' }}>{dest.rating}</span></span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}><i className="bi bi-calendar3 me-1" style={{ color: '#EA9940' }}></i>Best: {dest.bestSeason}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>About {dest.title}</h4>
              <p style={{ color: '#555', lineHeight: 1.8, fontSize: '1rem', marginBottom: 28 }}>{dest.description}</p>

              {dest.highlights && (
                <div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>Highlights</h5>
                  <div className="row g-3">
                    {dest.highlights.map((h, i) => (
                      <div key={i} className="col-md-6">
                        <div style={{ background: 'rgba(48,112,130,0.08)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <i className="bi bi-check-circle-fill" style={{ color: '#307082' }}></i>
                          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '0.9rem' }}>{h}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', position: 'sticky', top: 80 }}>
              <div className="price-tag" style={{ fontSize: '1.8rem', marginBottom: 4 }}>{formatPrice(dest.price)}</div>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 20 }}>per person</p>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginBottom: 16 }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Category</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dest.category}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Best Season</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dest.bestSeason}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Rating</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffc107' }}>★ {dest.rating}/5</span>
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
                  <i className="bi bi-calendar-check me-2"></i>Book This Trip
                </button>
              )}
              <button onClick={() => setShowEnquiry(true)} className="btn btn-outline-teal w-100 mb-2" style={{ borderRadius: 10, padding: '10px' }}>
                <i className="bi bi-chat-dots me-2"></i>Enquire Now
              </button>
              <button onClick={handleWishlist} className={`btn w-100 ${inWishlist ? 'btn-danger' : 'btn-outline-teal'}`} style={{ borderRadius: 10, padding: '10px' }}>
                <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
