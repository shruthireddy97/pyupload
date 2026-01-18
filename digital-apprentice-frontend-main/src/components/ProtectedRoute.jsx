import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;