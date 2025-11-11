// Enhanced Ugarit Website JavaScript with Critical Fixes



document.addEventListener('DOMContentLoaded', function() {

    console.log('Ugarit website initializing...');



    // Initialize all enhanced features

    initPageLoader();

    initAdvancedCursor();

    initScrollProgress();

    initMonochromeAnimations();

    initFormHandling();

    initInteractiveElements();

    initMobileMenu();

    initPerformanceOptimizations();

    initPageTransitions();

    initScrollAnimations();

    initParallax();

    initRealTimeFormValidation();



    // Force content visibility

    forceContentVisibility();

});



function forceContentVisibility() {

    // Ensure all content elements are visible

    const contentElements = document.querySelectorAll('.main-content, .hero-section, .content-section, .about-content, .products-content, .services-content, .wallet-creation-content');



    contentElements.forEach(element => {

        if (element) {

            element.style.opacity = '1';

            element.style.visibility = 'visible';

            element.style.display = 'block';

        }

    });



    // Force body to be visible

    document.body.style.opacity = '1';

    document.body.style.visibility = 'visible';

}



function initPageLoader() {

    const loader = document.querySelector('.page-loader');

    if (loader) {

        // Show content immediately, then hide loader

        setTimeout(() => {

            loader.classList.add('hidden');

            document.body.style.opacity = '1';

            document.body.style.overflow = 'visible';



            // Force all content to be visible

            forceContentVisibility();

        }, 1000);

    } else {

        // If no loader, ensure content is visible

        document.body.style.opacity = '1';

        forceContentVisibility();

    }

}



function initAdvancedCursor() {

    if (window.innerWidth < 768) return;



    const cursor = document.querySelector('.advanced-cursor');

    const follower = document.querySelector('.cursor-follower');



    if (!cursor || !follower) return;



    let mouseX = 0,

        mouseY = 0;

    let followerX = 0,

        followerY = 0;



    document.addEventListener('mousemove', (e) => {

        mouseX = e.clientX;

        mouseY = e.clientY;

    });



    function animate() {

        // Main cursor

        cursor.style.left = `${mouseX - 4}px`;

        cursor.style.top = `${mouseY - 4}px`;



        // Follower with delay

        followerX += (mouseX - followerX) * 0.1;

        followerY += (mouseY - followerY) * 0.1;

        follower.style.left = `${followerX - 12}px`;

        follower.style.top = `${followerY - 12}px`;



        requestAnimationFrame(animate);

    }

    animate();



    // Interactive elements effect

    const interactiveElements = document.querySelectorAll('a, button, .monochrome-card, .product-card, .service-card, .pillar-card');



    interactiveElements.forEach(el => {

        el.addEventListener('mouseenter', () => {

            cursor.style.transform = 'scale(1.5)';

            follower.style.transform = 'scale(1.2)';

        });



        el.addEventListener('mouseleave', () => {

            cursor.style.transform = 'scale(1)';

            follower.style.transform = 'scale(1)';

        });

    });

}



function initScrollProgress() {

    const progressBar = document.querySelector('.scroll-progress');

    if (!progressBar) return;



    window.addEventListener('scroll', () => {

        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;

        const scrolled = (window.scrollY / windowHeight) * 100;

        progressBar.style.width = `${scrolled}%`;

    });

}



function initScrollAnimations() {

    const observerOptions = {

        threshold: 0.1,

        rootMargin: '0px 0px -50px 0px'

    };



    const fadeObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.animationPlayState = 'running';

                entry.target.style.opacity = '1';

                entry.target.style.visibility = 'visible';

            }

        });

    }, observerOptions);



    // Observe all animated elements

    document.querySelectorAll('.reveal-text, .card-hover-lift').forEach(el => {

        el.style.animationPlayState = 'paused';

        fadeObserver.observe(el);

    });

}



function initParallax() {

    const parallaxElements = document.querySelectorAll('.parallax');



    window.addEventListener('scroll', () => {

        const scrolled = window.pageYOffset;



        parallaxElements.forEach(el => {

            const speed = el.dataset.speed || 0.5;

            const yPos = -(scrolled * speed);

            el.style.transform = `translateY(${yPos}px)`;

        });

    });

}



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

        });



        card.addEventListener('mouseleave', () => {

            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        });

    });

}



function initMobileMenu() {

    const menuBtn = document.querySelector('.mobile-menu-btn');

    const mobileMenu = document.querySelector('.mobile-menu');

    const mobileLinks = document.querySelectorAll('.mobile-nav a');



    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener('click', () => {

            menuBtn.classList.toggle('active');

            mobileMenu.classList.toggle('active');

            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

        });



        // Close menu when clicking links

        mobileLinks.forEach(link => {

            link.addEventListener('click', () => {

                menuBtn.classList.remove('active');

                mobileMenu.classList.remove('active');

                document.body.style.overflow = '';

            });

        });



        // Close menu when clicking outside

        document.addEventListener('click', (e) => {

            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {

                menuBtn.classList.remove('active');

                mobileMenu.classList.remove('active');

                document.body.style.overflow = '';

            }

        });

    }

}



function initRealTimeFormValidation() {

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {

        const inputs = form.querySelectorAll('input, select, textarea');



        inputs.forEach(input => {

            input.addEventListener('input', function() {

                validateField(this);

            });



            input.addEventListener('blur', function() {

                validateField(this);

            });

        });

    });

}



