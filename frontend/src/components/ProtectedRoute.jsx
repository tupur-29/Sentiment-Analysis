import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated()) {
        // Redirect to login while saving the attempted URL
        return <Navigate
            to="/login"
            replace
            state={{ from: location.pathname }}
        />;
    }

    return children;
};

export default ProtectedRoute; 