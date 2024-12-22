// Common chart colors
export const chartColors = {
    positive: '#28a745',  // Green
    neutral: '#007bff',   // Blue
    negative: '#dc3545',  // Red
    backgroundOpacity: 0.2
};

// Common chart fonts
const fonts = {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: {
        title: 16,
        label: 14,
        tick: 12
    }
};

// Bar chart configuration
export const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    family: fonts.family,
                    size: fonts.size.label
                },
                usePointStyle: true
            }
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.dataset.label}: ${value} (${percentage}%)`;
                }
            }
        },
        title: {
            display: true,
            text: 'Sentiment Distribution',
            font: {
                family: fonts.family,
                size: fonts.size.title,
                weight: 'bold'
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Sentiment Categories',
                font: {
                    family: fonts.family,
                    size: fonts.size.title
                }
            },
            ticks: {
                font: {
                    family: fonts.family,
                    size: fonts.size.tick
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Number of Entries',
                font: {
                    family: fonts.family,
                    size: fonts.size.title
                }
            },
            ticks: {
                font: {
                    family: fonts.family,
                    size: fonts.size.tick
                },
                beginAtZero: true
            }
        }
    }
};

// Pie chart configuration
export const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'right',
            labels: {
                font: {
                    family: fonts.family,
                    size: fonts.size.label
                },
                usePointStyle: true
            }
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value} (${percentage}%)`;
                }
            }
        },
        title: {
            display: true,
            text: 'Sentiment Distribution',
            font: {
                family: fonts.family,
                size: fonts.size.title,
                weight: 'bold'
            }
        }
    }
};

// Timeline chart configuration
export const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    family: fonts.family,
                    size: fonts.size.label
                }
            }
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    return `Sentiment Score: ${context.raw.y.toFixed(3)}`;
                }
            }
        },
        title: {
            display: true,
            text: 'Sentiment Timeline',
            font: {
                family: fonts.family,
                size: fonts.size.title,
                weight: 'bold'
            }
        }
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
                displayFormats: {
                    hour: 'MMM d, HH:mm'
                }
            },
            title: {
                display: true,
                text: 'Time',
                font: {
                    family: fonts.family,
                    size: fonts.size.title
                }
            }
        },
        y: {
            min: -1,
            max: 1,
            title: {
                display: true,
                text: 'Sentiment Score',
                font: {
                    family: fonts.family,
                    size: fonts.size.title
                }
            }
        }
    }
};
