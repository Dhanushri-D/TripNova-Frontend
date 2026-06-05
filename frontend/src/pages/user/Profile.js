import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', email: currentUser?.email || '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name, phone: form.phone });
    setEditing(false); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              {/* Avatar */}
              <div className="text-center mb-4">
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 800, fontSize: '2.2rem', color: 'white', margin: '0 auto 12px' }}>
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{currentUser?.name}</h5>
                <span style={{ background: currentUser?.role === 'admin' ? 'rgba(234,153,64,0.15)' : 'rgba(48,112,130,0.1)', color: currentUser?.role === 'admin' ? '#EA9940' : '#307082', padding: '4px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {currentUser?.role}
                </span>
              </div>

              {success && (
                <div className="alert alert-success py-2 px-3 mb-3" style={{ borderRadius: 8, fontSize: '0.88rem' }}>
                  <i className="bi bi-check-circle me-2"></i>Profile updated successfully!
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email (cannot change)</label>
                    <input value={form.email} className="form-control" disabled style={{ background: '#f8f9fa' }} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Phone Number</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="+91 98765 43210" />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-teal px-4">Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn btn-outline-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  {[
                    { icon: 'bi-person', label: 'Full Name', value: currentUser?.name },
                    { icon: 'bi-envelope', label: 'Email', value: currentUser?.email },
                    { icon: 'bi-telephone', label: 'Phone', value: currentUser?.phone || 'Not provided' },
                    { icon: 'bi-shield-check', label: 'Role', value: currentUser?.role },
                    { icon: 'bi-calendar3', label: 'Member Since', value: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 py-3" style={{ borderBottom: i < 4 ? '1px solid #f5f5f5' : 'none' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(48,112,130,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${item.icon}`} style={{ color: '#307082' }}></i>
                      </div>
                      <div>
                        <div style={{ color: '#aaa', fontSize: '0.78rem', fontFamily: 'Inter' }}>{item.label}</div>
                        <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.95rem', textTransform: item.label === 'Role' ? 'capitalize' : 'none' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setEditing(true)} className="btn btn-teal mt-4 px-4">
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
