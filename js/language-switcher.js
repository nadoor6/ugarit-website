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
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading language file:', error);
        }
    }

    initFooterSwitcher() {
        const footerSwitcher = document.querySelector('.footer-language-switcher');
        if (footerSwitcher) {
            const buttons = footerSwitcher.querySelectorAll('.footer-lang-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchLanguage(e.target.dataset.lang);
                });
            });
            this.updateFooterSwitcher();
        }
    }

    async switchLanguage(lang) {
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
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;

        if (this.currentLang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
    }

    updateFooterSwitcher() {
        const footerButtons = document.querySelectorAll('.footer-lang-btn');
        footerButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    applyTranslations() {
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
        if (this.translations.site ? .title) {
            document.title = this.translations.site.title;
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.languageSwitcher = new LanguageSwitcher();
});