import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reviewsAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    reviewsAPI.getAll().then(res => setReviews(res.data)).catch(console.error);
  }, []);

  const filtered = reviews.filter(r =>
    r.userName?.toLowerCase().includes(search.toLowerCase()) ||
    r.destinationName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await reviewsAPI.remove(id);
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <button onClick={() => window.history.back()} style={{ background: 'rgba(48,112,130,0.1)', border: 'none', color: '#307082', borderRadius: 8, padding: '5px 12px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Reviews</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{reviews.length} reviews | Avg: ★ {avgRating}</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="form-control" style={{ width: 250, borderRadius: 10 }} />
      </div>

      <div className="row g-3 mb-4">
        {[5, 4, 3, 2, 1].map(star => {
          const count = reviews.filter(r => r.rating === star).length;
          const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
          return (
            <div key={star} className="col">
              <div style={{ background: 'white', borderRadius: 12, padding: '16px 12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ color: '#ffc107', fontSize: '1.1rem' }}>{'★'.repeat(star)}</div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: '#12212E' }}>{count}</div>
                <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-premium">
        <table className="table mb-0">
          <thead><tr><th>User</th><th>Destination</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4" style={{ color: '#aaa' }}>No reviews found</td></tr>
            ) : filtered.map((review, i) => (
              <motion.tr key={review._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                      {review.avatar || review.userName?.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{review.userName}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>{review.destinationName}</td>
                <td><span style={{ color: '#ffc107' }}>{'★'.repeat(review.rating)}</span></td>
                <td style={{ fontSize: '0.82rem', color: '#555', maxWidth: 200 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.comment}</div>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#888' }}>{formatDate(review.createdAt)}</td>
                <td>
                  <button onClick={() => handleDelete(review._id)} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 8px' }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
