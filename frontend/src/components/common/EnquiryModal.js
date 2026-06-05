import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enquiriesAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const ENQUIRY_TYPES = [
  'General Information',
  'Pricing & Offers',
  'Availability & Dates',
  'Group Booking',
  'Customization Request',
  'Cancellation Policy',
  'Other',
];

const EnquiryModal = ({ show, onClose, item, type }) => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    enquiryType: 'General Information',
    travelDate: '',
    groupSize: '1',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiriesAPI.create({
        ...form,
        itemId: item?.id || item?._id || '',
        itemTitle: item?.title || item?.name || '',
        itemType: type,
        itemPrice: item?.price,
        destination: item?.destination || item?.location || '',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Enquiry failed', err);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '', enquiryType: 'General Information', travelDate: '', groupSize: '1', message: '' });
    onClose();
  };

  const inputStyle = { borderRadius: 10, border: '1.5px solid #e8e8e8', padding: '10px 14px', fontFamily: 'Inter', fontSize: '0.88rem', width: '100%', outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', color: '#444', marginBottom: 6, display: 'block' };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(18,33,46,0.65)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 560, boxShadow: '0 30px 80px rgba(0,0,0,0.22)', overflow: 'hidden', margin: 'auto' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #12212E, #307082)', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`bi ${type === 'hotel' ? 'bi-building' : 'bi-briefcase'}`} style={{ color: 'white', fontSize: '1.2rem' }}></i>
                </div>
                <div>
                  <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>Enquire About</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item?.title || item?.name}</div>
                </div>
              </div>
              <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <i className="bi bi-x" style={{ fontSize: '1.1rem' }}></i>
              </button>
            </div>

            {/* Item Summary Strip */}
            <div style={{ background: '#f8fbfc', borderBottom: '1px solid #eee', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={item?.image} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem', color: '#12212E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item?.title || item?.name}</div>
                <div style={{ color: '#888', fontSize: '0.76rem' }}>
                  <i className="bi bi-geo-alt-fill me-1" style={{ color: '#307082' }}></i>{item?.destination || item?.location}
                  {item?.duration && <span className="ms-2"><i className="bi bi-clock me-1"></i>{item.duration}</span>}
                </div>
              </div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#307082', fontSize: '0.95rem', flexShrink: 0 }}>
                {formatPrice(item?.price)}<span style={{ fontWeight: 400, color: '#aaa', fontSize: '0.72rem' }}>/{type === 'hotel' ? 'night' : 'person'}</span>
              </div>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {submitted ? (
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(40,167,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '2.2rem', color: '#28a745' }}></i>
                  </div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 8 }}>Enquiry Submitted!</h5>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 20 }}>
                    Our team will get back to you within <strong>24 hours</strong> regarding <strong>{item?.title || item?.name}</strong>.
                  </p>
                  <div style={{ background: '#f0f9f0', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: '0.83rem', color: '#555' }}>
                    <i className="bi bi-envelope-fill me-2" style={{ color: '#28a745' }}></i>
                    A confirmation has been sent to <strong>{form.email}</strong>
                  </div>
                  <button onClick={handleClose} className="btn btn-teal px-5" style={{ borderRadius: 10, fontWeight: 700 }}>Done</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Enquiry Type */}
                    <div className="col-12">
                      <label style={labelStyle}>Enquiry Type *</label>
                      <div className="d-flex flex-wrap gap-2">
                        {ENQUIRY_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => set('enquiryType', t)}
                            style={{ padding: '6px 14px', borderRadius: 50, border: `1.5px solid ${form.enquiryType === t ? '#307082' : '#e0e0e0'}`, background: form.enquiryType === t ? 'rgba(48,112,130,0.08)' : 'white', color: form.enquiryType === t ? '#307082' : '#666', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label style={labelStyle}>Full Name *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="Your full name" required
                        onFocus={e => e.target.style.borderColor = '#307082'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Email *</label>
                      <input value={form.email} onChange={e => set('email', e.target.value)} type="email" style={inputStyle} placeholder="your@email.com" required
                        onFocus={e => e.target.style.borderColor = '#307082'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Phone</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="+91 98765 43210"
                        onFocus={e => e.target.style.borderColor = '#307082'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Group Size</label>
                      <select value={form.groupSize} onChange={e => set('groupSize', e.target.value)} style={{ ...inputStyle, background: 'white' }}>
                        {['1', '2', '3-5', '6-10', '10+'].map(s => <option key={s} value={s}>{s} {s === '1' ? 'Person' : 'People'}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Preferred Travel Date</label>
                      <input value={form.travelDate} onChange={e => set('travelDate', e.target.value)} type="date" style={inputStyle} min={new Date().toISOString().split('T')[0]}
                        onFocus={e => e.target.style.borderColor = '#307082'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Your Message *</label>
                      <textarea value={form.message} onChange={e => set('message', e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
                        placeholder={`Ask anything about ${item?.title || item?.name} — dates, inclusions, customization, pricing...`} required
                        onFocus={e => e.target.style.borderColor = '#307082'} onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-teal w-100" style={{ borderRadius: 12, padding: '13px', fontWeight: 700, fontSize: '0.95rem' }}>
                        <i className="bi bi-send-fill me-2"></i>Send Enquiry
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;
