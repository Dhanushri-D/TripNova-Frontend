import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { renderStars, formatPrice, truncate } from '../../utils/helpers';

const DestinationCard = ({ destination, onLoginRequired }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const { isBooked } = useBookings();
  const inWishlist = isInWishlist(destination.id);
  const booked = isBooked(destination.id, 'trip');

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!currentUser) { onLoginRequired && onLoginRequired(); return; }
    inWishlist ? removeFromWishlist(destination.id) : addToWishlist(destination);
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="card-premium h-100">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={destination.image} alt={destination.title} className="destination-card-img" style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {booked && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#28a745', color: 'white', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-check-circle-fill"></i> Booked
          </span>
        )}
        {!booked && (
          <button className={`wishlist-btn ${inWishlist ? 'active' : ''}`} onClick={handleWishlist}>
            <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: inWishlist ? '#e74c3c' : '#ccc' }}></i>
          </button>
        )}
        <span className="badge-teal" style={{ position: 'absolute', bottom: 12, left: 12 }}>{destination.category}</span>
      </div>
      <div className="p-3">
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0, fontSize: '1rem' }}>{destination.title}</h6>
        </div>
        <p style={{ color: '#666', fontSize: '0.82rem', margin: '4px 0 8px' }}>
          <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{destination.location}
        </p>
        <p style={{ color: '#888', fontSize: '0.83rem', marginBottom: 12, lineHeight: 1.5 }}>{truncate(destination.description, 80)}</p>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="star-rating mb-1">
              {renderStars(destination.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)}
              <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: 4 }}>{destination.rating}</span>
            </div>
            <div className="price-tag">{formatPrice(destination.price)}<span>/person</span></div>
          </div>
          <Link to={`/destinations/${destination.id}`} className={`btn btn-teal btn-sm ${booked ? 'btn-outline-teal' : 'btn-teal'}`}>
            {booked ? 'View Booking' : 'Explore'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
