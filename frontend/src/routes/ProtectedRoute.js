import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner-teal"></div></div>;
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
