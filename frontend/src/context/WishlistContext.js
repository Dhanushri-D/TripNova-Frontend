import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData } from '../services/localStorageService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const all = getData('wishlists');
      const userWishlist = all.find(w => w.userId === currentUser.id);
      setWishlist(userWishlist ? userWishlist.items : []);
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const saveWishlist = (items) => {
    const all = getData('wishlists');
    const idx = all.findIndex(w => w.userId === currentUser.id);
    if (idx !== -1) all[idx].items = items;
    else all.push({ userId: currentUser.id, items });
    saveData('wishlists', all);
    setWishlist(items);
  };

  // type: 'destination' | 'hotel'
  const addToWishlist = (item, type = 'destination') => {
    if (!currentUser) return false;
    if (wishlist.find(w => w.id === item.id && w.itemType === type)) return false;
    const updated = [...wishlist, { ...item, itemType: type, addedAt: new Date().toISOString() }];
    saveWishlist(updated);
    return true;
  };

  const removeFromWishlist = (itemId, type = 'destination') => {
    const updated = wishlist.filter(w => !(w.id === itemId && w.itemType === type));
    saveWishlist(updated);
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
