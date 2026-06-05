import React from 'react';
import { motion } from 'framer-motion';

const LoginModal = ({ show, onClose, onLogin, onSignup }) => {
  if (!show) return null;
  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="modal-dialog modal-dialog-centered">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content" style={{ borderRadius: 20, border: 'none', overflow: 'hidden' }}>
          <div className="modal-header" style={{ background: 'linear-gradient(135deg, #12212E, #307082)', border: 'none', padding: '24px 28px' }}>
            <div>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'white', margin: 0 }}>Login Required</h5>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.85rem' }}>Access exclusive travel features</p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'white', cursor: 'pointer' }}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="modal-body p-4 text-center">
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(48,112,130,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-lock-fill" style={{ fontSize: '1.8rem', color: '#307082' }}></i>
            </div>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 8 }}>Please login or create an account to continue.</h6>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 24 }}>
              Join TripNova to save wishlists, plan trips, manage budgets, and book amazing experiences.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button onClick={onLogin} className="btn btn-teal px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
              <button onClick={onSignup} className="btn btn-orange px-4">
                <i className="bi bi-person-plus me-2"></i>Sign Up Free
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginModal;
