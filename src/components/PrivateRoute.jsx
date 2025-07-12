// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role.toLowerCase())) {
    // unauthorized role
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
