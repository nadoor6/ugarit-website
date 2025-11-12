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

    async switchLanguage(lang) {
        console.log('Switching to language:', lang);
        if (lang !== this.currentLang) {
            this.currentLang = lang;
            localStorage.setItem('ugarit-lang', lang);
            await this.loadLanguage();
            this.updatePageDirection();
            this.updateFooterSwitcher();
            this.applyTranslations();
        }
    }

    updatePageDirection() {
        const html = document.documentElement;
        html.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        html.lang = this.currentLang;

        if (this.currentLang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        console.log('Page direction updated:', html.dir);
    }

    updateFooterSwitcher() {
        const footerButtons = document.querySelectorAll('.footer-lang-btn');
        footerButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
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
                } else if (element.tagName === 'META') {
                    element.setAttribute('content', value);
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update page title
        if (this.translations.site && this.translations.site.title) {
            document.title = this.translations.site.title;
        }

        console.log('Translations applied successfully');
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
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