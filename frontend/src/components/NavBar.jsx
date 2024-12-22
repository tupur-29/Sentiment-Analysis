import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <h1>Sentiment Analysis</h1>
                </div>
                <div className="navbar-links">
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
