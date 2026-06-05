import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { enquiriesAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const STATUS_STYLE = {
  New:     { bg: 'rgba(231,76,60,0.1)',  color: '#e74c3c',  icon: 'bi-clock' },
  Read:    { bg: 'rgba(234,153,64,0.1)', color: '#EA9940',  icon: 'bi-eye' },
  Replied: { bg: 'rgba(40,167,69,0.1)',  color: '#28a745',  icon: 'bi-check-circle-fill' },
};

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    enquiriesAPI.getMine().then(res => setEnquiries(res.data)).catch(console.error);
  }, []);

  const tabs = ['All', 'Pending', 'Replied'];
  const filtered = enquiries.filter(e => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return !e.adminReply;
    return !!e.adminReply;
  });

  const repliedCount = enquiries.filter(e => e.adminReply).length;
  const pendingCount = enquiries.filter(e => !e.adminReply).length;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>My Enquiries</h1>
            <p>Track your enquiries and replies from our team</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Enquiries', value: enquiries.length, icon: 'bi-chat-dots', color: '#307082' },
            { label: 'Awaiting Reply',  value: pendingCount,     icon: 'bi-hourglass-split', color: '#EA9940' },
            { label: 'Replied',         value: repliedCount,     icon: 'bi-check-circle',    color: '#28a745' },
          ].map((s, i) => (
            <div key={i} className="col-md-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 16, padding: '18px 22px', boxShadow: '0 2px 15px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.2rem' }}></i>
                </div>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#888', fontSize: '0.8rem', marginTop: 2 }}>{s.label}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '8px 20px', borderRadius: 50, border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === t ? '#307082' : 'white',
                color: activeTab === t ? 'white' : '#666',
                boxShadow: activeTab === t ? '0 4px 12px rgba(48,112,130,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-chat-dots"></i>
            <h5>No enquiries yet</h5>
            <p>Browse packages or hotels and click "Enquire Now" to ask questions.</p>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <Link to="/packages" className="btn btn-teal btn-sm">Browse Packages</Link>
              <Link to="/hotels" className="btn btn-outline-teal btn-sm">Browse Hotels</Link>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((enq, i) => {
              const status = enq.status || 'New';
              const st = STATUS_STYLE[status] || STATUS_STYLE.New;
              const isOpen = selected?._id === enq._id;
              return (
                <div key={enq._id} className="col-12">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 15px rgba(0,0,0,0.07)', overflow: 'hidden', border: isOpen ? '1.5px solid #307082' : '1.5px solid transparent', transition: 'border-color 0.2s' }}>

                    <div onClick={() => setSelected(isOpen ? null : enq)}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: enq.itemType === 'hotel' ? 'rgba(48,112,130,0.1)' : 'rgba(234,153,64,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${enq.itemType === 'hotel' ? 'bi-building' : 'bi-briefcase'}`} style={{ color: enq.itemType === 'hotel' ? '#307082' : '#EA9940', fontSize: '1.1rem' }}></i>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.92rem', color: '#12212E' }}>
                            {enq.itemTitle || enq.destination || 'General Enquiry'}
                          </span>
                          <span style={{ background: st.bg, color: st.color, padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>
                            <i className={`bi ${st.icon} me-1`}></i>{status}
                          </span>
                          {enq.adminReply && (
                            <span style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745', padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>
                              <i className="bi bi-envelope-check me-1"></i>New Reply
                            </span>
                          )}
                        </div>
                        <div className="d-flex gap-3 mt-1 flex-wrap">
                          {enq.enquiryType && <span style={{ fontSize: '0.76rem', color: '#888' }}><i className="bi bi-tag me-1"></i>{enq.enquiryType}</span>}
                          <span style={{ fontSize: '0.76rem', color: '#888' }}><i className="bi bi-calendar3 me-1"></i>{formatDate(enq.createdAt)}</span>
                          {enq.travelDate && <span style={{ fontSize: '0.76rem', color: '#888' }}><i className="bi bi-airplane me-1"></i>{enq.travelDate}</span>}
                        </div>
                      </div>

                      <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#aaa', fontSize: '0.85rem', flexShrink: 0 }}></i>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f0f0f0' }}>
                            <div className="row g-3 mt-1">
                              <div className="col-12">
                                <div style={{ fontSize: '0.76rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Your Message</div>
                                <div style={{ background: '#f8f9fa', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #307082' }}>
                                  <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{enq.message}</p>
                                </div>
                                <div className="d-flex gap-3 mt-2 flex-wrap">
                                  {enq.groupSize && <span style={{ fontSize: '0.78rem', color: '#666' }}><i className="bi bi-people me-1" style={{ color: '#307082' }}></i>{enq.groupSize} people</span>}
                                  {enq.travelDate && <span style={{ fontSize: '0.78rem', color: '#666' }}><i className="bi bi-calendar-event me-1" style={{ color: '#307082' }}></i>Travel: {enq.travelDate}</span>}
                                </div>
                              </div>

                              <div className="col-12">
                                <div style={{ fontSize: '0.76rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                                  Reply from TripNova
                                </div>
                                {enq.adminReply ? (
                                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ background: 'rgba(40,167,69,0.06)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #28a745' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-headset" style={{ color: 'white', fontSize: '0.75rem' }}></i>
                                      </div>
                                      <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', color: '#12212E' }}>TripNova Support</span>
                                      {enq.repliedAt && <span style={{ fontSize: '0.72rem', color: '#888' }}>{formatDate(enq.repliedAt)}</span>}
                                    </div>
                                    <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{enq.adminReply}</p>
                                  </motion.div>
                                ) : (
                                  <div style={{ background: '#fffbf0', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #EA9940', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <i className="bi bi-hourglass-split" style={{ color: '#EA9940' }}></i>
                                    <span style={{ color: '#888', fontSize: '0.86rem' }}>Our team is reviewing your enquiry. We'll reply within <strong>24 hours</strong>.</span>
                                  </div>
                                )}
                              </div>

                              {enq.itemType && (
                                <div className="col-12">
                                  <Link to={enq.itemType === 'hotel' ? `/hotels/${enq.itemId}` : `/packages/${enq.itemId}`}
                                    className="btn btn-outline-teal btn-sm" style={{ borderRadius: 8 }}>
                                    <i className={`bi ${enq.itemType === 'hotel' ? 'bi-building' : 'bi-briefcase'} me-2`}></i>
                                    View {enq.itemType === 'hotel' ? 'Hotel' : 'Package'}
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnquiries;
