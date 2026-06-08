import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="auth-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-compass text-white" style={{ fontSize: '1.3rem' }}></i>
            </div>
            <span style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#12212E', fontSize: '1.4rem' }}>
              Trip<em style={{ color: '#EA9940', fontStyle: 'normal' }}>Nova</em>
            </span>
          </Link>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#12212E', marginBottom: 4 }}>Welcome Back!</h4>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ borderRadius: 8, fontSize: '0.88rem' }}>
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="your@email.com" required />
            </div>
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#307082', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type={showPass ? 'text' : 'password'} className="form-control form-control-premium" style={{ paddingLeft: 40, paddingRight: 44 }} placeholder="Enter your password" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn btn-teal w-100 py-3" style={{ borderRadius: 10, fontWeight: 700, fontSize: '1rem' }}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#307082', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>


      </motion.div>
    </div>
  );
};

export default Login;
