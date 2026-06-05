import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { usersAPI, enquiriesAPI, reviewsAPI } from '../../services/api';
import { useDestinations } from '../../context/DestinationContext';
import { usePackages } from '../../context/PackageContext';
import { useHotels } from '../../context/HotelContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { destinations } = useDestinations();
  const { packages } = usePackages();
  const { hotels } = useHotels();
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    usersAPI.getAll().then(res => setUsers(res.data.filter(u => u.role !== 'admin'))).catch(() => {});
    reviewsAPI.getAll().then(res => setReviews(res.data)).catch(() => {});
    enquiriesAPI.getAll().then(res => setEnquiries(res.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Users', value: users.length, icon: 'bi-people-fill', color: '#307082', to: '/admin/users' },
    { label: 'Destinations', value: destinations.length, icon: 'bi-geo-alt-fill', color: '#EA9940', to: '/admin/destinations' },
    { label: 'Packages', value: packages.length, icon: 'bi-briefcase-fill', color: '#6CA3A2', to: '/admin/packages' },
    { label: 'Hotels', value: hotels.length, icon: 'bi-building', color: '#12212E', to: '/admin/hotels' },
    { label: 'Reviews', value: reviews.length, icon: 'bi-star-fill', color: '#ffc107', to: '/admin/reviews' },
    { label: 'Enquiries', value: enquiries.length, icon: 'bi-envelope-fill', color: '#e74c3c', to: '/admin/enquiries' },
  ];

  const barData = {
    labels: ['Users', 'Destinations', 'Packages', 'Hotels', 'Reviews', 'Enquiries'],
    datasets: [{
      label: 'Count',
      data: [users.length, destinations.length, packages.length, hotels.length, reviews.length, enquiries.length],
      backgroundColor: ['#307082', '#EA9940', '#6CA3A2', '#12212E', '#ffc107', '#e74c3c'],
      borderRadius: 8,
    }]
  };

  const catCounts = {};
  destinations.forEach(d => { catCounts[d.category] = (catCounts[d.category] || 0) + 1; });
  const pieDataFixed = {
    labels: Object.keys(catCounts),
    datasets: [{ data: Object.values(catCounts), backgroundColor: ['#307082', '#EA9940', '#6CA3A2', '#12212E', '#ffc107', '#e74c3c', '#28a745', '#6f42c1', '#fd7e14', '#20c997'], borderWidth: 0 }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Enquiries',
      data: [3, 5, 4, 8, 6, enquiries.length],
      borderColor: '#307082', backgroundColor: 'rgba(48,112,130,0.1)', tension: 0.4, fill: true,
    }, {
      label: 'Reviews',
      data: [2, 4, 3, 5, 4, reviews.length],
      borderColor: '#EA9940', backgroundColor: 'rgba(234,153,64,0.1)', tension: 0.4, fill: true,
    }]
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, margin: 0, color: '#12212E' }}>Admin Dashboard</h4>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Welcome back! Here's what's happening.</p>
        </div>
        <span style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-4 col-xl-2">
            <motion.div whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={stat.to} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: '1.3rem' }}></i>
                  </div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#12212E', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: '#888', fontSize: '0.82rem', marginTop: 4 }}>{stat.label}</div>
                </div>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Overview Statistics</h6>
            <div style={{ height: 280 }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Destinations by Category</h6>
            <div style={{ height: 280 }}>
              {Object.keys(catCounts).length > 0 && <Pie data={pieDataFixed} options={chartOptions} />}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>Enquiries & Reviews Trend</h6>
            <div style={{ height: 250 }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>Recent Enquiries</h6>
            {enquiries.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '0.88rem' }}>No enquiries yet</p>
            ) : (
              enquiries.slice(0, 5).map((enq, i) => (
                <div key={i} className="d-flex align-items-center gap-2 py-2" style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(48,112,130,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Poppins', fontWeight: 700, color: '#307082', fontSize: '0.8rem' }}>
                    {enq.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.name}</div>
                    <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{enq.destination || 'General'}</div>
                  </div>
                  <span style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', padding: '2px 8px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 600, flexShrink: 0 }}>{enq.status || 'New'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
