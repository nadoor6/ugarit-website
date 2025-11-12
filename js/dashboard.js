// Dashboard Functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.initCurrencyTabs();
        this.initQuickActions();
        this.initUserMenu();
        this.initModals();
        this.loadDashboardData();
    }

    initCurrencyTabs() {
        const currencyTabs = document.querySelectorAll('.currency-tab');

        currencyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                currencyTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Update balance based on currency
                this.updateBalanceDisplay(tab.dataset.currency);
            });
        });
    }

    updateBalanceDisplay(currency) {
        const balanceAmount = document.querySelector('.balance-amount');
        const equivalent = document.querySelector('.balance-equivalent');

        const balances = {
            'USD': { amount: '$2,450.00', equivalent: '≈ 30,625,000 SYP' },
            'SYP': { amount: '30,625,000 SYP', equivalent: '≈ $2,450.00' },
            'EUR': { amount: '€2,265.00', equivalent: '≈ $2,450.00' }
        };

        if (balances[currency]) {
            balanceAmount.textContent = balances[currency].amount;
            equivalent.textContent = balances[currency].equivalent;
        }
    }

    initQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');

        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'send':
                this.openSendMoneyModal();
                break;
            case 'request':
                this.showNotification('Request money feature coming soon!');
                break;
            case 'exchange':
                this.showNotification('Currency exchange feature coming soon!');
                break;
            case 'add':
                this.showNotification('Add money feature coming soon!');
                break;
        }
    }

    openSendMoneyModal() {
        const modal = document.getElementById('sendMoneyModal');
        modal.classList.add('active');

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    initUserMenu() {
        const userAvatar = document.querySelector('.user-avatar');
        const userDropdown = document.querySelector('.user-dropdown');

        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }
    }

    initModals() {
        // Close modal buttons
        const closeButtons = document.querySelectorAll('.modal-close, .cancel-btn');

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-overlay');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Send money form submission
        const sendMoneyForm = document.querySelector('.send-money-form');
        if (sendMoneyForm) {
            sendMoneyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processSendMoney(sendMoneyForm);
            });
        }
    }

    processSendMoney(form) {
        const formData = new FormData(form);
        const recipient = formData.get('recipient');
        const amount = formData.get('amount');
        const currency = form.querySelector('.currency-select').value;
        const description = formData.get('description');

        // Simulate API call
        this.showLoading('Processing transaction...');

        setTimeout(() => {
            this.hideLoading();
            this.showNotification(`Successfully sent ${currency} ${amount} to ${recipient}`);
            this.closeModal(document.getElementById('sendMoneyModal'));
            form.reset();

            // Refresh transactions (in real app, this would be an API call)
            this.addNewTransaction({
                type: 'sent',
                title: 'Money Sent',
                meta: `To: ${recipient}`,
                amount: `-${currency} ${amount}`,
                description: description
            });
        }, 2000);
    }

    addNewTransaction(transaction) {
            const transactionsList = document.querySelector('.transactions-list');

            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';

            const iconClass = transaction.type === 'sent' ? 'sent' : 'received';
            const amountClass = transaction.type === 'sent' ? 'negative' : 'positive';

            transactionItem.innerHTML = `
            <div class="transaction-icon ${iconClass}">${transaction.type === 'sent' ? '↑' : '↓'}</div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.title}</div>
                <div class="transaction-meta">${transaction.meta}</div>
                ${transaction.description ? `<div class="transaction-description">${transaction.description}</div>` : ''}
            </div>
            <div class="transaction-amount ${amountClass}">${transaction.amount}</div>
        `;

        // Add to top of list
        transactionsList.insertBefore(transactionItem, transactionsList.firstChild);
        
        // Limit to 5 transactions
        if (transactionsList.children.length > 5) {
            transactionsList.removeChild(transactionsList.lastChild);
        }
    }

    showLoading(message = 'Loading...') {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content glass-card">
                <div class="loading-animation">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Add styles if not already added
        if (!document.querySelector('#loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loading-styles';
            styles.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10001;
                }
                .loading-content {
                    padding: 2rem;
                    text-align: center;
                }
                .loading-content p {
                    margin-top: 1rem;
                    color: var(--secondary-text);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content glass-card">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10002;
                    animation: slideInRight 0.3s ease;
                }
                .notification-content {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    min-width: 300px;
                }
                .notification-message {
                    flex: 1;
                    color: var(--primary-text);
                }
                .notification-close {
                    background: transparent;
                    border: none;
                    color: var(--secondary-text);
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Add slideOut animation
        if (!document.querySelector('#notification-out-styles')) {
            const outStyles = document.createElement('style');
            outStyles.id = 'notification-out-styles';
            outStyles.textContent = `
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(outStyles);
        }
    }

    loadDashboardData() {
        // Simulate loading dashboard data
        this.showLoading('Loading your dashboard...');
        
        setTimeout(() => {
            this.hideLoading();
            // In a real app, this would update with actual data from API
            console.log('Dashboard data loaded');
        }, 1000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});