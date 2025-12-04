import { handleLoginSubmit, handleNavigateToRegister } from '../handlers/loginHandlers.js';


export function createLoginPage(onSuccess, onNavigate) {
    const page = document.createElement('div');
    page.className = 'auth-container';
    

    page.innerHTML = `
        <div class="auth-card">
            <h1>Welcome Back</h1>
            <p class="subtitle">Login to your account</p>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            
            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                
                <div class="form-options">
                    <label class="checkbox">
                        <input type="checkbox" name="remember">
                        <span>Remember me</span>
                    </label>
                </div>
                
                <button type="submit" class="btn-primary" id="loginBtn">Login</button>
            </form>
            
            <p class="auth-link">
                Don't have an account? <a href="#" id="registerLink">Register</a>
            </p>
        </div>
    `;
    
 
    const form = page.querySelector('#loginForm');
    const errorMessage = page.querySelector('#errorMessage');
    const loginBtn = page.querySelector('#loginBtn');
    const registerLink = page.querySelector('#registerLink');
    

    handleLoginSubmit(form, errorMessage, loginBtn, onSuccess);
    handleNavigateToRegister(registerLink, onNavigate);
    
    return page;
}
