// API Configuration
export const API_BASE_URL = 'http://localhost:8000';
export const API_TIMEOUT = 30000; // 30 seconds

// File Upload Configuration
export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_TYPES: ['text/csv'],
    ALLOWED_EXTENSIONS: ['.csv']
};

// Authentication Configuration
export const AUTH_CONFIG = {
    TOKEN_KEY: 'token',
    TOKEN_EXPIRY_KEY: 'token_expiry',
    TOKEN_EXPIRY_TIME: 30 * 60 * 1000, // 30 minutes in milliseconds
    LOGIN_REDIRECT: '/dashboard',
    LOGOUT_REDIRECT: '/login'
};

// Chart Configuration
export const CHART_CONFIG = {
    COLORS: {
        positive: '#28a745',  // Green
        neutral: '#007bff',   // Blue
        negative: '#dc3545',  // Red
        background: '#f8f9fa'
    },
    FONTS: {
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
            xlarge: '18px'
        }
    }
};

// Theme Configuration
export const THEME = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        white: '#ffffff',
        background: '#f5f5f5',
        border: '#dee2e6'
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    breakpoints: {
        xs: '0px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px'
    }
};

// Test Configuration
export const TEST_CONFIG = {
    TEST_USER: {
        username: 'testuser',
        password: 'testpassword'
    }
};

// Error Messages
export const ERROR_MESSAGES = {
    FILE_SIZE: 'File size exceeds the maximum limit of 5MB',
    FILE_TYPE: 'Only CSV files are allowed',
    NETWORK: 'Network error. Please check your connection',
    AUTH: 'Authentication failed. Please try again',
    SERVER: 'Server error. Please try again later',
    VALIDATION: 'Please check your input and try again'
};
