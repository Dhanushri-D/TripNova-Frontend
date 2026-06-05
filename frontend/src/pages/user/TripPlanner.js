import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { tripPlansAPI } from '../../services/api';
import { formatDate, formatPrice } from '../../utils/helpers';

const INTERESTS = ['Beaches', 'Mountains', 'Heritage', 'Adventure', 'Wildlife', 'Pilgrimage', 'Honeymoon', 'Family', 'Trekking', 'International'];
const TRAVEL_TYPES = ['Solo', 'Couple', 'Family', 'Group', 'Friends'];
const PLACES_PER_DAY = 3;

async function fetchPlacesForDestination(destination, days) {
  // Step 1: Geocode using Nominatim (free, no key)
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en', 'User-Agent': 'TripPlannerApp/1.0' } }
  );
  const geoData = await geoRes.json();
  if (!geoData.length) throw new Error(`Could not find "${destination}". Try a more specific name.`);

  const { lat, lon, display_name } = geoData[0];
  const cityName = display_name.split(',')[0];

  // Step 2: Fetch nearby Wikipedia articles (real places) — free, no key
  const totalDays = parseInt(days);
  const limit = totalDays * PLACES_PER_DAY + 5;
  const wikiRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=${limit}&format=json&origin=*`
  );
  const wikiData = await wikiRes.json();
  const places = (wikiData.query?.geosearch || []).filter(p => p.title !== cityName);

  // Step 3: Build day-wise itinerary
  const itinerary = Array.from({ length: totalDays }, (_, i) => {
    const dayPlaces = places.slice(i * PLACES_PER_DAY, i * PLACES_PER_DAY + PLACES_PER_DAY);
    const placeNames = dayPlaces.map(p => p.title).join(', ');

    if (i === 0) return {
      day: 1,
      title: `Arrival in ${cityName}`,
      activities: `Arrive at ${cityName}. Check into hotel. Evening visit: ${placeNames || 'explore the local area'}.`
    };
    if (i === totalDays - 1) return {
      day: totalDays,
      title: 'Departure Day',
      activities: `Morning visit: ${placeNames || 'nearby spots'}. Check out and head to departure point.`
    };
    return {
      day: i + 1,
      title: `Explore ${cityName} – Day ${i + 1}`,
      activities: placeNames ? `Visit: ${placeNames}.` : `Explore local attractions of ${cityName}.`
    };
  });

  return { destination: cityName, days: totalDays, itinerary };
}

const TripPlanner = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ destination: '', budget: '', days: '', interests: [], travelType: 'Solo', notes: '' });
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    if (currentUser) {
      tripPlansAPI.getMine().then(res => setPlans(res.data)).catch(console.error);
    }
  }, [currentUser]);

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { setError('Please enter a destination.'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await fetchPlacesForDestination(form.destination, form.days || 3);
      setGenerated({ ...result, budget: form.budget, travelType: form.travelType });
    } catch (err) {
      setError(err.message || 'Failed to fetch places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await tripPlansAPI.create({
        destination: generated.destination,
        days: generated.days,
        budget: form.budget,
        travelType: generated.travelType,
        interests: form.interests,
        notes: form.notes,
        itinerary: generated.itinerary,
      });
      setPlans(prev => [res.data, ...prev]);
      setGenerated(null); setShowForm(false);
      setForm({ destination: '', budget: '', days: '', interests: [], travelType: 'Solo', notes: '' });
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await tripPlansAPI.remove(id);
      setPlans(prev => prev.filter(p => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h1>Trip Planner</h1>
            <p>Plan your perfect trip with AI-powered itinerary suggestions</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>My Trip Plans</h4>
          <button onClick={() => { setShowForm(!showForm); setGenerated(null); setError(''); }} className="btn btn-teal">
            <i className="bi bi-plus-lg me-2"></i>Plan New Trip
          </button>
        </div>

        {/* Planner Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: 20, padding: 32, marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 24 }}>Plan Your Trip</h5>
            {!generated ? (
              <form onSubmit={handleGenerate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Destination *</label>
                    <input value={form.destination} onChange={e => { setForm({ ...form, destination: e.target.value }); setError(''); }} className="form-control" placeholder="e.g. Goa, Bali, Manali" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Number of Days *</label>
                    <input value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} type="number" min="1" max="30" className="form-control" placeholder="e.g. 5" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Budget (₹)</label>
                    <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} type="number" className="form-control" placeholder="e.g. 25000" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Travel Type</label>
                    <div className="d-flex flex-wrap gap-2">
                      {TRAVEL_TYPES.map(type => (
                        <button key={type} type="button" onClick={() => setForm({ ...form, travelType: type })}
                          style={{ padding: '6px 16px', borderRadius: 50, border: `2px solid ${form.travelType === type ? '#307082' : '#e0e0e0'}`, background: form.travelType === type ? '#307082' : 'white', color: form.travelType === type ? 'white' : '#555', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Interests (select all that apply)</label>
                    <div className="d-flex flex-wrap gap-2">
                      {INTERESTS.map(interest => (
                        <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                          style={{ padding: '6px 16px', borderRadius: 50, border: `2px solid ${form.interests.includes(interest) ? '#EA9940' : '#e0e0e0'}`, background: form.interests.includes(interest) ? '#EA9940' : 'white', color: form.interests.includes(interest) ? 'white' : '#555', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Additional Notes</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="form-control" rows={2} placeholder="Any special requirements or preferences..." />
                  </div>
                  {error && <div className="col-12"><div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div></div>}
                  <div className="col-12 d-flex gap-2">
                    <button type="submit" className="btn btn-orange px-4" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Fetching places...</> : <><i className="bi bi-magic me-2"></i>Generate Itinerary</>}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="btn btn-outline-secondary">Cancel</button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ background: 'rgba(48,112,130,0.06)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
                  <div className="row g-3">
                    <div className="col-md-3"><strong>Destination:</strong> {generated.destination}</div>
                    <div className="col-md-3"><strong>Duration:</strong> {generated.days} Days</div>
                    <div className="col-md-3"><strong>Travel Type:</strong> {generated.travelType}</div>
                    {generated.budget && <div className="col-md-3"><strong>Budget:</strong> {formatPrice(generated.budget)}</div>}
                  </div>
                </div>
                <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>Suggested Itinerary</h6>
                {generated.itinerary.map((day, i) => (
                  <div key={i} className="itinerary-day">
                    <div className="itinerary-day-label">Day {day.day}</div>
                    <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{day.title}</h6>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{day.activities}</p>
                  </div>
                ))}
                <div className="d-flex gap-2 mt-4">
                  <button onClick={handleSave} className="btn btn-teal px-4">
                    <i className="bi bi-bookmark-check me-2"></i>Save This Plan
                  </button>
                  <button onClick={() => setGenerated(null)} className="btn btn-outline-secondary">Regenerate</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Saved Plans */}
        {plans.length === 0 && !showForm ? (
          <div className="empty-state">
            <i className="bi bi-map"></i>
            <h5>No trip plans yet</h5>
            <p>Create your first trip plan and get a personalized itinerary!</p>
          </div>
        ) : (
          <div className="row g-4">
            {plans.map((plan, i) => (
              <div key={plan._id || plan.id} className="col-md-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 4 }}>{plan.destination || 'Trip Plan'}</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        <span style={{ background: 'rgba(48,112,130,0.1)', color: '#307082', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{plan.days} Days</span>
                        <span style={{ background: 'rgba(234,153,64,0.1)', color: '#EA9940', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{plan.travelType}</span>
                        {plan.budget && <span style={{ background: 'rgba(108,163,162,0.1)', color: '#6CA3A2', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{formatPrice(plan.budget)}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(plan._id || plan.id)} className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: 'none', borderRadius: 6, padding: '4px 8px' }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  {plan.interests?.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {plan.interests.map((int, j) => (
                        <span key={j} style={{ background: '#f5f5f5', color: '#666', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem' }}>{int}</span>
                      ))}
                    </div>
                  )}
                  {plan.itinerary?.slice(0, expandedPlan === (plan._id || plan.id) ? plan.itinerary.length : 2).map((day, j) => (
                    <div key={j} style={{ borderLeft: '2px solid #307082', paddingLeft: 12, marginBottom: 8 }}>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.8rem', color: '#307082' }}>Day {day.day}</div>
                      <div style={{ fontSize: '0.82rem', color: '#555', fontWeight: 600 }}>{day.title}</div>
                      {expandedPlan === (plan._id || plan.id) && <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 2 }}>{day.activities}</div>}
                    </div>
                  ))}
                  {plan.itinerary?.length > 2 && (
                    <button onClick={() => setExpandedPlan(expandedPlan === (plan._id || plan.id) ? null : (plan._id || plan.id))}
                      style={{ background: 'none', border: 'none', color: '#307082', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginTop: 2 }}>
                      {expandedPlan === (plan._id || plan.id) ? '▲ Show less' : `▼ +${plan.itinerary.length - 2} more days`}
                    </button>
                  )}
                  <p style={{ color: '#aaa', fontSize: '0.75rem', margin: '12px 0 0' }}>Created {formatDate(plan.createdAt)}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
