import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getData } from '../services/localStorageService';

const AdminLayout = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [editMsg, setEditMsg] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);

  // Compute unseen (New) + seen-but-unreplied (Read) count
  const refreshCount = () => {
    const enqs = getData('enquiries');
    const count = enqs.filter(e => !e.status || e.status === 'New' || e.status === 'Read').length;
    setUnreadCount(count);
  };

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); window.location.href = 'https://trip-nova-frontend.vercel.app/'; };

  const openEdit = () => {
    setEditForm({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });
    setEditMsg('');
    setEditOpen(true);
    setProfileOpen(false);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setEditMsg('Profile updated successfully!');
    setTimeout(() => setEditOpen(false), 1200);
  };

  const links = [
    { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/users', icon: 'bi-people', label: 'Users' },
    { to: '/admin/destinations', icon: 'bi-geo-alt', label: 'Destinations' },
    { to: '/admin/packages', icon: 'bi-briefcase', label: 'Packages' },
    { to: '/admin/hotels', icon: 'bi-building', label: 'Hotels' },
    { to: '/admin/enquiries', icon: 'bi-envelope', label: 'Enquiries', badge: unreadCount },
    { to: '/admin/reviews', icon: 'bi-star', label: 'Reviews' },
    { to: '/admin/gallery', icon: 'bi-images', label: 'Gallery' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Brand Bar ── */}
      <div style={{ background: '#12212E', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 1100 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-compass" style={{ color: 'white', fontSize: '1rem' }}></i>
          </div>
          <span style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'white', fontSize: '1.15rem', letterSpacing: '-0.3px' }}>
            Trip<em style={{ color: '#EA9940', fontStyle: 'normal' }}>Nova</em>
            <span style={{ fontSize: '0.62rem', background: '#307082', color: 'white', borderRadius: 4, padding: '1px 6px', marginLeft: 8, fontWeight: 700, letterSpacing: 1, verticalAlign: 'middle' }}>ADMIN</span>
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <NavLink to="/home" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="bi bi-box-arrow-up-left"></i>
            <span className="d-none d-sm-inline">Site</span>
          </NavLink>

          {/* Profile dropdown */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.78rem' }}>
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontFamily: 'Inter' }} className="d-none d-sm-inline">{currentUser?.name}</span>
              <i className="bi bi-chevron-down" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}></i>
            </button>

            {profileOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: 'white', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', minWidth: 180, zIndex: 2000, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.88rem', color: '#12212E' }}>{currentUser?.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#888' }}>{currentUser?.email}</div>
                </div>
                <button onClick={openEdit}
                  style={{ width: '100%', padding: '11px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10, color: '#333', fontFamily: 'Inter' }}>
                  <i className="bi bi-pencil-square" style={{ color: '#307082' }}></i> Edit Profile
                </button>
                <button onClick={handleLogout}
                  style={{ width: '100%', padding: '11px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10, color: '#e74c3c', fontFamily: 'Inter', borderTop: '1px solid #f5f5f5' }}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            )}
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setMobileNavOpen(o => !o)} className="d-md-none"
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer', padding: 0 }}>
            <i className={`bi ${mobileNavOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>
      </div>

      {/* ── Horizontal Nav Bar ── */}
      <div style={{ background: '#1a2f3f', borderBottom: '3px solid #EA9940', position: 'sticky', top: 56, zIndex: 1050 }} className="d-none d-md-block">
        <nav style={{ display: 'flex', alignItems: 'center', padding: '0 20px', overflowX: 'auto', gap: 2 }}>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '12px 16px', position: 'relative',
              color: isActive ? '#EA9940' : 'rgba(255,255,255,0.78)',
              textDecoration: 'none',
              fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
              borderBottom: isActive ? '3px solid #EA9940' : '3px solid transparent',
              marginBottom: -3,
              background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              whiteSpace: 'nowrap', transition: 'all 0.18s',
            })}>
              <i className={`bi ${link.icon}`} style={{ fontSize: '0.95rem' }}></i>
              {link.label}
              {link.badge > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 4, background: '#e74c3c', color: 'white', borderRadius: '50%', width: 17, height: 17, fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {mobileNavOpen && (
        <div className="d-md-none" style={{ background: '#1a2f3f', borderBottom: '2px solid #EA9940', zIndex: 1049, position: 'sticky', top: 56 }}>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => setMobileNavOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 24px', position: 'relative',
                color: isActive ? '#EA9940' : 'rgba(255,255,255,0.78)',
                textDecoration: 'none', fontFamily: 'Inter', fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                borderLeft: isActive ? '4px solid #EA9940' : '4px solid transparent',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              })}>
              <i className={`bi ${link.icon}`}></i>
              {link.label}
              {link.badge > 0 && (
                <span style={{ background: '#e74c3c', color: 'white', borderRadius: 50, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700, marginLeft: 4 }}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}

      {/* ── Page Content ── */}
      <div style={{ flex: 1, padding: '28px 32px' }}>
        <Outlet />
      </div>

      {/* ── Edit Profile Modal ── */}
      {editOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setEditOpen(false); }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #12212E, #307082)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>
                <i className="bi bi-person-gear me-2"></i>Edit Profile
              </div>
              <button onClick={() => setEditOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <form onSubmit={handleEditSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: 6 }}>Full Name</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="form-control" required placeholder="Your name" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: 6 }}>Email</label>
                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="form-control" required type="email" placeholder="Email address" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: 6 }}>Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="form-control" placeholder="Phone number" />
              </div>
              {editMsg && (
                <div style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745', borderRadius: 8, padding: '8px 14px', fontSize: '0.84rem', fontWeight: 600, marginBottom: 16 }}>
                  <i className="bi bi-check-circle-fill me-2"></i>{editMsg}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-teal" style={{ flex: 1, borderRadius: 8 }}>Save Changes</button>
                <button type="button" onClick={() => setEditOpen(false)} className="btn btn-outline-secondary" style={{ borderRadius: 8 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
