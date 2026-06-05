import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const PENALTY_RATE = 0.05;

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);

  const normalize = (b) => ({ ...b, id: b._id || b.id });

  const fetchBookings = async () => {
    if (!currentUser) { setBookings([]); return; }
    try {
      const res = await bookingsAPI.getMine();
      setBookings(res.data.map(normalize));
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => { fetchBookings(); }, [currentUser]);  // eslint-disable-line react-hooks/exhaustive-deps

  const addBooking = async (item, type) => {
    if (!currentUser) return null;
    try {
      const res = await bookingsAPI.create({
        itemId: item.id || item._id,
        type,
        title: item.title || item.name,
        image: item.image || '',
        price: item.price,
        destination: item.destination || item.location || '',
        duration: item.duration || '',
      });
      const booking = normalize(res.data);
      setBookings(prev => [...prev, booking]);
      return booking;
    } catch (err) {
      // Already booked
      return bookings.find(b => b.itemId === (item.id || item._id) && b.type === type && b.status === 'confirmed') || null;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const res = await bookingsAPI.cancel(bookingId);
      const updated = normalize(res.data);
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const completeBooking = async (bookingId) => {
    try {
      const res = await bookingsAPI.complete(bookingId);
      const updated = normalize(res.data);
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    } catch (err) {
      console.error('Complete failed', err);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await bookingsAPI.remove(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const isBooked = (itemId, type) =>
    bookings.some(b => b.itemId === itemId && b.type === type && b.status === 'confirmed');

  const getBookingByItem = (itemId, type) =>
    bookings.find(b => b.itemId === itemId && b.type === type && b.status === 'confirmed');

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, completeBooking, deleteBooking, isBooked, getBookingByItem, PENALTY_RATE, refresh: fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
export default BookingContext;
