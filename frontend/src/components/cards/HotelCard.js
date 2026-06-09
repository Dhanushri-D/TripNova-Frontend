import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { renderStars, formatPrice } from '../../utils/helpers';
import { useBookings } from '../../context/BookingContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const HotelCard = ({ hotel }) => {
  const { isBooked } = useBookings();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const booked = isBooked(hotel.id, 'hotel');
  const wishlisted = isInWishlist(hotel.id, 'hotel');

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (wishlisted) removeFromWishlist(hotel.id, 'hotel');
    else addToWishlist({ ...hotel, itemType: 'hotel' }, 'hotel');
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-premium h-100" style={{ height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={hotel.image} alt={hotel.name} className="hotel-card-img" />
        {hotel.type && <span className="badge-teal" style={{ position: 'absolute', top: 12, left: 12 }}>{hotel.type}</span>}
        {booked && (
          <span style={{ position: 'absolute', bottom: 12, left: 12, background: '#28a745', color: 'white', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-check-circle-fill"></i> Booked
          </span>
        )}
        {currentUser && (
          <button onClick={toggleWishlist} className="wishlist-btn">
            <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: wishlisted ? '#e74c3c' : '#ccc' }}></i>
          </button>
        )}
      </div>
      <div className="p-3 card-body-content">
        <div className="card-content-top">
          <h6 className="card-title">{hotel.name}</h6>
          <p className="card-location">
            <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{hotel.location}
          </p>
          <p className="card-description">{hotel.description}</p>
          <div className="card-tags">
            {(hotel.amenities || []).slice(0, 4).map((a, i) => (
              <span key={i} style={{ background: '#f0f0f0', color: '#555', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', flexShrink: 0 }}>{a}</span>
            ))}
          </div>
        </div>
        <div className="card-bottom-row">
          <div>
            <div className="star-rating mb-1">
              {renderStars(hotel.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)}
            </div>
            <div className="price-tag">{formatPrice(hotel.price)}<span>/night</span></div>
          </div>
          <Link to={`/hotels/${hotel.id}`} className={`destination-card-btn ${booked ? 'btn btn-outline-teal' : 'btn btn-teal'}`}>
            {booked ? 'View Booking' : 'Book Now'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
