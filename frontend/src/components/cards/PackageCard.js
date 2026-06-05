import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { renderStars, formatPrice, truncate } from '../../utils/helpers';
import { useBookings } from '../../context/BookingContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const PackageCard = ({ pkg }) => {
  const { isBooked } = useBookings();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const booked = isBooked(pkg.id, 'package');
  const wishlisted = isInWishlist(pkg.id, 'package');

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (wishlisted) removeFromWishlist(pkg.id, 'package');
    else addToWishlist({ ...pkg, itemType: 'package' }, 'package');
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="card-premium h-100">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={pkg.image} alt={pkg.title} className="package-card-img" style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <span className="badge-orange" style={{ position: 'absolute', top: 12, left: 12 }}>{pkg.duration}</span>
        {booked && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#28a745', color: 'white', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-check-circle-fill"></i> Booked
          </span>
        )}
        {!booked && currentUser && (
          <button onClick={toggleWishlist} className="wishlist-btn" style={{ top: 12, right: 12 }}>
            <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: wishlisted ? '#e74c3c' : '#ccc' }}></i>
          </button>
        )}
      </div>
      <div className="p-3">
        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{pkg.title}</h6>
        <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: 6 }}>
          <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{pkg.destination}
        </p>
        <p style={{ color: '#888', fontSize: '0.83rem', marginBottom: 10 }}>{truncate(pkg.description, 75)}</p>
        {pkg.includes && (
          <div className="d-flex flex-wrap gap-1 mb-10" style={{ marginBottom: 10 }}>
            {pkg.includes.slice(0, 3).map((inc, i) => (
              <span key={i} style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '2px 8px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{inc}</span>
            ))}
          </div>
        )}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <div>
            <div className="star-rating mb-1">
              {renderStars(pkg.rating).map((cls, i) => <i key={i} className={`bi ${cls}`}></i>)}
            </div>
            <div className="price-tag">{formatPrice(pkg.price)}<span>/person</span></div>
          </div>
          <Link to={`/packages/${pkg.id}`} className={`btn btn-sm ${booked ? 'btn-outline-teal' : 'btn-teal'}`}>
            {booked ? 'View Booking' : 'View Details'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
