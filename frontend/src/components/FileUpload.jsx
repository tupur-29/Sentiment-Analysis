import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    const validateFile = (file) => {
        // Check file type
        if (!file.name.endsWith('.csv')) {
            throw new Error('Please upload a CSV file');
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError(null);

        try {
            if (selectedFile) {
                validateFile(selectedFile);
                setFile(selectedFile);
            }
        } catch (err) {
            setError(err.message);
            setFile(null);
            e.target.value = null; // Reset input
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/sentiment/analyze`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.status === 'success') {
                onAnalysisComplete(response.data.results);
                setFile(null);
                // Reset file input
                e.target.reset();
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                error.message ||
                'Error uploading file'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <form onSubmit={handleFileUpload} className="upload-form">
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".csv"
                        className="file-input"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="file-label">
                        {file ? file.name : 'Choose CSV file'}
                    </label>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!file || loading}
                    className={`upload-button ${loading ? 'loading' : ''}`}
                >
                    {loading ? 'Analyzing...' : 'Upload and Analyze'}
                </button>
            </form>

            {loading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Analyzing sentiment...</p>
                </div>
            )}

            <div className="file-requirements">
                <h4>File Requirements:</h4>
                <ul>
                    <li>CSV format only</li>
                    <li>Maximum size: 5MB</li>
                    <li>Required columns: id, text, timestamp(optional)</li>
                </ul>
            </div>
        </div>
    );
};

export default FileUpload;
