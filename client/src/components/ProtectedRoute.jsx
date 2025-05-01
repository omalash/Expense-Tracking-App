import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { accessToken, initialized } = useContext(AuthContext);

  // don’t render anything until we know if refresh succeeded
  if (!initialized) return null;
  return accessToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
