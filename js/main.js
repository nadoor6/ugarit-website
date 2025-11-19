// Enhanced Ugarit Website JavaScript with Bilingual Support

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ugarit website initializing...');

    // Initialize all enhanced features
    initPageLoader();
    initAdvancedCursor();
    initScrollProgress();
    initMonochromeAnimations();
    initInteractiveElements();
    initMobileMenu();
    initPerformanceOptimizations();
    initPageTransitions();
    initScrollAnimations();
    initParallax();

    // Force content visibility
    forceContentVisibility();

    // Initialize authentication (if auth.js is loaded)
    if (typeof authManager !== 'undefined') {
        console.log('Authentication system initialized');
    }
});


// Enhanced Ugarit Website JavaScript with Bilingual Support

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ugarit website initializing...');

    // Initialize all enhanced features
    initPageLoader();
    initAdvancedCursor();
    initScrollProgress();
    initMonochromeAnimations();
    initInteractiveElements();
    initMobileMenu();
    initPerformanceOptimizations();
    initPageTransitions();
    initScrollAnimations();
    initParallax();

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
    const mobileLinks = document.querySelectorAll('.mobile-nav a, .mobile-signin-btn');

    if (menuBtn && mobileMenu) {
        // Toggle menu on button click
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
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
            if (mobileMenu.classList.contains('active') &&
                !menuBtn.contains(e.target) &&
                !mobileMenu.contains(e.target)) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.log('Mobile menu elements not found');
    }
}

function initInteractiveElements() {
    // Add hover effects to buttons, but exclude about page CTA
    const monochromeButtons = document.querySelectorAll('.product-cta, .create-wallet-btn');
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

// Sign In Modal Functions - Available on all pages
function showSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside the content
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSignInModal();
            }
        });
    }

    // Handle sign in form submission
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your sign in logic here
            console.log('Sign in form submitted');
            // For now, just close the modal
            closeSignInModal();
        });
    }

    // Handle escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSignInModal();
        }
    });
});