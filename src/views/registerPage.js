import authService from '../utils/authService.js';

export function createRegisterPage(onSuccess, onNavigate) {
    const page = document.createElement('div');
    page.className = 'auth-container';
    
    page.innerHTML = `
        <div class="auth-card">
            <h1>Create Account</h1>
            <p class="subtitle">Join us today</p>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            
            <form id="registerForm" class="auth-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" required>
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                    <small>Min 8 chars, 1 uppercase, 1 lowercase, 1 number</small>
                </div>
                
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" required>
                </div>
                
                <button type="submit" class="btn-primary" id="registerBtn">Register</button>
            </form>
            
            <p class="auth-link">
                Already have an account? <a href="#" id="loginLink">Login</a>
            </p>
        </div>
    `;
    
    const form = page.querySelector('#registerForm');
    const errorMessage = page.querySelector('#errorMessage');
    const registerBtn = page.querySelector('#registerBtn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }
        
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: password
        };
        
        try {
            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating account...';
            errorMessage.style.display = 'none';
            
            const response = await authService.register(userData);
            
            if (response.success) {
                if (onSuccess) {
                    onSuccess(response.user);
                }
            }
        } catch (error) {
            const errorText = error.message || 'Registration failed. Please try again.';
            errorMessage.textContent = errorText;
            errorMessage.style.display = 'block';
        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Register';
        }
    });
    
    page.querySelector('#loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        if (onNavigate) onNavigate('login');
    });
    
    return page;
}
