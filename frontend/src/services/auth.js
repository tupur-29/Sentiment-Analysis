import APIService from './api';

const TOKEN_KEY = 'token';

const AuthService = {
    login: async (username, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem(TOKEN_KEY, data.access_token);
                return { success: true };
            }

            return {
                success: false,
                error: 'Invalid credentials'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};

export default AuthService;
