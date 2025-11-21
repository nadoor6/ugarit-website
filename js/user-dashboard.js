// User Dashboard Management System
class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.initModals();
        this.initForms();
        this.updateDashboard();
    }

    loadUserData() {
        const sessionData = localStorage.getItem('ugarit_session');
        if (!sessionData) {
            window.location.href = 'index.html';
            return;
        }

        const session = JSON.parse(sessionData);
        const users = JSON.parse(localStorage.getItem('ugarit_users') || '[]');
        this.currentUser = users.find(user => user.walletId === session.walletId);

        if (!this.currentUser) {
            this.logout();
            return;
        }

        // Update UI with user data
        this.updateUserInfo();
    }

    updateUserInfo() {
        // Update welcome message
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser.userData.fullName) {
            userNameElement.textContent = this.currentUser.userData.fullName;
        }

        // Update wallet ID
        const walletIdElement = document.getElementById('userWalletId');
        if (walletIdElement) {
            walletIdElement.textContent = this.currentUser.walletId;
        }

        // Update dashboard button
        const dashboardBtn = document.getElementById('walletDashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.textContent = `Wallet: ${this.currentUser.walletId}`;
        }
    }

    updateDashboard() {
        this.updateBalance();
        this.updateTransactions();
        this.updatePendingRequestsStatus(); // NEW: Update pending requests status
    }

    // NEW: Update pending requests status
    updatePendingRequestsStatus() {
        const statusElement = document.getElementById('pendingRequestsStatus');
        const listElement = document.getElementById('pendingRequestsList');

        if (!statusElement || !listElement) return;

        const requests = JSON.parse(localStorage.getItem('ugarit_pending_requests') || '[]');
        const userRequests = requests.filter(req => req.walletId === this.currentUser.walletId);

        if (userRequests.length === 0) {
            statusElement.style.display = 'none';
            return;
        }

        statusElement.style.display = 'block';
        listElement.innerHTML = userRequests.map(req => `
            <div class="pending-request-item" style="padding: 0.5rem; border-left: 3px solid #ffc107; margin-bottom: 0.5rem; background: rgba(255,255,255,0.05);">
                <div style="font-weight: 600;">${req.type.toUpperCase()} - ${req.amount} SYP</div>
                <div style="font-size: 0.8rem; color: var(--secondary-text);">
                    ${this.formatDate(req.timestamp)} - Waiting for admin approval
                </div>
            </div>
        `).join('');
    }

    updateBalance() {
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
            balanceElement.textContent = this.currentUser.balance.toFixed(2);
        }
    }

    updateTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList) return;

        const recentTransactions = this.currentUser.transactions.slice(0, 5);

        if (recentTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No transactions yet</h3>
                    <p>Your transaction history will appear here</p>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-icon ${transaction.type}">
                    ${this.getTransactionIcon(transaction.type)}
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${this.getTransactionTitle(transaction)}</div>
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-date">${this.formatDate(transaction.timestamp)}</div>
                </div>
                <div class="transaction-amount">
                    <div class="${transaction.type === 'deposit' ? 'amount-positive' : 'amount-negative'}">
                        ${transaction.type === 'deposit' ? '+' : '-'}${transaction.amount} SYP
                    </div>
                    <div class="transaction-status" style="font-size: 0.7rem; color: var(--secondary-text);">
                        ${transaction.status}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getTransactionIcon(type) {
        const icons = {
            'deposit': '💳',
            'withdrawal': '🏦',
            'transfer': '🔄'
        };
        return icons[type] || '📄';
    }

    getTransactionTitle(transaction) {
        const titles = {
            'deposit': 'Deposit',
            'withdrawal': 'Withdrawal',
            'transfer': 'Transfer'
        };
        return titles[transaction.type] || 'Transaction';
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    initModals() {
        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    initForms() {
        // Deposit form
        const depositForm = document.getElementById('depositForm');
        if (depositForm) {
            depositForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.requestDeposit();
            });
        }

        // Withdraw form
        const withdrawForm = document.getElementById('withdrawForm');
        if (withdrawForm) {
            withdrawForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.requestWithdrawal();
            });
        }

        // Transfer form
        const transferForm = document.getElementById('transferForm');
        if (transferForm) {
            transferForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.requestTransfer();
            });
        }
    }

    requestDeposit() {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const method = document.getElementById('depositMethod').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!method) {
            alert('Please select a payment method');
            return;
        }

        // Create deposit request
        const depositRequest = {
            id: 'dep_' + Date.now(),
            walletId: this.currentUser.walletId,
            type: 'deposit',
            amount: amount,
            method: method,
            status: 'pending',
            timestamp: new Date().toISOString(),
            userNote: `Deposit request via ${method}`
        };

        // Save to pending requests
        this.saveTransactionRequest(depositRequest);

        alert(`Deposit request submitted for ${amount} SYP. Admin will process it shortly.`);
        closeDepositModal();
        depositForm.reset();

        // Update dashboard to show pending request
        this.updatePendingRequestsStatus();
    }

    requestWithdrawal() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const bankAccount = document.getElementById('bankAccount').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > this.currentUser.balance) {
            alert('Insufficient balance');
            return;
        }

        if (!bankAccount) {
            alert('Please enter your bank account number');
            return;
        }

        // Create withdrawal request
        const withdrawalRequest = {
            id: 'withdraw_' + Date.now(),
            walletId: this.currentUser.walletId,
            type: 'withdrawal',
            amount: amount,
            bankAccount: bankAccount,
            status: 'pending',
            timestamp: new Date().toISOString(),
            userNote: `Withdrawal to bank account ${bankAccount}`
        };

        // Save to pending requests
        this.saveTransactionRequest(withdrawalRequest);

        alert(`Withdrawal request submitted for ${amount} SYP. Admin will process it within 24 hours.`);
        closeWithdrawModal();
        withdrawForm.reset();

        // Update dashboard to show pending request
        this.updatePendingRequestsStatus();
    }

    requestTransfer() {
        const recipientWalletId = document.getElementById('recipientWalletId').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);
        const note = document.getElementById('transferNote').value;

        if (!recipientWalletId) {
            alert('Please enter recipient wallet ID');
            return;
        }

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > this.currentUser.balance) {
            alert('Insufficient balance');
            return;
        }

        // Check if recipient exists
        const users = JSON.parse(localStorage.getItem('ugarit_users') || '[]');
        const recipient = users.find(user => user.walletId === recipientWalletId);

        if (!recipient) {
            alert('Recipient wallet ID not found');
            return;
        }

        // Create transfer request
        const transferRequest = {
            id: 'transfer_' + Date.now(),
            fromWalletId: this.currentUser.walletId,
            toWalletId: recipientWalletId,
            type: 'transfer',
            amount: amount,
            note: note,
            status: 'pending',
            timestamp: new Date().toISOString(),
            userNote: `Transfer to ${recipientWalletId}`
        };

        // Save to pending requests
        this.saveTransactionRequest(transferRequest);

        alert(`Transfer request submitted for ${amount} SYP to ${recipientWalletId}. Admin will process it shortly.`);
        closeTransferModal();
        transferForm.reset();

        // Update dashboard to show pending request
        this.updatePendingRequestsStatus();
    }

    saveTransactionRequest(request) {
        const requests = JSON.parse(localStorage.getItem('ugarit_pending_requests') || '[]');
        requests.push(request);
        localStorage.setItem('ugarit_pending_requests', JSON.stringify(requests));
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    logout() {
        localStorage.removeItem('ugarit_session');
        window.location.href = 'index.html';
    }
}

