// Secure Admin Authentication System
class AdminAuthSystem {
    constructor() {
        this.credentials = {
            username: "NeroUgarit20072004@theking",
            password: "@ugarit$1000@19#bestnero",
            vaultPin: "8544330263nytbr97345bit"
        };

        this.init();
    }

    init() {
        this.checkExistingAdminSession();
        this.initLoginForm();
        this.initSecurityFeatures();
    }

    initLoginForm() {
        const loginForm = document.getElementById('adminLoginForm');
        const loginBtn = document.getElementById('loginBtn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Add real-time validation
        const inputs = document.querySelectorAll('#adminLoginForm input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
            });
        });
    }

    validateForm() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const vaultPin = document.getElementById('vaultPin').value;
        const loginBtn = document.getElementById('loginBtn');

        const isValid = username.length > 0 && password.length > 0 && vaultPin.length > 0;
        loginBtn.disabled = !isValid;
    }

    handleLogin() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const vaultPin = document.getElementById('vaultPin').value;

        this.setLoadingState(true);
        this.hideError();

        // Simulate processing delay for security
        setTimeout(() => {
            const isValid = this.validateCredentials(username, password, vaultPin);

            if (isValid) {
                this.createAdminSession();
                this.redirectToDashboard();
            } else {
                this.showError("Invalid credentials. Please check your username, password, and vault pin.");
                this.logFailedAttempt(username);
            }

            this.setLoadingState(false);
        }, 1000);
    }

    validateCredentials(username, password, vaultPin) {
        return username === this.credentials.username &&
            password === this.credentials.password &&
            vaultPin === this.credentials.vaultPin;
    }

    createAdminSession() {
        const sessionData = {
            admin: true,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            ip: this.getClientIP()
        };

        // Store session with expiration (8 hours)
        const sessionWithExpiry = {
            data: sessionData,
            expiry: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
        };

        localStorage.setItem('ugarit_admin_session', JSON.stringify(sessionWithExpiry));

        // Log successful login
        this.logAdminAccess('SUCCESSFUL_LOGIN');
    }

    checkExistingAdminSession() {
        const sessionData = localStorage.getItem('ugarit_admin_session');

        if (sessionData) {
            const session = JSON.parse(sessionData);

            // Check if session is expired
            if (Date.now() > session.expiry) {
                localStorage.removeItem('ugarit_admin_session');
                return false;
            }

            // Redirect to dashboard if valid session exists
            if (session.data.admin) {
                window.location.href = 'admin-dashboard.html';
            }
        }

        return false;
    }

    redirectToDashboard() {
        // Add a small delay for better UX
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 500);
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';

            // Add shake animation
            errorDiv.classList.add('error-shake');
            setTimeout(() => {
                errorDiv.classList.remove('error-shake');
            }, 500);
        }
    }

    hideError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');

        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    initSecurityFeatures() {
        // Prevent right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Prevent F12, Ctrl+Shift+I, etc.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
            }
        });

        // Clear form on page hide (when switching tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.getElementById('adminLoginForm').reset();
            }
        });
    }

    logFailedAttempt(username) {
        const failedAttempts = JSON.parse(localStorage.getItem('ugarit_admin_failed_attempts') || '[]');

        failedAttempts.push({
            username: username,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP()
        });

        // Keep only last 10 attempts
        if (failedAttempts.length > 10) {
            failedAttempts.shift();
        }

        localStorage.setItem('ugarit_admin_failed_attempts', JSON.stringify(failedAttempts));
    }

    logAdminAccess(action) {
        const accessLogs = JSON.parse(localStorage.getItem('ugarit_admin_access_logs') || '[]');

        accessLogs.push({
            action: action,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP(),
            userAgent: navigator.userAgent
        });

        // Keep only last 100 logs
        if (accessLogs.length > 100) {
            accessLogs.shift();
        }

        localStorage.setItem('ugarit_admin_access_logs', JSON.stringify(accessLogs));
    }

    generateSessionId() {
        return 'admin_sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
    }

    getClientIP() {
        // In a real application, this would be handled server-side
        // This is just a placeholder
        return 'local_development';
    }

    // Static method to check if admin is logged in (for other pages)
    static isAdminLoggedIn() {
        const sessionData = localStorage.getItem('ugarit_admin_session');

        if (sessionData) {
            const session = JSON.parse(sessionData);

            // Check if session is expired
            if (Date.now() > session.expiry) {
                localStorage.removeItem('ugarit_admin_session');
                return false;
            }

            return session.data.admin === true;
        }

        return false;
    }

    // Static method to logout admin
    static logoutAdmin() {
        localStorage.removeItem('ugarit_admin_session');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin auth system
const adminAuth = new AdminAuthSystem();

// Global admin logout function
function adminLogout() {
    if (confirm('Are you sure you want to logout from admin panel?')) {
        AdminAuthSystem.logoutAdmin();
    }
}