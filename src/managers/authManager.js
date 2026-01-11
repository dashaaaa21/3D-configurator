import authService from '../utils/authService.js';
import { createUserProfile } from '../views/userProfile.js';
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.navbarAuthContainer = null;
        this.navbarUserContainer = null;
    }
    init(navbarAuthContainer, navbarUserContainer) {
        this.navbarAuthContainer = navbarAuthContainer;
        this.navbarUserContainer = navbarUserContainer;
        this.checkAuth();
    }
    async checkAuth() {
        try {
            const response = await authService.getCurrentUser();
            if (response.success && response.user) {
                this.setUser(response.user);
            }
        } catch (error) {
        }
    }
    setUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.showUserProfile();
    }
    showUserProfile() {
        if (!this.currentUser) return;
        if (this.navbarAuthContainer) {
            this.navbarAuthContainer.style.display = 'none';
        }
        if (this.navbarUserContainer) {
            this.navbarUserContainer.innerHTML = '';
            const userProfile = createUserProfile(
                this.currentUser,
                () => this.logout()
            );
            this.navbarUserContainer.appendChild(userProfile);
            this.navbarUserContainer.style.display = 'flex';
        }
    }
    showAuthButtons() {
        if (this.navbarAuthContainer) {
            this.navbarAuthContainer.style.display = 'flex';
        }
        if (this.navbarUserContainer) {
            this.navbarUserContainer.style.display = 'none';
            this.navbarUserContainer.innerHTML = '';
        }
    }
    async logout() {
        try {
            await authService.logout();
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            this.showAuthButtons();
        } catch (error) {
        }
    }
    getUser() {
        return this.currentUser;
    }
}
export default new AuthManager();
