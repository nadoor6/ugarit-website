// Monochrome Ugarit Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize monochrome animations
    initMonochromeAnimations();

    // Initialize form handling
    initFormHandling();

    // Initialize interactive elements
    initInteractiveElements();

    // Initialize performance optimizations
    initPerformanceOptimizations();
});

function initMonochromeAnimations() {
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.98)';
                header.style.backdropFilter = 'blur(30px)';

                if (window.scrollY > lastScrollY) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
        });
    }

    // Monochrome card hover effects
    const monochromeCards = document.querySelectorAll('.monochrome-card, .product-card, .service-card');
    monochromeCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Add subtle shine effect
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            shine.style.left = `${x}px`;
            shine.style.top = `${y}px`;
            card.appendChild(shine);

            setTimeout(() => {
                if (card.contains(shine)) {
                    card.removeChild(shine);
                }
            }, 500);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Scroll animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all monochrome elements
    document.querySelectorAll('.product-card, .service-card, .pillar-card, .monochrome-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}

function initFormHandling() {
    const walletForm = document.querySelector('.wallet-form');
    if (walletForm) {
        walletForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Enhanced validation
            if (!validateForm(data)) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Simulate loading state
            const submitBtn = this.querySelector('.monochrome-cta');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your interest in Ugarit! Our admin will contact you on Telegram within 24 hours to complete your wallet setup.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 2000);
        });

        // Add real-time validation
        const inputs = walletForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateForm(data) {
    const required = ['fullName', 'phone', 'email', 'city', 'plan'];
    return required.every(field => data[field] && data[field].trim());
}

function validateField(field) {
    const value = field.value.trim();

    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);

    field.style.borderColor = '#dc2626';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    `;

    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.monochrome-notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `monochrome-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#dc2626' : '#ffffff'};
        color: ${type === 'error' ? 'white' : 'black'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Helvetica Neue', sans-serif;
        font-weight: 400;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function initInteractiveElements() {
    // Add hover effects to buttons
    const monochromeButtons = document.querySelectorAll('.monochrome-cta, .product-cta, .create-wallet-btn');
    monochromeButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for background elements
    if (window.innerWidth >= 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const monochromeGlows = document.querySelectorAll('.monochrome-glow');

            monochromeGlows.forEach((glow, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                glow.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

function initPerformanceOptimizations() {
    // Lazy loading for future images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll-based logic here
        }, 100);
    });
}