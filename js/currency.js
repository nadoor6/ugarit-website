// Ugar Currency JavaScript
class UgarCurrency {
    constructor() {
        this.basketItems = [];
        this.currentRates = {};
        this.init();
    }

    async init() {
        await this.loadBasketData();
        await this.loadCurrentRates();
        this.setupConverter();
        this.setupEventListeners();
        console.log('Ugar Currency system initialized');
    }

    async loadBasketData() {
        // In real implementation, this would fetch from API
        this.basketItems = [{
                id: 1,
                name: "Rice",
                quantity: "1 kg",
                currentPrice: 2.50,
                weight: 0.25,
                icon: "🍚",
                description: "High-quality medium grain rice"
            },
            {
                id: 2,
                name: "Wheat Flour",
                quantity: "1 kg",
                currentPrice: 1.80,
                weight: 0.20,
                icon: "🌾",
                description: "Premium wheat flour for baking"
            },
            {
                id: 3,
                name: "Drinking Water",
                quantity: "1 liter",
                currentPrice: 0.50,
                weight: 0.15,
                icon: "💧",
                description: "Purified drinking water"
            },
            {
                id: 4,
                name: "Electricity",
                quantity: "1 kWh",
                currentPrice: 0.15,
                weight: 0.10,
                icon: "⚡",
                description: "Residential electricity"
            },
            {
                id: 5,
                name: "Fuel",
                quantity: "1 liter",
                currentPrice: 1.20,
                weight: 0.20,
                icon: "⛽",
                description: "Standard automotive fuel"
            },
            {
                id: 6,
                name: "Medical Pack",
                quantity: "Basic package",
                currentPrice: 1.25,
                weight: 0.10,
                icon: "💊",
                description: "Essential medical supplies"
            }
        ];
    }

    async loadCurrentRates() {
        // Simulate API call for current market rates
        this.currentRates = {
            lastUpdated: new Date().toISOString(),
            totalValue: this.calculateTotalValue(),
            items: this.basketItems.reduce((acc, item) => {
                acc[item.name] = item.currentPrice;
                return acc;
            }, {})
        };
    }

    calculateTotalValue() {
        return this.basketItems.reduce((total, item) => {
            return total + (item.currentPrice * item.weight);
        }, 0);
    }

    setupConverter() {
        const ugrInput = document.getElementById('ugrAmount');
        const goodsOutput = document.getElementById('goodsValue');

        if (ugrInput && goodsOutput) {
            ugrInput.addEventListener('input', (e) => {
                const ugrAmount = parseFloat(e.target.value) || 0;
                this.updateConversion(ugrAmount);
            });

            ugrInput.addEventListener('change', (e) => {
                const ugrAmount = parseFloat(e.target.value) || 1;
                this.updateConversion(ugrAmount);
            });

            // Initial conversion
            this.updateConversion(1);
        }
    }

    updateConversion(ugrAmount) {
        const goodsOutput = document.getElementById('goodsValue');
        if (!goodsOutput) return;

        const totalValue = this.calculateTotalValue();
        const goodsValue = ugrAmount * totalValue;

        // Create a human-readable description of what UGR can buy
        const description = this.generateGoodsDescription(ugrAmount);
        goodsOutput.value = description;
    }

    generateGoodsDescription(ugrAmount) {
        const totalValue = this.calculateTotalValue() * ugrAmount;
        const descriptions = [];

        // Calculate how much of each item you can buy
        this.basketItems.forEach(item => {
            const amount = (totalValue * item.weight) / item.currentPrice;
            if (amount >= 0.1) { // Only show if significant amount
                let displayAmount = amount;
                let unit = item.quantity.split(' ')[1] || '';

                // Format the amount nicely
                if (amount >= 1000) {
                    displayAmount = (amount / 1000).toFixed(1);
                    unit = `thousand ${unit}`;
                } else if (amount >= 1) {
                    displayAmount = amount.toFixed(1);
                } else {
                    displayAmount = amount.toFixed(2);
                }

                descriptions.push(`${displayAmount} ${item.quantity} ${item.name}`);
            }
        });

        if (descriptions.length > 0) {
            return descriptions.slice(0, 3).join(' + ') + (descriptions.length > 3 ? ' + more' : '');
        }

        return 'Various essential goods';
    }

    setupEventListeners() {
        // Add any additional event listeners here
        console.log('Currency event listeners setup complete');
    }

    // Method to simulate value updates (for demo purposes)
    simulateMarketUpdate() {
        // Random small fluctuations in prices
        this.basketItems.forEach(item => {
            const fluctuation = (Math.random() - 0.5) * 0.1; // ±5%
            item.currentPrice = Math.max(0.1, item.currentPrice * (1 + fluctuation));
        });

        this.loadCurrentRates();
        this.updateConversion(parseFloat(document.getElementById('ugrAmount').value) || 1);

        console.log('Market prices updated', this.currentRates);
    }
}

// Additional utility functions
class UGRFinancialSystem {
    static calculateUGRInflation(lastYearBasket, currentBasket) {
        // UGR "inflation" is actually efficiency gains
        const lastValue = lastYearBasket.reduce((sum, item) => sum + item.value, 0);
        const currentValue = currentBasket.reduce((sum, item) => sum + item.value, 0);
        return ((currentValue - lastValue) / lastValue) * 100;
    }

    static projectUGRValue(years, efficiencyGain = 0.02) {
        // UGR value increases as production becomes more efficient
        return Math.pow(1 + efficiencyGain, years);
    }

    static convertToUGR(amount, localCurrency, exchangeRate) {
        return (amount * exchangeRate) / this.getUGRBaseValue();
    }

    static getUGRBaseValue() {
        // Returns the current base value of 1 UGR in a stable reference
        return 1; // Always 1 basic need unit
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.ugarCurrency = new UgarCurrency();

        // Demo: Simulate market updates every 30 seconds
        setInterval(() => {
            if (window.ugarCurrency) {
                window.ugarCurrency.simulateMarketUpdate();
            }
        }, 30000);
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UgarCurrency, UGRFinancialSystem };
}