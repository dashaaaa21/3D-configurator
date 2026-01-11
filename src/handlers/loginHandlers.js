import authService from '../utils/authService.js';
export function handleLoginSubmit(form, errorMessage, loginBtn, onSuccess) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };
        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            errorMessage.style.display = 'none';
            const response = await authService.login(credentials);
            if (response.success) {
                if (onSuccess) {
                    onSuccess(response.user);
                }
            }
        } catch (error) {
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
}
export function handleNavigateToRegister(link, onNavigate) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (onNavigate) onNavigate('register');
    });
}
