// Wallet Creation System with JSON Storage
class WalletCreationSystem {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            personalInfo: {},
            documents: {},
            submittedAt: null
        };
        this.init();
    }

    init() {
        this.initStepNavigation();
        this.initFileUploads();
        this.initFormSubmission();
        this.updateStepDisplay();
    }

    initStepNavigation() {
        // Next step buttons
        document.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        });

        // Previous step buttons
        document.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', () => {
                this.goToStep(this.currentStep - 1);
            });
        });
    }

    initFileUploads() {
        // ID Front upload
        this.initFileUpload('idFrontUpload', 'idFront', 'idFront');

        // ID Back upload
        this.initFileUpload('idBackUpload', 'idBack', 'idBack');

        // Selfie upload
        this.initFileUpload('selfieUpload', 'selfieWithId', 'selfie');
    }

    initFileUpload(uploadAreaId, fileInputId, documentType) {
        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(fileInputId);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    this.handleFileSelect(file, documentType, placeholder, preview, fileInput);
                } else {
                    this.showError('Please select a valid image file.');
                }
            }
        });

        // Drag and drop support
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileSelect(file, documentType, placeholder, preview, fileInput);
            } else {
                this.showError('Please drop a valid image file.');
            }
        });
    }

    handleFileSelect(file, documentType, placeholder, preview, fileInput) {
        const reader = new FileReader();

        reader.onload = (e) => {
            // Store file data (in real system, this would be uploaded to server)
            this.formData.documents[documentType] = {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                // In production, you would upload to server and store URL
                // For demo, we store the file object
                file: file
            };

            // Update UI
            placeholder.style.display = 'none';
            preview.style.display = 'block';
            preview.innerHTML = `
                <div class="file-preview">
                    <span class="file-icon">📄</span>
                    <div class="file-info">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button type="button" class="remove-file" onclick="walletCreation.removeFile('${documentType}')">×</button>
                </div>
            `;

            // Update file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        };

        reader.readAsDataURL(file);
    }

    removeFile(documentType) {
        const uploadArea = document.getElementById(documentType + 'Upload');
        const fileInput = document.getElementById(documentType === 'selfie' ? 'selfieWithId' : documentType);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');

        delete this.formData.documents[documentType];
        placeholder.style.display = 'flex';
        preview.style.display = 'none';
        preview.innerHTML = '';
        fileInput.value = '';

        this.showSuccess('File removed successfully.');
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validatePersonalInfo();
            case 2:
                return this.validateDocuments();
            case 3:
                return this.validateReview();
            default:
                return false;
        }
    }

    validatePersonalInfo() {
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'idType', 'idNumber'];
        let isValid = true;

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                this.markFieldError(element, true);
                isValid = false;
            } else {
                this.markFieldError(element, false);
            }
        });

        // Email validation
        const email = document.getElementById('email').value;
        if (email && !this.isValidEmail(email)) {
            this.markFieldError(document.getElementById('email'), true);
            this.showError('Please enter a valid email address.');
            isValid = false;
        }

        if (!isValid) {
            this.showError('Please fill in all required fields correctly.');
        }

        return isValid;
    }

    validateDocuments() {
        const requiredDocuments = ['idFront', 'idBack', 'selfie'];
        let isValid = true;

        requiredDocuments.forEach(doc => {
            if (!this.formData.documents[doc]) {
                this.showError(`Please upload ${doc.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                isValid = false;
            }
        });

        return isValid;
    }

    validateReview() {
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            this.showError('You must agree to the Terms of Service and Privacy Policy.');
            return false;
        }
        return true;
    }

    goToStep(step) {
        if (step < 1 || step > 3) return;

        // Save current step data
        if (this.currentStep === 1) {
            this.savePersonalInfo();
        }

        // Update steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

        document.querySelectorAll('.step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');

        this.currentStep = step;

        // Update review if going to step 3
        if (step === 3) {
            this.updateReviewSummary();
        }

        // Scroll to top of form
        document.querySelector('.wallet-form-section').scrollIntoView({ behavior: 'smooth' });
    }

    savePersonalInfo() {
        this.formData.personalInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            idType: document.getElementById('idType').value,
            idNumber: document.getElementById('idNumber').value,
            submittedAt: new Date().toISOString()
        };
    }

    updateReviewSummary() {
        const reviewContent = document.getElementById('review-content');
        const { personalInfo } = this.formData;

        reviewContent.innerHTML = `
            <div class="review-section">
                <h5 data-i18n="wallet.personal_info">Personal Information</h5>
                <div class="review-item">
                    <span data-i18n="wallet.full_name">Full Name:</span>
                    <span>${personalInfo.fullName}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.email">Email:</span>
                    <span>${personalInfo.email}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.phone">Phone:</span>
                    <span>${personalInfo.phone}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.address">Address:</span>
                    <span>${personalInfo.address}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.id_type">ID Type:</span>
                    <span>${this.getIDTypeText(personalInfo.idType)}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.id_number">ID Number:</span>
                    <span>${personalInfo.idNumber}</span>
                </div>
            </div>
            <div class="review-section">
                <h5 data-i18n="wallet.documents">Documents</h5>
                <div class="review-item">
                    <span data-i18n="wallet.id_front">ID Front:</span>
                    <span>${this.formData.documents.idFront ? '✅ Uploaded' : '❌ Missing'}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.id_back">ID Back:</span>
                    <span>${this.formData.documents.idBack ? '✅ Uploaded' : '❌ Missing'}</span>
                </div>
                <div class="review-item">
                    <span data-i18n="wallet.selfie_with_id">Selfie with ID:</span>
                    <span>${this.formData.documents.selfie ? '✅ Uploaded' : '❌ Missing'}</span>
                </div>
            </div>
        `;
    }

    initFormSubmission() {
        const form = document.getElementById('walletRegistrationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication();
        });
    }

    async submitApplication() {
        if (!this.validateCurrentStep()) {
            return;
        }

        try {
            this.setLoadingState(true);

            // Generate application ID
            const applicationId = this.generateApplicationId();

            // Prepare application data
            const applicationData = {
                id: applicationId,
                ...this.formData,
                status: 'pending',
                submittedAt: new Date().toISOString(),
                ip: await this.getClientIP()
            };

            // Save to JSON storage (localStorage)
            this.saveApplication(applicationData);

            // Show success message
            this.showApplicationSuccess();

            // Log the application
            this.logApplication(applicationData);

        } catch (error) {
            console.error('Application submission failed:', error);
            this.showError('Failed to submit application. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    saveApplication(applicationData) {
        // Get existing applications
        const applications = JSON.parse(localStorage.getItem('ugarit_applications') || '[]');

        // Add new application
        applications.push(applicationData);

        // Save back to localStorage
        localStorage.setItem('ugarit_applications', JSON.stringify(applications));

        console.log('Application saved:', applicationData);
    }

    showApplicationSuccess() {
        // Hide form and show success message
        document.getElementById('walletRegistrationForm').style.display = 'none';
        document.getElementById('applicationSuccess').style.display = 'block';

        // Scroll to success message
        document.getElementById('applicationSuccess').scrollIntoView({ behavior: 'smooth' });
    }

    generateApplicationId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `APP-${timestamp.slice(-6)}-${random}`;
    }

    async getClientIP() {
        // In production, this would be handled server-side
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    logApplication(applicationData) {
        const logs = JSON.parse(localStorage.getItem('ugarit_application_logs') || '[]');
        logs.push({
            applicationId: applicationData.id,
            action: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            userEmail: applicationData.personalInfo.email
        });
        localStorage.setItem('ugarit_application_logs', JSON.stringify(logs));
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    markFieldError(element, hasError) {
        if (hasError) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    }

    getIDTypeText(idType) {
        const types = {
            'national_id': 'National ID',
            'passport': 'Passport',
            'drivers_license': 'Driver\'s License'
        };
        return types[idType] || idType;
    }

    setLoadingState(loading) {
        const submitBtn = document.querySelector('.submit-application');
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span data-i18n="wallet.submitting">Submitting...</span>';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span data-i18n="wallet.submit_application">Submit Application</span>';
            }
        }
    }

    showError(message) {
        // Create or show error message
        let errorDiv = document.getElementById('formError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'formError';
            errorDiv.className = 'error-message';
            document.querySelector('.wallet-form-section').insertBefore(errorDiv, document.getElementById('walletRegistrationForm'));
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message temporary';
        successDiv.textContent = message;

        document.querySelector('.wallet-form-section').insertBefore(successDiv, document.getElementById('walletRegistrationForm'));

        // Auto remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    updateStepDisplay() {
        // Initial step display update
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
}

// Initialize wallet creation system
const walletCreation = new WalletCreationSystem();