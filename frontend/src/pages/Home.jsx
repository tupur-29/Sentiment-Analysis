import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <div className="home-content">
                <h1>Sentiment Analysis Dashboard</h1>
                <p>Upload CSV files and analyze sentiment with interactive visualizations</p>
                <div className="features">
                    <div className="feature">
                        <h3>CSV Upload</h3>
                        <p>Upload your CSV files with text data</p>
                    </div>
                    <div className="feature">
                        <h3>Sentiment Analysis</h3>
                        <p>Analyze sentiment using advanced AI</p>
                    </div>
                    <div className="feature">
                        <h3>Visual Reports</h3>
                        <p>View results in charts and graphs</p>
                    </div>
                </div>
                <Link to="/login" className="get-started-btn">
                    Get Started →
                </Link>
            </div>
        </div>
    );
};

export default Home;