// Initialize dashboard
const userDashboard = new UserDashboard();

// Modal control functions
function showDepositModal() {
    document.getElementById('depositModal').style.display = 'flex';
}

function closeDepositModal() {
    document.getElementById('depositModal').style.display = 'none';
}

function showWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'flex';
}

function closeWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'none';
}

function showTransferModal() {
    document.getElementById('transferModal').style.display = 'flex';
}

function closeTransferModal() {
    document.getElementById('transferModal').style.display = 'none';
}

function viewTransactionHistory() {
    // In a real app, this would navigate to transactions page
    alert('Transaction history page would open here');
}

// Global logout function
function logoutUser() {
    if (confirm('Are you sure you want to log out?')) {
        userDashboard.logout();
    }
}

// Refresh dashboard every 10 seconds to get updates (faster refresh)
setInterval(() => {
    userDashboard.loadUserData();
    userDashboard.updatePendingRequestsStatus();
}, 10000);

// Update card details with user data
function updateCardDetails() {
    const sessionData = localStorage.getItem('ugarit_session');
    if (sessionData) {
        const session = JSON.parse(sessionData);

        // Update card holder name
        const userName = session.fullName || 'User';
        document.getElementById('cardHolder').textContent = userName.toUpperCase();

        // Update card number with wallet ID
        const walletId = session.walletId || '1234';
        const lastFour = walletId.slice(-4);
        document.getElementById('cardNumber').textContent = `•••• •••• •••• ${lastFour}`;

        // Update displayed user name
        document.getElementById('userName').textContent = userName;
        document.getElementById('userWalletId').textContent = walletId;
    }
}

// Call this when the dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    updateCardDetails();
});