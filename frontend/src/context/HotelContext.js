import React, { createContext, useContext, useState, useEffect } from 'react';
import { hotelsAPI } from '../services/api';

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalize = (h) => ({ ...h, id: h._id || h.id });

  const fetchAll = async () => {
    try {
      const res = await hotelsAPI.getAll();
      setHotels(res.data.map(normalize));
    } catch (err) {
      console.error('Failed to load hotels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const addHotel = async (hotel) => {
    const res = await hotelsAPI.create(hotel);
    const newHotel = normalize(res.data);
    setHotels(prev => [...prev, newHotel]);
    return newHotel;
  };

  const updateHotel = async (id, updates) => {
    const res = await hotelsAPI.update(id, updates);
    const updated = normalize(res.data);
    setHotels(prev => prev.map(h => h.id === id ? updated : h));
  };

  const deleteHotel = async (id) => {
    await hotelsAPI.remove(id);
    setHotels(prev => prev.filter(h => h.id !== id));
  };

  const getHotelById = (id) => hotels.find(h => h.id === id || h._id === id);

  return (
    <HotelContext.Provider value={{ hotels, loading, addHotel, updateHotel, deleteHotel, getHotelById, refresh: fetchAll }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotels = () => useContext(HotelContext);
export default HotelContext;
