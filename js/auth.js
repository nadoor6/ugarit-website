// Simple Authentication System for Ugarit Wallet
class AuthenticationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initSignInForm();
        this.updateAuthUI();
    }

    initSignInForm() {
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }
    }

    handleSignIn() {
        const walletId = document.getElementById('walletId').value;
        const password = document.getElementById('walletPassword').value;

        console.log('Attempting sign in with:', walletId); // Debug log

        if (!walletId || !password) {
            this.showSignInError('Please enter both Wallet ID and Password');
            return;
        }

        // Validate credentials
        const user = this.validateCredentials(walletId, password);

        if (user) {
            console.log('Login successful, redirecting...'); // Debug log
            // Create session
            this.createSession(user);

            // Close modal and redirect
            this.closeSignInModal();
            window.location.href = 'user-dashboard.html';
        } else {
            console.log('Login failed'); // Debug log
            this.showSignInError('Invalid Wallet ID or Password');
        }
    }

    validateCredentials(walletId, password) {
        try {
            const users = JSON.parse(localStorage.getItem('ugarit_users') || '[]');
            console.log('Available users:', users); // Debug log

            const user = users.find(u =>
                u.walletId === walletId &&
                u.password === password
            );

            if (user) {
                // Update last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('ugarit_users', JSON.stringify(users));
                return user;
            }
        } catch (error) {
            console.error('Error validating credentials:', error);
        }
        return null;
    }

    createSession(user) {
        const sessionData = {
            walletId: user.walletId,
            userData: user.userData,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('ugarit_session', JSON.stringify(sessionData));
        console.log('Session created:', sessionData); // Debug log
    }

    closeSignInModal() {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Reset form
        const form = document.getElementById('signInForm');
        if (form) form.reset();

        // Clear errors
        this.hideSignInError();
    }

    updateAuthUI() {
        try {
            const sessionData = localStorage.getItem('ugarit_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const users = JSON.parse(localStorage.getItem('ugarit_users') || '[]');
                const user = users.find(u => u.walletId === session.walletId);

                if (user) {
                    this.showLoggedInState(user);
                    return;
                }
            }
        } catch (error) {
            console.error('Error updating auth UI:', error);
        }
        this.showLoggedOutState();
    }

    showLoggedInState(user) {
        const loggedOut = document.querySelector('.logged-out');
        const loggedIn = document.querySelector('.logged-in');
        const walletBtn = document.querySelector('.wallet-dashboard-btn');

        if (loggedOut) loggedOut.style.display = 'none';
        if (loggedIn) loggedIn.style.display = 'flex';
        if (walletBtn) {
            walletBtn.textContent = `Wallet: ${user.walletId}`;
        }
    }

    showLoggedOutState() {
        const loggedOut = document.querySelector('.logged-out');
        const loggedIn = document.querySelector('.logged-in');

        if (loggedOut) loggedOut.style.display = 'flex';
        if (loggedIn) loggedIn.style.display = 'none';
    }

    showSignInError(message) {
        const signInError = document.getElementById('signInError');
        if (signInError) {
            signInError.textContent = message;
            signInError.style.display = 'block';
        }
    }

    hideSignInError() {
        const signInError = document.getElementById('signInError');
        if (signInError) {
            signInError.style.display = 'none';
            signInError.textContent = '';
        }
    }

    logout() {
        localStorage.removeItem('ugarit_session');
        this.updateAuthUI();
        window.location.href = 'index.html';
    }
}

// Initialize authentication
const authManager = new AuthenticationManager();

// Global functions for modal control
function showSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Clear any previous errors
        authManager.hideSignInError();

        // Focus on first input
        const walletIdInput = document.getElementById('walletId');
        if (walletIdInput) walletIdInput.focus();
    }
}

function closeSignInModal() {
    authManager.closeSignInModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('signInModal');
    if (event.target === modal) {
        closeSignInModal();
    }
});

// Logout function
function logoutUser() {
    if (confirm('Are you sure you want to log out?')) {
        authManager.logout();
    }
}

// Add Enter key support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSignInModal();
    }
});