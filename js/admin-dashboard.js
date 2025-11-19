// Admin Dashboard Management System
class AdminDashboard {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('ugarit_users')) || [];
        this.init();
    }

    init() {
        this.loadUsers();
        this.initForms();
        this.updateStats();
    }

    loadUsers() {
        this.updateUsersList();
        this.updateUserSelect();
    }

    updateStats() {
        document.getElementById('totalUsers').textContent = this.users.length;

        const totalBalance = this.users.reduce((sum, user) => sum + user.balance, 0);
        document.getElementById('totalBalance').textContent = `${totalBalance.toFixed(2)} SYP`;

        const activeUsers = this.users.filter(user => user.status === 'active').length;
        document.getElementById('activeUsers').textContent = activeUsers;
    }

    updateUsersList() {
        const container = document.getElementById('usersListContainer');

        if (this.users.length === 0) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }

        container.innerHTML = this.users.map(user => `
            <div class="user-item">
                <div>
                    <strong>${user.walletId}</strong><br>
                    <small>${user.userData.fullName}</small>
                </div>
                <div>${user.userData.phone}</div>
                <div><strong>${user.balance.toFixed(2)} SYP</strong></div>
                <div class="user-actions">
                    <button class="btn-sm" onclick="adminDashboard.viewUser('${user.walletId}')">View</button>
                    <button class="btn-sm" onclick="adminDashboard.deleteUser('${user.walletId}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateUserSelect() {
        const select = document.getElementById('userWalletId');
        select.innerHTML = '<option value="">Select a user...</option>' +
            this.users.map(user =>
                `<option value="${user.walletId}">${user.walletId} - ${user.userData.fullName}</option>`
            ).join('');
    }

    initForms() {
        // Create User Form
        document.getElementById('createUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });

        // Manage User Form
        document.getElementById('manageUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.manageUser();
        });

        // Show/hide form fields based on action type
        document.getElementById('actionType').addEventListener('change', (e) => {
            this.toggleActionFields(e.target.value);
        });
    }

    toggleActionFields(actionType) {
        const amountGroup = document.getElementById('amountGroup');
        const transactionTypeGroup = document.getElementById('transactionTypeGroup');
        const descriptionGroup = document.getElementById('descriptionGroup');

        if (actionType === 'updateBalance') {
            amountGroup.style.display = 'block';
            transactionTypeGroup.style.display = 'none';
            descriptionGroup.style.display = 'none';
        } else if (actionType === 'addTransaction') {
            amountGroup.style.display = 'block';
            transactionTypeGroup.style.display = 'block';
            descriptionGroup.style.display = 'block';
        } else {
            amountGroup.style.display = 'none';
            transactionTypeGroup.style.display = 'none';
            descriptionGroup.style.display = 'none';
        }
    }

    createUser() {
        const formData = {
            walletId: document.getElementById('newWalletId').value,
            password: document.getElementById('newPassword').value,
            fullName: document.getElementById('newFullName').value,
            phone: document.getElementById('newPhone').value,
            email: document.getElementById('newEmail').value,
            username: document.getElementById('newWalletId').value // Using walletId as username
        };

        // Check if walletId already exists
        if (this.users.find(user => user.walletId === formData.walletId)) {
            this.showMessage('createUserMessage', 'Error: Wallet ID already exists!', 'error');
            return;
        }

        const newUser = {
            walletId: formData.walletId,
            password: formData.password,
            userData: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                username: formData.username
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

        this.showMessage('createUserMessage', `✅ User ${formData.walletId} created successfully!`, 'success');
        this.resetForm('createUserForm');
        this.loadUsers();
        this.updateStats();
    }

    manageUser() {
        const walletId = document.getElementById('userWalletId').value;
        const actionType = document.getElementById('actionType').value;
        const user = this.users.find(u => u.walletId === walletId);

        if (!user) {
            this.showMessage('manageUserMessage', 'Error: User not found!', 'error');
            return;
        }

        switch (actionType) {
            case 'updateBalance':
                this.updateBalance(user);
                break;
            case 'addTransaction':
                this.addTransaction(user);
                break;
            case 'viewInfo':
                this.viewUserInfo(user);
                break;
        }
    }

    updateBalance(user) {
        const newBalance = parseFloat(document.getElementById('transactionAmount').value);

        if (isNaN(newBalance)) {
            this.showMessage('manageUserMessage', 'Error: Please enter a valid amount!', 'error');
            return;
        }

        user.balance = newBalance;
        this.saveUsers();

        this.showMessage('manageUserMessage', `✅ Balance updated to ${newBalance.toFixed(2)} SYP for ${user.walletId}`, 'success');
        this.loadUsers();
        this.updateStats();
    }

    addTransaction(user) {
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const type = document.getElementById('transactionType').value;
        const description = document.getElementById('transactionDescription').value;

        if (isNaN(amount) || amount <= 0) {
            this.showMessage('manageUserMessage', 'Error: Please enter a valid amount!', 'error');
            return;
        }

        const transaction = {
            id: Date.now().toString(),
            type: type,
            amount: amount,
            status: 'completed',
            description: description || `${type} transaction`,
            timestamp: new Date().toISOString(),
            adminNotes: 'Added via admin dashboard'
        };

        user.transactions.unshift(transaction);

        // Update balance based on transaction type
        if (type === 'deposit') {
            user.balance += amount;
        } else if (type === 'withdrawal') {
            user.balance -= amount;
        }

        this.saveUsers();

        this.showMessage('manageUserMessage', `✅ ${type} of ${amount} SYP added for ${user.walletId}`, 'success');
        this.resetForm('manageUserForm');
        this.loadUsers();
        this.updateStats();
    }

    viewUserInfo(user) {
        const info = `
Wallet ID: ${user.walletId}
Name: ${user.userData.fullName}
Phone: ${user.userData.phone}
Email: ${user.userData.email}
Balance: ${user.balance} SYP
Status: ${user.status}
Created: ${new Date(user.createdAt).toLocaleDateString()}
Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
Transactions: ${user.transactions.length}
        `;
        alert(info);
    }

    viewUser(walletId) {
        const user = this.users.find(u => u.walletId === walletId);
        if (user) {
            this.viewUserInfo(user);
        }
    }

    deleteUser(walletId) {
        if (confirm(`Are you sure you want to delete user ${walletId}? This action cannot be undone.`)) {
            this.users = this.users.filter(user => user.walletId !== walletId);
            this.saveUsers();
            this.loadUsers();
            this.updateStats();
            this.showMessage('manageUserMessage', `✅ User ${walletId} deleted successfully`, 'success');
        }
    }

    saveUsers() {
        localStorage.setItem('ugarit_users', JSON.stringify(this.users));
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.color = type === 'error' ? '#ff4444' : '#4CAF50';
        element.style.display = 'block';

        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard();

// Admin logout function
function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}