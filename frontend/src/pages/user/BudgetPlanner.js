import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { budgetPlansAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';

const BudgetPlanner = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', transport: '', hotel: '', food: '', activity: '', misc: '' });

  useEffect(() => {
    if (currentUser) {
      budgetPlansAPI.getMine().then(res => setPlans(res.data)).catch(console.error);
    }
  }, [currentUser]);

  const total = ['transport', 'hotel', 'food', 'activity', 'misc'].reduce((s, k) => s + (Number(form[k]) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      transport: Number(form.transport) || 0,
      hotel: Number(form.hotel) || 0,
      food: Number(form.food) || 0,
      activity: Number(form.activity) || 0,
      misc: Number(form.misc) || 0,
      total,
    };
    try {
      if (editId) {
        const res = await budgetPlansAPI.update(editId, payload);
        setPlans(prev => prev.map(p => (p._id === editId || p.id === editId) ? res.data : p));
      } else {
        const res = await budgetPlansAPI.create(payload);
        setPlans(prev => [res.data, ...prev]);
      }
      setForm({ title: '', transport: '', hotel: '', food: '', activity: '', misc: '' });
      setShowForm(false); setEditId(null);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleEdit = (plan) => {
    setForm({ title: plan.title, transport: plan.transport, hotel: plan.hotel, food: plan.food, activity: plan.activity, misc: plan.misc || '' });
    setEditId(plan._id || plan.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await budgetPlansAPI.remove(id);
      setPlans(prev => prev.filter(p => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const FIELDS = [
    { key: 'transport', label: 'Transport', icon: 'bi-airplane', color: '#307082' },
    { key: 'hotel', label: 'Hotel/Stay', icon: 'bi-building', color: '#EA9940' },
    { key: 'food', label: 'Food & Dining', icon: 'bi-cup-hot', color: '#6CA3A2' },
    { key: 'activity', label: 'Activities', icon: 'bi-bicycle', color: '#e74c3c' },
    { key: 'misc', label: 'Miscellaneous', icon: 'bi-three-dots', color: '#6c757d' },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>Budget Planner</h1>
            <p>Plan and manage your travel budget efficiently</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>My Budget Plans</h4>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', transport: '', hotel: '', food: '', activity: '', misc: '' }); }} className="btn btn-teal">
            <i className="bi bi-plus-lg me-2"></i>New Budget Plan
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: 20, padding: 32, marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 24 }}>{editId ? 'Edit Budget Plan' : 'Create Budget Plan'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Plan Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-control" placeholder="e.g. Goa Trip Budget" required />
                </div>
                {FIELDS.map(f => (
                  <div key={f.key} className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      <i className={`bi ${f.icon} me-1`} style={{ color: f.color }}></i>{f.label} (₹)
                    </label>
                    <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} type="number" min="0" className="form-control" placeholder="0" />
                  </div>
                ))}
                <div className="col-12">
                  <div style={{ background: 'rgba(48,112,130,0.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Total Budget</span>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: '#307082' }}>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-teal">{editId ? 'Update Plan' : 'Save Plan'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Plans List */}
        {plans.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-wallet2"></i>
            <h5>No budget plans yet</h5>
            <p>Create your first budget plan to start tracking travel expenses</p>
          </div>
        ) : (
          <div className="row g-4">
            {plans.map((plan, i) => (
              <div key={plan._id || plan.id} className="col-md-6 col-lg-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                  style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>{plan.title}</h6>
                    <div className="d-flex gap-1">
                      <button onClick={() => handleEdit(plan)} className="btn btn-sm" style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', border: 'none', borderRadius: 6, padding: '4px 8px' }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(plan._id || plan.id)} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 8px' }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    {FIELDS.map(f => plan[f.key] > 0 && (
                      <div key={f.key} className="d-flex justify-content-between mb-2">
                        <span style={{ color: '#666', fontSize: '0.85rem' }}><i className={`bi ${f.icon} me-1`} style={{ color: f.color }}></i>{f.label}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatPrice(plan[f.key])}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <div className="d-flex justify-content-between">
                      <span style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Total</span>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#307082', fontSize: '1.1rem' }}>{formatPrice(plan.total)}</span>
                    </div>
                    {/* Budget bars */}
                    {FIELDS.map(f => plan[f.key] > 0 && (
                      <div key={f.key} className="mt-2">
                        <div className="d-flex justify-content-between" style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: 2 }}>
                          <span>{f.label}</span>
                          <span>{Math.round((plan[f.key] / plan.total) * 100)}%</span>
                        </div>
                        <div className="budget-bar">
                          <div className="budget-bar-fill" style={{ width: `${(plan[f.key] / plan.total) * 100}%`, background: f.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: '#aaa', fontSize: '0.75rem', margin: '12px 0 0' }}>{formatDate(plan.createdAt)}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
