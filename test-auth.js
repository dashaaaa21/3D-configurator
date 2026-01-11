const API_URL = 'http://localhost:5001/api';

async function testAuth() {
    console.log('Testing API...\n');
    

    try {
        console.log('1. Checking server...');
        const healthResponse = await fetch(`${API_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('Server is working:', healthData);
    } catch (error) {
        console.error('Server is not responding:', error.message);
        console.log('Start server with: node server/server.js');
        return;
    }
    

    console.log('\n2. Testing registration...');
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test1234'
    };
    
    try {
        const registerResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        const registerData = await registerResponse.json();
        
        if (registerData.success) {
            console.log('Registration works');
            console.log('User:', registerData.user);
            console.log('Token received:', registerData.token ? 'Yes' : 'No');
        } else {
            console.log('Registration failed:', registerData.message);
        }
    } catch (error) {
        console.error('Request error:', error.message);
    }
    

    console.log('\n3. Testing login...');
    try {
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
            console.log('Login works');
            console.log('User:', loginData.user);
        } else {
            console.log('Login failed:', loginData.message);
        }
    } catch (error) {
        console.error('Request error:', error.message);
    }
    

    console.log('\n4. Testing validation...');
    try {
        const invalidResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'T',
                email: 'invalid-email',
                password: '123'
            })
        });
        
        const invalidData = await invalidResponse.json();
        
        if (!invalidData.success && invalidData.errors) {
            console.log('Validation works');
            console.log('Errors:', invalidData.errors.map(e => e.message).join(', '));
        }
    } catch (error) {
        console.error('Request error:', error.message);
    }
    
    console.log('\nTesting complete');
}


testAuth();
