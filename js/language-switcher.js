class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('ugarit-lang') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadLanguage();
        this.createSwitcher();
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

    createSwitcher() {
        const switcherHTML = `
            <div class="language-switcher">
                <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                    EN
                </button>
                <button class="lang-btn ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar">
                    AR
                </button>
            </div>
        `;

        const header = document.querySelector('.header');
        const createWalletBtn = header.querySelector('.create-wallet-btn');

        if (createWalletBtn) {
            createWalletBtn.insertAdjacentHTML('afterend', switcherHTML);
        } else {
            header.insertAdjacentHTML('beforeend', switcherHTML);
        }

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });
    }

    async switchLanguage(lang) {
        if (lang !== this.currentLang) {
            this.currentLang = lang;
            localStorage.setItem('ugarit-lang', lang);
            await this.loadLanguage();
            this.updatePageDirection();
            this.updateActiveSwitcher();
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

    updateActiveSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
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