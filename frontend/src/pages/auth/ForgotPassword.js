import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === email)) { setError('No account found with this email.'); return; }
    setStep(2);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const result = resetPassword(email, newPassword);
    if (result.success) setSuccess(true);
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
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#12212E', marginBottom: 4 }}>Reset Password</h4>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>{step === 1 ? 'Enter your email to reset your password' : 'Create a new password'}</p>
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-3">
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(40,167,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', color: '#28a745' }}></i>
            </div>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Password Reset!</h5>
            <p style={{ color: '#666', marginBottom: 20 }}>Your password has been successfully updated.</p>
            <button onClick={() => navigate('/login')} className="btn btn-teal px-4">Go to Login</button>
          </motion.div>
        ) : (
          <>
            {error && <div className="alert alert-danger py-2 px-3 mb-3" style={{ borderRadius: 8, fontSize: '0.88rem' }}><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="your@email.com" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-teal w-100 py-3" style={{ borderRadius: 10, fontWeight: 700 }}>
                  <i className="bi bi-arrow-right me-2"></i>Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
                    <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="New password" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
                    <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" className="form-control form-control-premium" style={{ paddingLeft: 40 }} placeholder="Confirm password" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-teal w-100 py-3" style={{ borderRadius: 10, fontWeight: 700 }}>
                  <i className="bi bi-check-lg me-2"></i>Reset Password
                </button>
              </form>
            )}
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/login" style={{ color: '#307082', fontSize: '0.9rem', textDecoration: 'none' }}>
            <i className="bi bi-arrow-left me-1"></i>Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
