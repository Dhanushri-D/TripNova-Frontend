import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setMenuOpen(false); setDropdownOpen(false); window.location.href = '/'; };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/destinations', label: 'Explore' },
    { to: '/packages', label: 'Packages' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reviews', label: 'Reviews' },
  ];

  return (
    <nav className={`navbar-tripnova ${scrolled ? 'scrolled' : ''}`} style={{ position: 'sticky', top: 0, zIndex: 999 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Logo */}
          <Link to="/" className="navbar-brand-logo">
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #307082, #EA9940)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234,153,64,0.35)', flexShrink: 0
            }}>
              <i className="bi bi-compass text-white" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <span>Trip<em>Nova</em></span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
            {currentUser?.role === 'admin' && (
              <NavLink to="/admin/dashboard" className="nav-link-custom" style={{ color: '#EA9940 !important' }}>
                <i className="bi bi-shield-check me-1"></i>Admin
              </NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 8, width: 36, height: 36 }}>
              <i className="bi bi-search"></i>
            </button>
            {currentUser ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  className="btn btn-sm d-flex align-items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 8 }}
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.88rem' }}>{currentUser.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: 'white', borderRadius: 16, boxShadow: '0 20px 60px rgba(18,33,46,0.18)', minWidth: 230, zIndex: 1000, overflow: 'hidden' }}
                    >
                      {/* User Info Header */}
                      <div style={{ background: 'linear-gradient(135deg, #12212E, #307082)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #EA9940, #d4882e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {currentUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <ul style={{ listStyle: 'none', padding: '8px 0', margin: 0 }}>
                        {[
                          { to: '/dashboard',    icon: 'bi-speedometer2',   label: 'Dashboard',      color: '#307082' },
                          { to: '/my-bookings',  icon: 'bi-calendar-check', label: 'My Bookings',    color: '#28a745' },
                          { to: '/my-enquiries', icon: 'bi-chat-dots',      label: 'My Enquiries',   color: '#307082' },
                          { to: '/wishlist',     icon: 'bi-heart',          label: 'Wishlist',       color: '#e74c3c' },
                          { to: '/trip-planner', icon: 'bi-map',            label: 'Trip Planner',   color: '#307082' },
                          { to: '/budget-planner',icon: 'bi-wallet2',       label: 'Budget Planner', color: '#EA9940' },
                          { to: '/profile',      icon: 'bi-person',         label: 'Profile',        color: '#307082' },
                        ].map(item => (
                          <li key={item.to}>
                            <button
                              onClick={() => { setDropdownOpen(false); navigate(item.to); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', textDecoration: 'none', color: '#1a1a2e', fontSize: '0.88rem', fontFamily: 'Inter', fontWeight: 500, transition: 'background 0.15s', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f5f8fa'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '0.9rem' }}></i>
                              </span>
                              {item.label}
                            </button>
                          </li>
                        ))}
                        <li style={{ margin: '6px 12px' }}><hr style={{ borderColor: '#f0f0f0', margin: 0 }} /></li>
                        <li>
                          <button
                            onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.88rem', fontFamily: 'Inter', fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ width: 30, height: 30, borderRadius: 8, background: '#e74c3c15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <i className="bi bi-box-arrow-right" style={{ color: '#e74c3c', fontSize: '0.9rem' }}></i>
                            </span>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/signup" className="btn btn-sm btn-orange">Sign Up</Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="d-lg-none btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.4rem' }} onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '12px 0 8px' }}>
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search destinations, packages, hotels..." className="form-control" style={{ borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} autoFocus />
                <button type="submit" className="btn btn-orange px-3" style={{ borderRadius: 8 }}><i className="bi bi-search"></i></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, paddingBottom: 12 }}>
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} className="nav-link-custom d-block mb-1" onClick={() => setMenuOpen(false)}>{link.label}</NavLink>
              ))}
              {currentUser?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className="nav-link-custom d-block mb-1" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
              )}
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              {currentUser ? (
                <>
                  <div style={{ padding: '8px 0 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #307082, #EA9940)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{currentUser.email}</div>
                    </div>
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
                  {[
                    { to: '/dashboard',     icon: 'bi-speedometer2',   label: 'Dashboard' },
                    { to: '/my-bookings',   icon: 'bi-calendar-check', label: 'My Bookings' },
                    { to: '/my-enquiries',  icon: 'bi-chat-dots',      label: 'My Enquiries' },
                    { to: '/wishlist',      icon: 'bi-heart',          label: 'Wishlist' },
                    { to: '/trip-planner',  icon: 'bi-map',            label: 'Trip Planner' },
                    { to: '/budget-planner',icon: 'bi-wallet2',        label: 'Budget Planner' },
                    { to: '/profile',       icon: 'bi-person',         label: 'Profile' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} className="nav-link-custom d-flex align-items-center gap-2 mb-1" onClick={() => setMenuOpen(false)}>
                      <i className={`bi ${item.icon}`}></i>{item.label}
                    </Link>
                  ))}
                  <button className="btn btn-sm mt-2" style={{ color: '#EA9940', background: 'none', border: '1px solid #EA9940', borderRadius: 8 }} onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </>
              ) : (
                <div className="d-flex gap-2 mt-2">
                  <Link to="/signup" className="btn btn-sm btn-orange" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
