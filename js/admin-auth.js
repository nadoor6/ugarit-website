// Admin Authentication System
class AdminAuthentication {
    constructor() {
        this.adminSession = null;
        this.adminCredentials = {
            username: 'kingnero',
            password: '20072007neroking'
        };
        this.init();
    }

    init() {
        this.checkAdminSession();
        this.initLoginForm();
    }

    initLoginForm() {
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.attemptLogin();
            });
        }
    }

    async attemptLogin() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        // Basic validation
        if (!username || !password) {
            this.showLoginError('Please enter both Admin ID and Password');
            return;
        }

        try {
            const isValid = await this.validateAdminCredentials(username, password);

            if (isValid) {
                this.createAdminSession(username);
                window.location.href = 'admin-dashboard.html';
            } else {
                this.showLoginError('Invalid admin credentials');
            }
        } catch (error) {
            this.showLoginError('Login failed. Please try again.');
        }
    }

    async validateAdminCredentials(username, password) {
        // Validate against stored credentials
        return username === this.adminCredentials.username &&
            password === this.adminCredentials.password;
    }

    createAdminSession(username) {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            ip: this.getClientIP()
        };

        localStorage.setItem('ugarit_admin_session', JSON.stringify(sessionData));
        this.adminSession = sessionData;

        // Log admin login
        this.logAdminAction('LOGIN', `Admin ${username} logged in`);
    }

    checkAdminSession() {
        const sessionData = localStorage.getItem('ugarit_admin_session');

        if (sessionData) {
            this.adminSession = JSON.parse(sessionData);

            // Check if session is still valid (24 hours)
            const loginTime = new Date(this.adminSession.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                // Valid session - redirect to dashboard if on login page
                if (window.location.pathname.includes('admin-login.html')) {
                    window.location.href = 'admin-dashboard.html';
                }
                return true;
            } else {
                // Session expired
                this.logout();
            }
        }

        // If no valid session and on admin page (except login), redirect to login
        if (!window.location.pathname.includes('admin-login.html') &&
            window.location.pathname.includes('admin')) {
            window.location.href = 'admin-login.html';
        }

        return false;
    }

    logout() {
        // Log logout action
        if (this.adminSession) {
            this.logAdminAction('LOGOUT', `Admin ${this.adminSession.username} logged out`);
        }

        // Clear session
        localStorage.removeItem('ugarit_admin_session');
        this.adminSession = null;

        // Redirect to login
        window.location.href = 'admin-login.html';
    }

    showLoginError(message) {
        const errorElement = document.getElementById('adminLoginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    generateSessionId() {
        return 'admin_sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getClientIP() {
        // This would be handled server-side in production
        return '127.0.0.1';
    }

    logAdminAction(action, details) {
        const logs = JSON.parse(localStorage.getItem('ugarit_admin_logs') || '[]');
        logs.push({
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            admin: this.adminSession ? this.adminSession.username : 'System',
            sessionId: this.adminSession ? this.adminSession.sessionId : null
        });
        localStorage.setItem('ugarit_admin_logs', JSON.stringify(logs));
    }
}

// Initialize admin auth
const adminAuth = new AdminAuthentication();

// Admin logout function
function adminLogout() {
    if (confirm('Are you sure you want to log out?')) {
        adminAuth.logout();
    }
}