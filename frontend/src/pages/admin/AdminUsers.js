import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    usersAPI.getAll().then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await usersAPI.remove(id);
    setUsers(prev => prev.filter(u => u._id !== id));
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
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>Users Management</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{users.length} total users</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="form-control" style={{ width: 250, borderRadius: 10 }} />
      </div>

      <div className="table-premium">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.88rem', color: '#555' }}>{user.email}</td>
                <td style={{ fontSize: '0.88rem', color: '#555' }}>{user.phone || '-'}</td>
                <td>
                  <span style={{ background: user.role === 'admin' ? 'rgba(234,153,64,0.15)' : 'rgba(48,112,130,0.1)', color: user.role === 'admin' ? '#EA9940' : '#307082', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#888' }}>{formatDate(user.createdAt)}</td>
                <td>
                  {user.role !== 'admin' && (
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 10px' }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state py-4"><p style={{ color: '#aaa' }}>No users found</p></div>}
      </div>
    </div>
  );
};

export default AdminUsers;
