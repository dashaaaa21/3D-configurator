const API_URL = import.meta.env.VITE_API_URL || 'https://threed-configurator-qrxl.onrender.com/api';
class AuthService {
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
    async logout() {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get user');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
}
export default new AuthService();
