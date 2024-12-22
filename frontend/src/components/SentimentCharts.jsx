import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import './SentimentCharts.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const SentimentCharts = ({ results }) => {
    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [results.positive, results.neutral, results.negative],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Positive - Green
                    'rgba(54, 162, 235, 0.6)', // Neutral - Blue
                    'rgba(255, 99, 132, 0.6)', // Negative - Red
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sentiment Distribution',
            },
        },
    };

    return (
        <div className="charts-container">
            <div className="chart-wrapper">
                <h3>Bar Chart</h3>
                <Bar data={data} options={options} />
            </div>
            <div className="chart-wrapper">
                <h3>Pie Chart</h3>
                <Pie data={data} options={options} />
            </div>
            <div className="stats-summary">
                <h3>Summary</h3>
                <div className="stat-item">
                    <span>Total Analyzed:</span>
                    <span>{results.total}</span>
                </div>
                <div className="stat-item positive">
                    <span>Positive:</span>
                    <span>{results.positive} ({((results.positive / results.total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="stat-item neutral">
                    <span>Neutral:</span>
                    <span>{results.neutral} ({((results.neutral / results.total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="stat-item negative">
                    <span>Negative:</span>
                    <span>{results.negative} ({((results.negative / results.total) * 100).toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    );
};

export default SentimentCharts; 