import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { galleryAPI } from '../../services/api';

const Gallery = () => {
  const { currentUser } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: '', location: '' });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    galleryAPI.getAll().then(res => setGallery(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await galleryAPI.create(form);
    setGallery(prev => [res.data, ...prev]);
    setForm({ title: '', description: '', image: '', location: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await galleryAPI.remove(id);
    setGallery(prev => prev.filter(g => g._id !== id));
    setSelected(null);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Travel Gallery</h1>
            <p>Beautiful memories from our travelers around the world</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>Travel Memories</h4>
            <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{gallery.length} photos shared</p>
          </div>
          {currentUser && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-teal">
              <i className="bi bi-plus-lg me-2"></i>Share Memory
            </button>
          )}
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Share Your Travel Memory</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-control" placeholder="e.g. Sunset at Baga Beach" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="form-control" placeholder="e.g. Goa, India" />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Image URL *</label>
                  <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-control" placeholder="https://images.unsplash.com/..." required />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-control" rows={2} placeholder="Tell us about this memory..." />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-teal">Upload Memory</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {gallery.length === 0 ? (
          <div className="empty-state"><i className="bi bi-images"></i><h5>No photos yet</h5></div>
        ) : (
          <div style={{ columns: '3 280px', columnGap: 16 }}>
            {gallery.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="gallery-item" onClick={() => setSelected(item)}>
                <img src={item.image} alt={item.title} onError={e => e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'} />
                <div className="gallery-overlay">
                  <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</div>
                  {item.location && <div style={{ fontSize: '0.8rem', opacity: 0.8 }}><i className="bi bi-geo-alt me-1"></i>{item.location}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ maxWidth: 800, width: '100%', background: 'white', borderRadius: 20, overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }} />
            <div style={{ padding: 24 }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{selected.title}</h5>
                  {selected.location && <p style={{ color: '#666', fontSize: '0.88rem', margin: 0 }}><i className="bi bi-geo-alt me-1 text-teal"></i>{selected.location}</p>}
                  {selected.description && <p style={{ color: '#555', fontSize: '0.9rem', marginTop: 8 }}>{selected.description}</p>}
                </div>
                <div className="d-flex gap-2">
                  {currentUser && (currentUser.id === selected.userId?.toString() || currentUser.role === 'admin') && (
                    <button onClick={() => handleDelete(selected._id)} className="btn btn-sm btn-danger" style={{ borderRadius: 8 }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                  <button onClick={() => setSelected(null)} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
