import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, role }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" />;
  return element;
};

export default ProtectedRoute;
