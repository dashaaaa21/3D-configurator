// API URL configuration
const API_BASE = 'https://threed-configurator-qrxl.onrender.com/api';
const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '' 
    ? import.meta.env.VITE_API_URL 
    : (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://localhost:3002/api' 
        : API_BASE);

console.log('API_URL configured as:', API_URL);
class AuthService {
    async register(userData) {
        try {
            console.log('Registering user with API:', API_URL);
            console.log('Full URL:', `${API_URL}/auth/register`);
            
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));
            
            // Get response text first to see what we're getting
            const responseText = await response.text();
            console.log('Response text:', responseText.substring(0, 200));
            
            if (!response.ok) {
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(`Server error: ${response.status} - ${responseText.substring(0, 100)}`);
                }
                throw new Error(data.message || `Server error: ${response.status}`);
            }
            
            const data = JSON.parse(responseText);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('502')) {
                throw new Error('Backend server is not responding. Please try again later.');
            }
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
