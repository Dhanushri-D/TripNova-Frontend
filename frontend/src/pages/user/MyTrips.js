import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { tripPlansAPI, budgetPlansAPI } from '../../services/api';

const MyTrips = () => {
  const { currentUser } = useAuth();
  const [tripPlans, setTripPlans] = useState([]);
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    if (currentUser) {
      tripPlansAPI.getMine().then(res => setTripPlans(res.data)).catch(console.error);
      budgetPlansAPI.getMine().then(res => setBudgetPlans(res.data)).catch(console.error);
    }
  }, [currentUser]);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>My Trips</h1>
            <p>All your planned and saved trips in one place</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row g-4">
          <div className="col-lg-8">
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Trip Plans ({tripPlans.length})</h5>
            {tripPlans.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-map"></i>
                <h6>No trip plans yet</h6>
                <Link to="/trip-planner" className="btn btn-teal btn-sm mt-2">Plan a Trip</Link>
              </div>
            ) : (
              tripPlans.map((plan, i) => (
                <motion.div key={plan._id || plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ flex: 1 }}>
                      <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 6 }}>{plan.destination || 'Trip Plan'}</h6>
                      <div className="d-flex gap-2 flex-wrap mb-2">
                        <span style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{plan.days} Days</span>
                        <span style={{ background: 'rgba(234,153,64,0.1)', color: '#EA9940', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{plan.travelType}</span>
                        {plan.budget && <span style={{ background: 'rgba(108,163,162,0.1)', color: '#6CA3A2', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{formatPrice(plan.budget)}</span>}
                      </div>
                      <p style={{ color: '#aaa', fontSize: '0.78rem', margin: 0 }}>Planned on {formatDate(plan.createdAt)}</p>
                      {plan.itinerary?.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          {plan.itinerary.slice(0, expandedPlan === (plan._id || plan.id) ? plan.itinerary.length : 2).map((day, j) => (
                            <div key={j} style={{ borderLeft: '2px solid #307082', paddingLeft: 12, marginBottom: 8 }}>
                              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.8rem', color: '#307082' }}>Day {day.day} — {day.title}</div>
                              {expandedPlan === (plan._id || plan.id) && <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 2 }}>{day.activities}</div>}
                            </div>
                          ))}
                          {plan.itinerary.length > 2 && (
                            <button onClick={() => setExpandedPlan(expandedPlan === (plan._id || plan.id) ? null : (plan._id || plan.id))}
                              style={{ background: 'none', border: 'none', color: '#307082', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                              {expandedPlan === (plan._id || plan.id) ? '▲ Show less' : `▼ +${plan.itinerary.length - 2} more days`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <span style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745', padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>Planned</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="col-lg-4">
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Budget Plans ({budgetPlans.length})</h5>
            {budgetPlans.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <i className="bi bi-wallet2" style={{ fontSize: '2.5rem', color: '#ddd', display: 'block', marginBottom: 10 }}></i>
                <Link to="/budget-planner" className="btn btn-teal btn-sm">Create Budget</Link>
              </div>
            ) : (
              budgetPlans.map((plan, i) => (
                <motion.div key={plan._id || plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem' }}>{plan.title}</div>
                      <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{formatDate(plan.createdAt)}</div>
                    </div>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#307082' }}>{formatPrice(plan.total)}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
