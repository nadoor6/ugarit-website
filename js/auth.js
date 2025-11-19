// Enhanced Authentication System for Ugarit Wallet
class AuthenticationManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('ugarit_users')) || [];
        this.init();
    }

    init() {
        // Check for existing session
        this.checkExistingSession();

        // Update UI based on auth status
        this.updateAuthUI();

        // Initialize sign in form
        this.initSignInForm();

        // Initialize admin functions
        this.initAdminFunctions();
    }

    async signIn(walletId, password) {
        try {
            // Show loading state
            this.setLoadingState(true);

            // Validate credentials
            const user = await this.validateCredentials(walletId, password);

            if (user) {
                // Create session
                this.createSession(user);

                // Update UI
                this.updateAuthUI();

                // ✅ FIXED: Redirect to user dashboard instead of staying on index.html
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 500);

                return { success: true, user: user };
            } else {
                return {
                    success: false,
                    error: 'Invalid Wallet ID or Password'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Login failed. Please try again.'
            };
        } finally {
            this.setLoadingState(false);
        }
    }

    async validateCredentials(walletId, password) {
        // Get users from localStorage
        const user = this.users.find(u =>
            u.walletId === walletId &&
            u.password === password &&
            u.status === 'active'
        );

        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveUsers();

            return user;
        }

        return null;
    }

    createSession(user) {
        // Store session data
        const sessionData = {
            walletId: user.walletId,
            userData: user.userData,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };

        localStorage.setItem('ugarit_session', JSON.stringify(sessionData));
        this.currentUser = user;
    }

    logout() {
        // Clear session
        localStorage.removeItem('ugarit_session');
        this.currentUser = null;

        // Update UI
        this.updateAuthUI();

        // Redirect to home
        window.location.href = 'index.html';
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('ugarit_session');

        if (sessionData) {
            const session = JSON.parse(sessionData);
            const user = this.users.find(u => u.walletId === session.walletId);

            if (user && user.status === 'active') {
                this.currentUser = user;
                return true;
            } else {
                // Invalid session
                this.logout();
            }
        }

        return false;
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;

        const loggedOut = authButtons.querySelector('.logged-out');
        const loggedIn = authButtons.querySelector('.logged-in');
        const walletDashboardBtn = authButtons.querySelector('.wallet-dashboard-btn');

        if (this.currentUser) {
            // User is logged in
            loggedOut.style.display = 'none';
            loggedIn.style.display = 'flex';

            // Update dashboard button with wallet ID
            if (walletDashboardBtn) {
                walletDashboardBtn.textContent = `My Wallet (${this.currentUser.walletId})`;
            }
        } else {
            // User is logged out
            loggedOut.style.display = 'flex';
            loggedIn.style.display = 'none';
        }
    }

    initSignInForm() {
        const signInForm = document.getElementById('signInForm');
        const signInError = document.getElementById('signInError');

        if (signInForm) {
            signInForm.addEventListener('submit', async(e) => {
                e.preventDefault();

                const walletId = document.getElementById('walletId').value;
                const password = document.getElementById('walletPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;

                // Clear previous errors
                if (signInError) {
                    signInError.style.display = 'none';
                    signInError.textContent = '';
                }

                // Basic validation
                if (!walletId || !password) {
                    this.showSignInError('Please enter both Wallet ID and Password');
                    return;
                }

                // Attempt sign in
                const result = await this.signIn(walletId, password);

                if (!result.success) {
                    this.showSignInError(result.error);
                }
            });
        }
    }

    // Admin Functions for Manual User Creation
    initAdminFunctions() {
        // Expose admin functions to window for console access
        window.ugaritAdmin = {
            createUser: (userData) => {
                return this.createUser(userData);
            },

            listUsers: () => {
                return this.users;
            },

            updateBalance: (walletId, newBalance) => {
                return this.updateUserBalance(walletId, newBalance);
            },

            addTransaction: (walletId, transactionData) => {
                return this.addUserTransaction(walletId, transactionData);
            },

            getUser: (walletId) => {
                return this.users.find(u => u.walletId === walletId);
            },

            deleteUser: (walletId) => {
                return this.deleteUser(walletId);
            }
        };
    }

    // Admin function to create new user
    createUser(userData) {
        const newUser = {
            walletId: userData.walletId,
            password: userData.password,
            userData: {
                fullName: userData.fullName,
                phone: userData.phone,
                email: userData.email,
                username: userData.username
            },
            balance: 0,
            currency: 'SYP',
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            transactions: []
        };

        this.users.push(newUser);
        this.saveUsers();

        console.log('✅ User created successfully:', newUser);
        return newUser;
    }

    // Admin function to update user balance
    updateUserBalance(walletId, newBalance) {
        const user = this.users.find(u => u.walletId === walletId);
        if (user) {
            user.balance = parseFloat(newBalance);
            this.saveUsers();
            console.log('✅ Balance updated:', user.walletId, 'New balance:', user.balance);
            return true;
        }
        console.log('❌ User not found:', walletId);
        return false;
    }

    // Admin function to add transaction
    addUserTransaction(walletId, transactionData) {
        const user = this.users.find(u => u.walletId === walletId);
        if (user) {
            const transaction = {
                id: Date.now().toString(),
                type: transactionData.type, // 'deposit', 'withdrawal', 'transfer'
                amount: parseFloat(transactionData.amount),
                status: transactionData.status || 'completed',
                description: transactionData.description,
                timestamp: new Date().toISOString(),
                adminNotes: transactionData.adminNotes || ''
            };

            user.transactions.unshift(transaction);

            // Update balance based on transaction type
            if (transaction.type === 'deposit') {
                user.balance += transaction.amount;
            } else if (transaction.type === 'withdrawal') {
                user.balance -= transaction.amount;
            }

            this.saveUsers();
            console.log('✅ Transaction added:', transaction);
            return transaction;
        }
        console.log('❌ User not found:', walletId);
        return null;
    }

    // Admin function to delete user
    deleteUser(walletId) {
        const userIndex = this.users.findIndex(u => u.walletId === walletId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.saveUsers();
            console.log('✅ User deleted:', walletId);
            return true;
        }
        console.log('❌ User not found:', walletId);
        return false;
    }

    saveUsers() {
        localStorage.setItem('ugarit_users', JSON.stringify(this.users));
    }

    showSignInError(message) {
        const signInError = document.getElementById('signInError');
        if (signInError) {
            signInError.textContent = message;
            signInError.style.display = 'block';

            // Shake animation for error
            signInError.classList.add('error-shake');
            setTimeout(() => {
                signInError.classList.remove('error-shake');
            }, 500);
        }
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setLoadingState(loading) {
        const submitBtn = document.querySelector('#signInForm button[type="submit"]');
        if (submitBtn) {
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            if (loading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                submitBtn.disabled = true;
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        }
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
        document.getElementById('walletId').focus();
    }
}

function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';

        // Reset form
        const form = document.getElementById('signInForm');
        if (form) form.reset();

        // Clear errors
        const error = document.getElementById('signInError');
        if (error) {
            error.style.display = 'none';
            error.textContent = '';
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
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

// Add Enter key support for sign in
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const modal = document.getElementById('signInModal');
        if (modal && modal.style.display === 'flex') {
            document.getElementById('signInForm').dispatchEvent(new Event('submit'));
        }
    }
});