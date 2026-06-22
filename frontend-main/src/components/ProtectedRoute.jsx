import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;