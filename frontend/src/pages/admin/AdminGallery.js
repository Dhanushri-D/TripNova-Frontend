import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: '', location: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    galleryAPI.getAll().then(res => setGallery(res.data)).catch(console.error);
  }, []);

  const filtered = gallery.filter(g =>
    g.title?.toLowerCase().includes(search.toLowerCase()) ||
    g.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await galleryAPI.create(form);
    setGallery(prev => [res.data, ...prev]);
    setForm({ title: '', description: '', image: '', location: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await galleryAPI.remove(id);
    setGallery(prev => prev.filter(g => g._id !== id));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <button onClick={() => window.history.back()} style={{ background: 'rgba(48,112,130,0.1)', border: 'none', color: '#307082', borderRadius: 8, padding: '5px 12px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Gallery Management</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{gallery.length} photos</p>
        </div>
        <div className="d-flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="form-control" style={{ width: 200, borderRadius: 10 }} />
          <button onClick={() => setShowForm(!showForm)} className="btn btn-teal"><i className="bi bi-plus-lg me-1"></i>Add Photo</button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Add Photo</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-control" required /></div>
              <div className="col-md-6"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="form-control" /></div>
              <div className="col-12"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Image URL *</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-control" placeholder="https://..." required /></div>
              <div className="col-12"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-control" rows={2} /></div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-teal">Add Photo</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      <div className="row g-3">
        {filtered.map((item, i) => (
          <div key={item._id} className="col-md-4 col-lg-3">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'} />
                <button onClick={() => handleDelete(item._id)} style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: 'rgba(231,76,60,0.9)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{item.title}</div>
                {item.location && <div style={{ color: '#888', fontSize: '0.78rem' }}><i className="bi bi-geo-alt me-1"></i>{item.location}</div>}
                <div style={{ color: '#aaa', fontSize: '0.72rem', marginTop: 4 }}>{formatDate(item.createdAt)}</div>
              </div>
            </motion.div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-12 text-center py-4" style={{ color: '#aaa' }}>No photos found</div>}
      </div>
    </div>
  );
};

export default AdminGallery;
