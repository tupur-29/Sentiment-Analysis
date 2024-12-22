import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFound.css';

const NotFound = () => {
    const { isAuthenticated } = useAuth();
    const homePath = isAuthenticated() ? '/dashboard' : '/login';

    return (
        <div className="not-found">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>

                <div className="actions">
                    <Link to={homePath} className="primary-button">
                        {isAuthenticated() ? 'Back to Dashboard' : 'Go to Login'}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="secondary-button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
