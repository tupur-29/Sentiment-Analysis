import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const SentimentChart = ({ data, title = "Sentiment Analysis Results" }) => {
    const processedData = useMemo(() => {
        if (!data?.length) return null;

        // Process sentiment counts
        const sentimentCounts = data.reduce(
            (acc, item) => {
                acc[item.sentiment]++;
                return acc;
            },
            { positive: 0, neutral: 0, negative: 0 }
        );

        return {
            sentimentCounts
        };
    }, [data]);

    if (!processedData) {
        return <div className="chart-no-data">No data available for visualization</div>;
    }

    const { sentimentCounts } = processedData;

    const chartData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            label: 'Sentiment Distribution',
            data: [
                sentimentCounts.positive,
                sentimentCounts.neutral,
                sentimentCounts.negative
            ],
            backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
            borderColor: ['#388e3c', '#1976d2', '#d32f2f'],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title
            }
        }
    };

    return (
        <div className="sentiment-charts">
            <div className="chart-container">
                <h3>Distribution by Sentiment</h3>
                <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="chart-grid">
                <div className="chart-container">
                    <h3>Sentiment Proportions</h3>
                    <div className="chart-wrapper">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="chart-summary">
                <h4>Summary</h4>
                <ul>
                    <li>Positive: {sentimentCounts.positive} ({((sentimentCounts.positive / data.length) * 100).toFixed(1)}%)</li>
                    <li>Neutral: {sentimentCounts.neutral} ({((sentimentCounts.neutral / data.length) * 100).toFixed(1)}%)</li>
                    <li>Negative: {sentimentCounts.negative} ({((sentimentCounts.negative / data.length) * 100).toFixed(1)}%)</li>
                    <li>Total Analyzed: {data.length}</li>
                </ul>
            </div>
        </div>
    );
};

export default SentimentChart;
