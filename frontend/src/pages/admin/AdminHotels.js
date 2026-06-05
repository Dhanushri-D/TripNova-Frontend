import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHotels } from '../../context/HotelContext';
import { formatPrice } from '../../utils/helpers';

const emptyForm = { name: '', location: '', price: '', amenities: '', rating: 4.5, image: '', type: '', description: '' };

const AdminHotels = () => {
  const { hotels, addHotel, updateHotel, deleteHotel } = useHotels();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = hotels.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean) };
    if (editId) { updateHotel(editId, data); setEditId(null); }
    else addHotel(data);
    setForm(emptyForm); setShowForm(false);
  };

  const handleEdit = (hotel) => {
    setForm({ name: hotel.name, location: hotel.location, price: hotel.price, amenities: (hotel.amenities || []).join(', '), rating: hotel.rating, image: hotel.image, type: hotel.type || '', description: hotel.description || '' });
    setEditId(hotel.id); setShowForm(true);
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
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Hotels & Villas</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{hotels.length} properties</p>
        </div>
        <div className="d-flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="form-control" style={{ width: 200, borderRadius: 10 }} />
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} className="btn btn-teal"><i className="bi bi-plus-lg me-1"></i>Add</button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>{editId ? 'Edit Hotel' : 'Add Hotel'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Hotel Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control" required /></div>
              <div className="col-md-6"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Location *</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="form-control" required /></div>
              <div className="col-md-4"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Price/Night (₹) *</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} type="number" className="form-control" required /></div>
              <div className="col-md-4"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Rating</label><input value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} type="number" min="1" max="5" step="0.1" className="form-control" /></div>
              <div className="col-md-4"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Type</label><input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-control" placeholder="e.g. Resort, Villa" /></div>
              <div className="col-12"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Amenities (comma separated)</label><input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} className="form-control" placeholder="Pool, Spa, WiFi, Restaurant" /></div>
              <div className="col-12"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-control" placeholder="https://..." /></div>
              <div className="col-12"><label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-control" rows={2} /></div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-teal">{editId ? 'Update' : 'Add Hotel'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      <div className="table-premium">
        <table className="table mb-0">
          <thead><tr><th>Image</th><th>Name</th><th>Location</th><th>Type</th><th>Price/Night</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((hotel, i) => (
              <motion.tr key={hotel.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td><img src={hotel.image} alt={hotel.name} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} /></td>
                <td style={{ fontWeight: 600, fontSize: '0.9rem' }}>{hotel.name}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>{hotel.location}</td>
                <td><span style={{ background: 'rgba(108,163,162,0.1)', color: '#6CA3A2', padding: '2px 8px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{hotel.type || 'Hotel'}</span></td>
                <td style={{ fontWeight: 600, color: '#307082', fontSize: '0.88rem' }}>{formatPrice(hotel.price)}</td>
                <td><span style={{ color: '#ffc107' }}>★</span> {hotel.rating}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button onClick={() => handleEdit(hotel)} className="btn btn-sm" style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', border: 'none', borderRadius: 6, padding: '4px 8px' }}><i className="bi bi-pencil"></i></button>
                    <button onClick={() => { if (window.confirm('Delete?')) deleteHotel(hotel.id); }} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 8px' }}><i className="bi bi-trash"></i></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-4" style={{ color: '#aaa' }}>No hotels found</div>}
      </div>
    </div>
  );
};

export default AdminHotels;
