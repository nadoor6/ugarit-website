class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('ugarit-lang') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadLanguage();
        this.initFooterSwitcher();
        this.updatePageDirection();
        this.applyTranslations();
        this.initLanguageChangeListeners();

        // Re-apply translations when modals open
        this.initModalListeners();
    }

    async loadLanguage() {
        try {
            const response = await fetch(`languages/${this.currentLang}.json`);
            if (!response.ok) {
                throw new Error('Language file not found');
            }
            this.translations = await response.json();
            console.log('Language loaded:', this.currentLang);
        } catch (error) {
            console.error('Error loading language file:', error);
            // Fallback to English if there's an error
            this.currentLang = 'en';
            await this.loadLanguage();
        }
    }

    initFooterSwitcher() {
        // Add event listeners to footer language buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('footer-lang-btn')) {
                const lang = e.target.getAttribute('data-lang');
                if (lang) {
                    this.switchLanguage(lang);
                }
            }
        });

        // Update the active state of buttons
        this.updateFooterSwitcher();
    }

    initLanguageChangeListeners() {
        // Re-apply translations when modal opens (if needed)
        document.addEventListener('modalOpened', () => {
            setTimeout(() => this.applyTranslations(), 100);
        });
    }

    initModalListeners() {
        // Watch for modal openings and update translations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (node.classList.contains('modal') || node.querySelector('.modal'))) {
                            setTimeout(() => this.applyTranslations(), 100);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async switchLanguage(lang) {
        console.log('Switching to language:', lang);
        if (lang !== this.currentLang) {
            this.currentLang = lang;
            localStorage.setItem('ugarit-lang', lang);
            await this.loadLanguage();
            this.updatePageDirection();
            this.updateFooterSwitcher();
            this.applyTranslations();

            // Show language change confirmation
            this.showLanguageChangeToast();
        }
    }

    updatePageDirection() {
        const html = document.documentElement;
        html.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        html.lang = this.currentLang;

        // Add/remove RTL class for CSS
        if (this.currentLang === 'ar') {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // Force reflow to ensure RTL styles are applied
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';

        console.log('Page direction updated:', html.dir);
    }

    updateFooterSwitcher() {
        const footerButtons = document.querySelectorAll('.footer-lang-btn');
        footerButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
                btn.style.fontWeight = 'bold';
            } else {
                btn.classList.remove('active');
                btn.style.fontWeight = 'normal';
            }
        });
    }

    applyTranslations() {
        console.log('Applying translations...');

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedValue(this.translations, key);

            if (value !== undefined) {
                if (element.hasAttribute('data-i18n-html')) {
                    element.innerHTML = value;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else if (element.tagName === 'SELECT') {
                    // For select options, we need to handle them specially
                    this.translateSelectOptions(element);
                } else if (element.tagName === 'META') {
                    element.setAttribute('content', value);
                } else {
                    element.textContent = value;
                }
            } else {
                console.warn('Translation key not found:', key);
            }
        });

        // Update page title and meta description
        if (this.translations.site) {
            if (this.translations.site.title) {
                document.title = this.translations.site.title;
            }
            // Update meta description if exists
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && this.translations.site.description) {
                metaDescription.setAttribute('content', this.translations.site.description);
            }
        }

        console.log('Translations applied successfully');
    }

    translateSelectOptions(selectElement) {
        // Translate select options that have data-i18n attributes
        const options = selectElement.querySelectorAll('option[data-i18n]');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            const value = this.getNestedValue(this.translations, key);
            if (value !== undefined) {
                option.textContent = value;
            }
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    showLanguageChangeToast() {
        // Remove existing toast if any
        const existingToast = document.querySelector('.language-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'language-toast';
        toast.textContent = this.currentLang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: inherit;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageSwitcher = new LanguageSwitcher();
    });
} else {
    window.languageSwitcher = new LanguageSwitcher();
}