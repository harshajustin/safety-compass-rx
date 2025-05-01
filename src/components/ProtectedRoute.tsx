import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Show a loading spinner or skeleton screen while checking auth
    // For simplicity, we can return null or a minimal loading indicator
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>Loading authentication status...</div>
        </div>
    ); 
  }

  // If loading is finished and user is not logged in, redirect to landing page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If loading is finished and user is logged in, render the child route element
  return <Outlet />; // Renders the nested route component (e.g., <Index />)
};

export default ProtectedRoute; 