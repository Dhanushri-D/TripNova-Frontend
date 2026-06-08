import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBookings } from '../../context/BookingContext';
import { tripPlansAPI, budgetPlansAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color, to }) => (
  <motion.div whileHover={{ y: -4 }} className="dashboard-card">
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, fontFamily: 'Inter' }}>{label}</p>
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#12212E', margin: '4px 0 0' }}>{value}</h3>
      </div>
      <div className="dashboard-icon" style={{ background: `${color}20` }}>
        <i className={`bi ${icon}`} style={{ color }}></i>
      </div>
    </div>
    {to && <Link to={to} style={{ fontSize: '0.8rem', color: '#307082', textDecoration: 'none', marginTop: 12, display: 'block' }}>View all <i className="bi bi-arrow-right"></i></Link>}
  </motion.div>
);

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { wishlist } = useWishlist();
  const { bookings } = useBookings();
  const [tripPlans, setTripPlans] = useState([]);
  const [budgetPlans, setBudgetPlans] = useState([]);

  useEffect(() => {
    if (currentUser) {
      tripPlansAPI.getMine().then(res => setTripPlans(res.data)).catch(() => {});
      budgetPlansAPI.getMine().then(res => setBudgetPlans(res.data)).catch(() => {});
    }
  }, [currentUser]);

  const recentActivity = [
    ...tripPlans.map(t => ({ type: 'Trip Plan', title: t.destination || 'Trip Plan', date: t.createdAt, icon: 'bi-map', color: '#307082' })),
    ...budgetPlans.map(b => ({ type: 'Budget Plan', title: b.title || 'Budget Plan', date: b.createdAt, icon: 'bi-wallet2', color: '#EA9940' })),
    ...wishlist.map(w => ({ type: 'Wishlist', title: w.title, date: w.addedAt, icon: 'bi-heart', color: '#e74c3c' })),
    ...bookings.map(b => ({ type: 'Booking', title: b.title, date: b.createdAt, icon: 'bi-calendar-check', color: '#28a745' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #12212E, #307082)', borderRadius: 20, padding: '32px 36px', marginBottom: 28, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 60, width: 100, height: 100, borderRadius: '50%', background: 'rgba(234,153,64,0.15)' }} />
        <div className="d-flex align-items-center gap-4">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #EA9940, #d4882e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: 'white', flexShrink: 0 }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Welcome back, {currentUser?.name?.split(' ')[0]}! 👋</h4>
            <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.9rem' }}>Ready for your next adventure?</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard icon="bi-calendar-check" label="My Bookings" value={bookings.length} color="#28a745" to="/my-bookings" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="bi-heart-fill" label="Wishlist Items" value={wishlist.length} color="#e74c3c" to="/wishlist" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="bi-map" label="Trip Plans" value={tripPlans.length} color="#307082" to="/trip-planner" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="bi-wallet2" label="Budget Plans" value={budgetPlans.length} color="#EA9940" to="/budget-planner" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h6>
            <div className="d-flex flex-wrap gap-3">
              {[
                { to: '/trip-planner', icon: 'bi-map', label: 'Plan a Trip', color: '#307082' },
                { to: '/budget-planner', icon: 'bi-wallet2', label: 'Budget Planner', color: '#EA9940' },
                { to: '/destinations', icon: 'bi-geo-alt', label: 'Explore', color: '#6CA3A2' },
                { to: '/wishlist', icon: 'bi-heart', label: 'My Wishlist', color: '#e74c3c' },
                { to: '/packages', icon: 'bi-briefcase', label: 'Packages', color: '#12212E' },
                { to: '/profile', icon: 'bi-person', label: 'Profile', color: '#6c757d' },
              ].map((action, i) => (
                <Link key={i} to={action.to} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: `${action.color}12`, borderRadius: 10, textDecoration: 'none', color: action.color, fontFamily: 'Inter', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${action.color}22`}
                  onMouseLeave={e => e.currentTarget.style.background = `${action.color}12`}>
                  <i className={`bi ${action.icon}`}></i>{action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Recent Activity</h6>
        {recentActivity.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <i className="bi bi-clock-history" style={{ fontSize: '2.5rem', color: '#ddd', display: 'block', marginBottom: 10 }}></i>
            <p style={{ color: '#aaa', margin: 0 }}>No activity yet. Start exploring!</p>
          </div>
        ) : (
          <div>
            {recentActivity.map((activity, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="d-flex align-items-center gap-3 py-3" style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${activity.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`bi ${activity.icon}`} style={{ color: activity.color }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.9rem' }}>{activity.title}</div>
                  <div style={{ color: '#aaa', fontSize: '0.78rem' }}>{activity.type}</div>
                </div>
                <div style={{ color: '#aaa', fontSize: '0.78rem' }}>{formatDate(activity.date)}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
