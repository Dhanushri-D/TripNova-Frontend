import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { renderStars, formatPrice } from '../../utils/helpers';

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
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-premium h-100" style={{ height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={destination.image} alt={destination.title} className="destination-card-img" />
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
      <div className="p-3 card-body-content">
        <div className="card-content-top">
          <h6 className="card-title">{destination.title}</h6>
          <p className="card-location">
            <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{destination.location}
          </p>
          <p className="card-description">{destination.description}</p>
        </div>
        <div className="card-bottom-row">
          <div>
            <div className="star-rating mb-1">
              {renderStars(destination.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)}
              <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: 4 }}>{destination.rating}</span>
            </div>
            <div className="price-tag">{formatPrice(destination.price)}<span>/person</span></div>
          </div>
          <Link
            to={`/destinations/${destination.id}`}
            className={`destination-card-btn ${booked ? 'btn btn-outline-teal' : 'btn btn-teal'}`}
          >
            {booked ? 'View Booking' : 'Explore'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
