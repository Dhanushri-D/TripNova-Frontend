import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('currentUser');
    if (token && saved) {
      setCurrentUser(JSON.parse(saved));
      // Verify token is still valid
      authAPI.getMe()
        .then(res => {
          const user = { ...res.data, id: res.data._id };
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      const safeUser = { ...user, id: user.id || user._id };
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed.' };
    }
  };

  const signup = async (name, email, password, phone) => {
    try {
      const res = await authAPI.signup({ name, email, password, phone });
      const { token, user } = res.data;
      const safeUser = { ...user, id: user.id || user._id };
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authAPI.updateProfile(updates);
      const user = { ...res.data, id: res.data._id };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      await authAPI.resetPassword({ email, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Reset failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout, updateProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
