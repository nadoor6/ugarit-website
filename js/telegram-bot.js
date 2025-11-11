// Telegram Bot Integration for Ugarit
class UgaritTelegramBot {
    constructor() {
        this.botToken = '8304107526:AAHgP-dcFjaoYIc7KLj4cqySCGAiDPZKmFY'; // You'll get this from @BotFather
        this.adminChatId = '8040101944'; // Your Telegram chat ID
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupUserSession();
        this.initRealTimeUpdates();
    }

    setupFormHandlers() {
        // Wallet creation form
        const walletForm = document.querySelector('.wallet-form');
        if (walletForm) {
            walletForm.addEventListener('submit', (e) => this.handleWalletCreation(e));
        }

        // Transaction forms
        this.setupTransactionHandlers();
    }

    async handleWalletCreation(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userData = {
            type: 'WALLET_CREATION',
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            city: formData.get('city'),
            plan: formData.get('plan'),
            timestamp: new Date().toISOString(),
            userIp: await this.getUserIP(),
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
        };

        try {
            await this.sendToAdmin(userData);
            this.showSuccess('Wallet request sent! Admin will contact you via Telegram within 24 hours.');
            this.generateTempWalletId(userData);
            e.target.reset();
        } catch (error) {
            this.showError('Failed to submit request. Please contact @UgaritAdmin directly.');
        }
    }

    async sendToAdmin(data) {
        const message = this.formatMessage(data);

        const response = await fetch(`${this.apiUrl}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.adminChatId,
                text: message,
                parse_mode: 'HTML',
                reply_markup: this.getActionButtons(data)
            })
        });

        if (!response.ok) {
            throw new Error('Telegram API error');
        }

        return await response.json();
    }

    formatMessage(data) {
        return `
🆕 <b>New ${data.type}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${data.fullName}
📞 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🏙️ <b>City:</b> ${data.city}
💼 <b>Plan:</b> ${data.plan}
⏰ <b>Time:</b> ${new Date(data.timestamp).toLocaleString()}
🌐 <b>IP:</b> ${data.userIp}
🆔 <b>Session:</b> ${data.sessionId}
        `.trim();
    }

    getActionButtons(data) {
        return {
            inline_keyboard: [
                [{
                        text: "✅ Approve",
                        callback_data: `approve_${data.sessionId}`
                    },
                    {
                        text: "❌ Reject",
                        callback_data: `reject_${data.sessionId}`
                    }
                ],
                [{
                        text: "📞 Contact User",
                        callback_data: `contact_${data.phone}`
                    },
                    {
                        text: "👀 View Details",
                        callback_data: `details_${data.sessionId}`
                    }
                ]
            ]
        };
    }

    generateTempWalletId(userData) {
        const walletId = 'UG' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        this.saveToLocalStorage('temp_wallet_id', walletId);

        this.showNotification(`
            🎉 Request Submitted Successfully!
            📝 Your Temporary ID: <strong>${walletId}</strong>
            💬 Save this ID for reference when admin contacts you.
        `, 'success');

        return walletId;
    }

    setupUserSession() {
        let sessionId = localStorage.getItem('ugarit_session_id');
        if (!sessionId) {
            sessionId = 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ugarit_session_id', sessionId);
        }
        return sessionId;
    }

    getSessionId() {
        return localStorage.getItem('ugarit_session_id') || 'unknown';
    }

    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(`ugarit_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage not available');
        }
    }

    getFromLocalStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(`ugarit_${key}`));
        } catch (error) {
            return null;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.ugarit-notification');
        existing.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `ugarit-notification ${type}`;
        notification.innerHTML = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#1f2937'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-family: inherit;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    initRealTimeUpdates() {
        // Poll for updates from admin (simplified version)
        setInterval(() => {
            this.checkForUpdates();
        }, 30000); // Check every 30 seconds
    }

    async checkForUpdates() {
        // In a real implementation, this would check your server for status updates
        const walletId = this.getFromLocalStorage('temp_wallet_id');
        if (walletId) {
            // Simulate status check
            console.log('Checking status for:', walletId);
        }
    }
}

// Transaction Management
class UgaritTransactionManager {
    constructor() {
        this.transactions = this.getFromLocalStorage('transactions') || [];
    }

    async requestDeposit(amount, currency = 'USD') {
        const transaction = {
            id: 'TX_' + Date.now(),
            type: 'deposit',
            amount: amount,
            currency: currency,
            status: 'pending',
            timestamp: new Date().toISOString(),
            sessionId: localStorage.getItem('ugarit_session_id')
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage('transactions', this.transactions);

        // Send to Telegram bot
        await window.ugaritBot.sendToAdmin({
            type: 'DEPOSIT_REQUEST',
            ...transaction
        });

        return transaction;
    }

    async requestWithdrawal(amount, currency = 'USD') {
        const transaction = {
            id: 'TX_' + Date.now(),
            type: 'withdrawal',
            amount: amount,
            currency: currency,
            status: 'pending',
            timestamp: new Date().toISOString(),
            sessionId: localStorage.getItem('ugarit_session_id')
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage('transactions', this.transactions);

        // Send to Telegram bot
        await window.ugaritBot.sendToAdmin({
            type: 'WITHDRAWAL_REQUEST',
            ...transaction
        });

        return transaction;
    }

    getTransactionHistory() {
        return this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(`ugarit_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage not available');
        }
    }

    getFromLocalStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(`ugarit_${key}`));
        } catch (error) {
            return null;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.ugaritBot = new UgaritTelegramBot();
    window.ugaritTransactions = new UgaritTransactionManager();

    console.log('Ugarit Financial System Initialized');
});