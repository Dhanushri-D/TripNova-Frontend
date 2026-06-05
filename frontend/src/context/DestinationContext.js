import React, { createContext, useContext, useState, useEffect } from 'react';
import { destinationsAPI } from '../services/api';

const DestinationContext = createContext();

export const DestinationProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalize = (d) => ({ ...d, id: d._id || d.id });

  const fetchAll = async () => {
    try {
      const res = await destinationsAPI.getAll();
      setDestinations(res.data.map(normalize));
    } catch (err) {
      console.error('Failed to load destinations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const addDestination = async (dest) => {
    const res = await destinationsAPI.create(dest);
    const newDest = normalize(res.data);
    setDestinations(prev => [...prev, newDest]);
    return newDest;
  };

  const updateDestination = async (id, updates) => {
    const res = await destinationsAPI.update(id, updates);
    const updated = normalize(res.data);
    setDestinations(prev => prev.map(d => d.id === id ? updated : d));
  };

  const deleteDestination = async (id) => {
    await destinationsAPI.remove(id);
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  const getDestinationById = (id) => destinations.find(d => d.id === id || d._id === id);

  return (
    <DestinationContext.Provider value={{ destinations, loading, addDestination, updateDestination, deleteDestination, getDestinationById, refresh: fetchAll }}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = () => useContext(DestinationContext);
export default DestinationContext;
