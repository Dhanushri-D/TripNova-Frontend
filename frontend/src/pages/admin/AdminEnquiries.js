import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enquiriesAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const STATUS_COLORS = {
  New:     { bg: 'rgba(231,76,60,0.1)',   color: '#e74c3c' },
  Read:    { bg: 'rgba(234,153,64,0.1)',  color: '#EA9940' },
  Replied: { bg: 'rgba(40,167,69,0.1)',   color: '#28a745' },
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    enquiriesAPI.getAll().then(res => setEnquiries(res.data)).catch(console.error);
  }, []);

  const filtered = enquiries.filter(e => {
    const matchSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.destination?.toLowerCase().includes(search.toLowerCase()) ||
      e.itemTitle?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || (e.status || 'New') === filterStatus;
    return matchSearch && matchStatus;
  });

  const update = async (id, changes) => {
    try {
      const res = await enquiriesAPI.update(id, changes);
      const updated = res.data;
      setEnquiries(prev => prev.map(e => e._id === id ? updated : e));
      if (selected?._id === id) setSelected(updated);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleSelect = (enq) => {
    setSelected(enq);
    setReplyText(enq.adminReply || '');
    setReplySent(false);
    if (enq.status === 'New') update(enq._id, { status: 'Read' });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    update(selected._id, { adminReply: replyText });
    setReplySent(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await enquiriesAPI.remove(id);
    setEnquiries(prev => prev.filter(e => e._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const counts = {
    All: enquiries.length,
    New: enquiries.filter(e => !e.status || e.status === 'New').length,
    Read: enquiries.filter(e => e.status === 'Read').length,
    Replied: enquiries.filter(e => e.status === 'Replied').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <button onClick={() => window.history.back()} style={{ background: 'rgba(48,112,130,0.1)', border: 'none', color: '#307082', borderRadius: 8, padding: '5px 12px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Enquiries</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.88rem' }}>{enquiries.length} total · {counts.New} new · {counts.Replied} replied</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, destination..." className="form-control" style={{ width: 280, borderRadius: 10 }} />
      </div>

      {/* Status Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['All', 'New', 'Read', 'Replied'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: '6px 18px', borderRadius: 50, border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
              background: filterStatus === s ? '#307082' : 'white',
              color: filterStatus === s ? 'white' : '#666',
              boxShadow: filterStatus === s ? '0 4px 12px rgba(48,112,130,0.25)' : '0 1px 4px rgba(0,0,0,0.08)' }}>
            {s} <span style={{ opacity: 0.75 }}>({counts[s]})</span>
          </button>
        ))}
      </div>

      <div className="row g-4">
        {/* Table */}
        <div className={selected ? 'col-lg-6' : 'col-12'}>
          <div className="table-premium">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>From</th>
                  <th>About</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-5" style={{ color: '#aaa' }}>No enquiries found</td></tr>
                ) : filtered.map((enq, i) => (
                  <motion.tr key={enq._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(enq)}
                    style={{ cursor: 'pointer', background: selected?._id === enq._id ? 'rgba(48,112,130,0.05)' : 'white', borderLeft: selected?._id === enq._id ? '3px solid #307082' : '3px solid transparent' }}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#888' }}>{enq.email}</div>
                    </td>
                    <td style={{ fontSize: '0.84rem', maxWidth: 160 }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.itemTitle || enq.destination || '—'}</div>
                      {enq.enquiryType && <div style={{ fontSize: '0.74rem', color: '#888' }}>{enq.enquiryType}</div>}
                    </td>
                    <td>
                      <span style={{ background: enq.itemType === 'hotel' ? 'rgba(48,112,130,0.1)' : 'rgba(234,153,64,0.1)', color: enq.itemType === 'hotel' ? '#307082' : '#EA9940', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                        {enq.itemType || 'General'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#888' }}>{formatDate(enq.createdAt)}</td>
                    <td>
                      <span style={{ background: STATUS_COLORS[enq.status || 'New']?.bg, color: STATUS_COLORS[enq.status || 'New']?.color, padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>
                        {enq.status || 'New'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(enq._id)} style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <div className="col-lg-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: 20, overflow: 'hidden' }}>

                <div style={{ background: 'linear-gradient(135deg, #12212E, #307082)', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem' }}>{selected.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>{selected.email}</div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-x"></i>
                  </button>
                </div>

                <div style={{ padding: '20px 22px', maxHeight: '75vh', overflowY: 'auto' }}>
                  {selected.itemTitle && (
                    <div style={{ background: '#f8fbfc', borderRadius: 12, padding: '12px 16px', marginBottom: 16, border: '1px solid rgba(48,112,130,0.1)' }}>
                      <div style={{ fontSize: '0.74rem', color: '#888', marginBottom: 4 }}>Enquiry About</div>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: '#12212E' }}>{selected.itemTitle}</div>
                      <div className="d-flex gap-3 mt-1 flex-wrap">
                        {selected.destination && <span style={{ fontSize: '0.76rem', color: '#307082' }}><i className="bi bi-geo-alt-fill me-1"></i>{selected.destination}</span>}
                        {selected.enquiryType && <span style={{ fontSize: '0.76rem', color: '#EA9940' }}><i className="bi bi-tag me-1"></i>{selected.enquiryType}</span>}
                        {selected.travelDate && <span style={{ fontSize: '0.76rem', color: '#666' }}><i className="bi bi-calendar me-1"></i>{selected.travelDate}</span>}
                        {selected.groupSize && <span style={{ fontSize: '0.76rem', color: '#666' }}><i className="bi bi-people me-1"></i>{selected.groupSize} people</span>}
                      </div>
                    </div>
                  )}

                  <div className="row g-2 mb-3">
                    {[
                      { icon: 'bi-telephone', label: 'Phone', value: selected.phone || 'Not provided' },
                      { icon: 'bi-calendar3', label: 'Submitted', value: formatDate(selected.createdAt) },
                    ].map((item, i) => (
                      <div key={i} className="col-6">
                        <div style={{ background: '#f8f9fa', borderRadius: 10, padding: '10px 12px' }}>
                          <div style={{ color: '#aaa', fontSize: '0.72rem' }}><i className={`bi ${item.icon} me-1`}></i>{item.label}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem', marginTop: 2 }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>User Message</div>
                    <div style={{ background: '#f8f9fa', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #307082' }}>
                      <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{selected.message}</p>
                    </div>
                  </div>

                  {selected.adminReply && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Previous Reply</div>
                      <div style={{ background: 'rgba(40,167,69,0.06)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #28a745' }}>
                        <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{selected.adminReply}</p>
                        {selected.repliedAt && <div style={{ fontSize: '0.72rem', color: '#28a745', marginTop: 6 }}><i className="bi bi-check-circle-fill me-1"></i>Replied on {formatDate(selected.repliedAt)}</div>}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {selected.adminReply ? 'Update Reply' : 'Write Reply'}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={e => { setReplyText(e.target.value); setReplySent(false); }}
                      rows={4}
                      placeholder={`Write your reply to ${selected.name}...`}
                      style={{ width: '100%', borderRadius: 12, border: '1.5px solid #e0e0e0', padding: '12px 14px', fontSize: '0.88rem', fontFamily: 'Inter', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#307082'}
                      onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                    {replySent && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem', fontWeight: 600, marginTop: 8 }}>
                        <i className="bi bi-check-circle-fill me-2"></i>Reply saved & visible to user!
                      </motion.div>
                    )}
                    <div className="d-flex gap-2 mt-3">
                      <button onClick={handleReply} disabled={!replyText.trim()} className="btn btn-teal flex-fill" style={{ borderRadius: 10, fontWeight: 700, opacity: replyText.trim() ? 1 : 0.5 }}>
                        <i className="bi bi-send-fill me-2"></i>{selected.adminReply ? 'Update Reply' : 'Send Reply'}
                      </button>
                      <a href={`mailto:${selected.email}?subject=Re: ${selected.itemTitle || 'Your Enquiry'}&body=${encodeURIComponent(replyText)}`}
                        className="btn btn-outline-teal" style={{ borderRadius: 10, fontWeight: 600 }}>
                        <i className="bi bi-envelope me-1"></i>Email
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminEnquiries;