function validateField(field) {

    const value = field.value.trim();

    const fieldName = field.name || field.id;



    // Clear previous errors

    clearFieldError(field);



    // Required field validation

    if (field.required && !value) {

        showFieldError(field, 'This field is required');

        return false;

    }



    // Email validation

    if (field.type === 'email' && value) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {

            showFieldError(field, 'Please enter a valid email address');

            return false;

        }

    }



    // Phone validation (Syrian format)

    if (field.type === 'tel' && value) {

        const phoneRegex = /^\+963[0-9]{9}$/;

        if (!phoneRegex.test(value.replace(/\s/g, ''))) {

            showFieldError(field, 'Please enter a valid Syrian phone number (+963 XXX XXX XXX)');

            return false;

        }

    }



    return true;

}



function initFormHandling() {

    const walletForm = document.querySelector('.wallet-form');

    if (walletForm) {

        walletForm.addEventListener('submit', async function(e) {

            e.preventDefault();



            // Validate all fields

            const inputs = this.querySelectorAll('input, select');

            let isValid = true;



            inputs.forEach(input => {

                if (!validateField(input)) {

                    isValid = false;

                }

            });



            if (!isValid) {

                showNotification('Please fill in all required fields correctly.', 'error');

                return;

            }



            // Get form data

            const formData = new FormData(this);

            const data = Object.fromEntries(formData);



            // Enhanced loading state

            const submitBtn = this.querySelector('.monochrome-cta');

            const originalText = submitBtn.textContent;



            submitBtn.textContent = 'Processing...';

            submitBtn.disabled = true;

            submitBtn.style.opacity = '0.7';



            try {

                // Simulate API call to backend

                const response = await simulateBackendSubmission(data);



                if (response.success) {

                    showNotification('Thank you for your interest in Ugarit! Our admin will contact you on Telegram within 24 hours to complete your wallet setup.', 'success');



                    // Generate wallet ID for user

                    const walletId = generateWalletId();

                    showNotification(`Your temporary wallet ID: ${walletId} - Save this for reference!`, 'info');



                    this.reset();



                    // Reset form labels

                    const labels = this.querySelectorAll('label');

                    labels.forEach(label => {

                        label.style.top = '1rem';

                        label.style.fontSize = '0.8rem';

                    });

                } else {

                    throw new Error('Submission failed');

                }

            } catch (error) {

                showNotification('There was an error processing your request. Please contact @UgaritAdmin directly on Telegram.', 'error');

            } finally {

                submitBtn.textContent = originalText;

                submitBtn.disabled = false;

                submitBtn.style.opacity = '1';

            }

        });



        // Real-time phone formatting

        const phoneInput = walletForm.querySelector('input[type="tel"]');

        if (phoneInput) {

            phoneInput.addEventListener('input', function(e) {

                let value = e.target.value.replace(/\D/g, '');

                if (value.startsWith('963')) {

                    value = '+' + value;

                }

                if (value.length > 0) {

                    value = value.match(/.{1,3}/g).join(' ');

                }

                e.target.value = value;

            });

        }

    }

}



// Simulate backend submission

async function simulateBackendSubmission(data) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // In real implementation, this would be a fetch() to your backend

            console.log('Form data submitted:', data);

            resolve({

                success: true,

                message: 'Submission successful',

                timestamp: new Date().toISOString()

            });

        }, 2000);

    });

}



// Generate unique wallet ID

function generateWalletId() {

    const timestamp = Date.now().toString(36);

    const random = Math.random().toString(36).substr(2, 5);

    return `UG${timestamp}${random}`.toUpperCase();

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

        background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#ffffff'};

        color: ${type === 'error' || type === 'success' ? 'white' : 'black'};

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

}



function initPerformanceOptimizations() {

    // Lazy loading with intersection observer

    const lazyImages = document.querySelectorAll('img[data-src]');

    const lazyBackgrounds = document.querySelectorAll('[data-bg]');



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



        const backgroundObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const element = entry.target;

                    element.style.backgroundImage = `url(${element.dataset.bg})`;

                    backgroundObserver.unobserve(element);

                }

            });

        });



        lazyImages.forEach(img => imageObserver.observe(img));

        lazyBackgrounds.forEach(bg => backgroundObserver.observe(bg));

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



function initPageTransitions() {

    const links = document.querySelectorAll('a[href^="/"], a[href^="."]');



    links.forEach(link => {

        link.addEventListener('click', (e) => {

            if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {

                e.preventDefault();

                const href = link.getAttribute('href');



                // Add page transition

                document.body.style.opacity = '0';

                document.body.style.transition = 'opacity 0.3s ease';



                setTimeout(() => {

                    window.location.href = href;

                }, 300);

            }

        });

    });

}



// Initialize when page loads

window.addEventListener('load', () => {

    console.log('Ugarit website fully loaded with enhanced features');



    // Force content to be visible

    document.body.style.opacity = '1';

    forceContentVisibility();



    // Remove any hidden states

    document.querySelectorAll('*').forEach(el => {

        if (el.style.opacity === '0') {

            el.style.opacity = '1';

        }

        if (el.style.visibility === 'hidden') {

            el.style.visibility = 'visible';

        }

    });

});