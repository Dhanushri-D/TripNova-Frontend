import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await signup(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (result.success) navigate('/home');
    else setError(result.message);
  };

  return (
    <div className="auth-container">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="auth-card">
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-compass text-white" style={{ fontSize: '1.3rem' }}></i>
            </div>
            <span style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#12212E', fontSize: '1.4rem' }}>
              Trip<em style={{ color: '#EA9940', fontStyle: 'normal' }}>Nova</em>
            </span>
          </Link>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#12212E', marginBottom: 4 }}>Create Account</h4>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Join thousands of happy travelers</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ borderRadius: 8, fontSize: '0.88rem' }}>
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-person" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="Your full name" required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="your@email.com" required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-telephone" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type={showPass ? 'text' : 'password'} className="form-control form-control-premium" style={{ paddingLeft: 40, paddingRight: 44 }} placeholder="Min. 6 characters" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} type="password" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="Confirm your password" required />
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn btn-orange w-100 py-3" style={{ borderRadius: 10, fontWeight: 700, fontSize: '1rem' }}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-person-plus me-2"></i>}
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#307082', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
