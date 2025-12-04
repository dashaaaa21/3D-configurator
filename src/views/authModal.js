import { createLoginPage } from './loginPage.js';
import { createRegisterPage } from './registerPage.js';

export function createAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.id = 'authModal';
    
    modal.innerHTML = `
        <div class="auth-modal-overlay"></div>
        <div class="auth-modal-content">
            <button class="auth-modal-close" id="closeModal">&times;</button>
            <div id="authModalBody"></div>
        </div>
    `;
    
    const overlay = modal.querySelector('.auth-modal-overlay');
    const closeBtn = modal.querySelector('#closeModal');
    const modalBody = modal.querySelector('#authModalBody');
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
   
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
 
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    

    const navigate = (page) => {
        modalBody.innerHTML = '';
        let pageElement;
        
        if (page === 'login') {
            pageElement = createLoginPage(
                (user) => onAuthSuccess(user),
                (page) => navigate(page)
            );
        } else {
            pageElement = createRegisterPage(
                (user) => onAuthSuccess(user),
                (page) => navigate(page)
            );
        }
        
        modalBody.appendChild(pageElement);
    };
    

    const onAuthSuccess = (user) => {
        console.log('User logged in:', user);
        closeModal();
        
        if (modal.onAuthSuccess) {
            modal.onAuthSuccess(user);
        }
    };
    

    modal.show = (page = 'login') => {
        navigate(page);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    

    modal.hide = closeModal;
    
    return modal;
}
