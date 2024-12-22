import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import SentimentCharts from '../components/SentimentCharts';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/v1/sentiment/analyze', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setResults(data.results);
            } else {
                setError(data.detail || 'Upload failed');
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="upload-section">
                <h2>Upload CSV File for Sentiment Analysis</h2>
                <form onSubmit={handleUpload}>
                    <div className="file-input">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button
                        type="submit"
                        className="upload-button"
                        disabled={!file || loading}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                    </button>
                </form>

                {results && (
                    <div className="results-section">
                        <SentimentCharts results={results} />
                    </div>
                )}

                <div className="file-requirements">
                    <h4>File Requirements:</h4>
                    <ul>
                        <li>Must be a CSV file</li>
                        <li>Required columns: id, text</li>
                        <li>Optional: timestamp</li>
                        <li>Example format:</li>
                        <code>
                            id,text,timestamp<br />
                            1,"Great product!",2024-01-15 10:00:00
                        </code>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
