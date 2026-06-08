import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (currentUser) {
      api.get('/wishlist').then(res => setWishlist(res.data)).catch(() => setWishlist([]));
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const addToWishlist = async (item, type = 'destination') => {
    if (!currentUser) return false;
    if (wishlist.find(w => w.id === item.id && w.itemType === type)) return false;
    try {
      const res = await api.post('/wishlist', { ...item, itemType: type });
      setWishlist(res.data);
      return true;
    } catch {
      return false;
    }
  };

  const removeFromWishlist = async (itemId, type = 'destination') => {
    try {
      const res = await api.delete(`/wishlist/${itemId}/${type}`);
      setWishlist(res.data);
    } catch {}
  };

  const isInWishlist = (itemId, type = 'destination') =>
    wishlist.some(w => w.id === itemId && w.itemType === type);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
