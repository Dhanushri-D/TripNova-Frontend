import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDestinations } from '../../context/DestinationContext';
import { reviewsAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const Reviews = () => {
  const { currentUser } = useAuth();
  const { destinations } = useDestinations();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ destinationId: '', comment: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    reviewsAPI.getAll().then(res => setReviews(res.data)).catch(console.error);
  }, []);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.id === form.destinationId || d._id === form.destinationId);
    const res = await reviewsAPI.create({
      ...form,
      destinationId: form.destinationId,
      destinationName: dest?.title || '',
      avatar: currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2),
    });
    setReviews(prev => [res.data, ...prev]);
    setForm({ destinationId: '', comment: '', rating: 5 });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await reviewsAPI.remove(id);
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Traveler Reviews</h1>
            <p>Real experiences from real travelers</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'Poppins', fontWeight: 900, color: '#307082' }}>{avgRating}</div>
              <div style={{ color: '#ffc107', fontSize: '1.3rem', margin: '4px 0' }}>{'★'.repeat(Math.round(avgRating))}</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Average Rating</div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'Poppins', fontWeight: 900, color: '#EA9940' }}>{reviews.length}</div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginTop: 8 }}>Total Reviews</div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'Poppins', fontWeight: 900, color: '#6CA3A2' }}>
                {reviews.filter(r => r.rating >= 4).length}
              </div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginTop: 8 }}>5-Star Reviews</div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>All Reviews</h4>
          {currentUser && (
            <button onClick={() => { setShowForm(!showForm); setForm({ destinationId: '', comment: '', rating: 5 }); }} className="btn btn-teal">
              <i className="bi bi-plus-lg me-2"></i>Write a Review
            </button>
          )}
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Write a Review</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Destination *</label>
                  <select value={form.destinationId} onChange={e => setForm({ ...form, destinationId: e.target.value })} className="form-select" required>
                    <option value="">Select destination...</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rating *</label>
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className="bi bi-star-fill"
                        style={{ fontSize: '1.5rem', cursor: 'pointer', color: star <= (hoverRating || form.rating) ? '#ffc107' : '#ddd' }}
                        onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setForm({ ...form, rating: star })} />
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Your Review *</label>
                  <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} className="form-control" rows={3} placeholder="Share your experience..." required />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-teal">Submit Review</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {reviews.length === 0 ? (
          <div className="empty-state"><i className="bi bi-star"></i><h5>No reviews yet</h5></div>
        ) : (
          <div className="row g-4">
            {reviews.map((review, i) => (
              <div key={review._id} className="col-md-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 700, color: 'white', fontSize: '0.9rem', flexShrink: 0 }}>
                        {review.avatar || review.userName?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem' }}>{review.userName}</div>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>{formatDate(review.createdAt)}</div>
                      </div>
                    </div>
                    {currentUser && (currentUser.id === review.userId?.toString() || currentUser.role === 'admin') && (
                      <button onClick={() => handleDelete(review._id)} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', borderRadius: 6, border: 'none', padding: '4px 8px' }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                  <div style={{ color: '#ffc107', marginBottom: 8 }}>
                    {[1,2,3,4,5].map(s => <i key={s} className={`bi bi-star${s <= review.rating ? '-fill' : ''}`} style={{ marginRight: 2 }}></i>)}
                    <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: 6 }}>{review.destinationName}</span>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
