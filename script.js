// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make all sections visible immediately
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'none';
        section.style.visibility = 'visible';
        section.style.display = 'block';
    });

    // Initialize theme first
    initializeTheme();
    
    // Initialize all features
    const app = {
        init() {
            try {
                // Initialize core components
                this.initializeCore();
                
                // Initialize feature modules
                this.initializeModules();
                
                // Start data fetching
                this.startDataFetching();
            } catch (error) {
                console.error('Error during initialization:', error);
                this.handleError(error);
            }
        },
        
        handleError(error) {
            console.error('Application error:', error);
            // Keep UI visible, just show error if needed
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            errorContainer.style.position = 'fixed';
            errorContainer.style.bottom = '20px';
            errorContainer.style.right = '20px';
            errorContainer.style.background = 'rgba(255, 0, 0, 0.8)';
            errorContainer.style.color = 'white';
            errorContainer.style.padding = '10px';
            errorContainer.style.borderRadius = '5px';
            errorContainer.textContent = 'An error occurred. Please refresh the page.';
            document.body.appendChild(errorContainer);
        },
        
        initializeCore() {
            // Initialize smooth scrolling
            this.initializeSmoothScroll();
            
            // Skip animations for now
            // this.initializeScrollAnimations();
            
            // Initialize navigation
            this.initializeNavigation();
        },
        
        initializeModules() {
            try {
                // Initialize all feature modules in proper order
                const modules = {
                    calculator,
                    cryptoChart,
                    portfolioTracker,
                    cryptoConverter,
                    watchlist,
                    priceAlerts,
                    miningCalculator,
                    cryptoHeatmap,
                    learnCrypto,
                    dcaCalculator,
                    trendingCoins,
                    pricePredictions
                };

                // Initialize each module if it exists
                Object.entries(modules).forEach(([name, module]) => {
                    if (module && typeof module.init === 'function') {
                        try {
                            module.init();
                        } catch (error) {
                            console.error(`Error initializing ${name}:`, error);
                        }
                    }
                });
            } catch (error) {
                console.error('Error in module initialization:', error);
            }
        },

        async startDataFetching() {
            try {
                // Fetch initial data
                await this.fetchInitialData();
                
                // Set up periodic updates
                this.setupPeriodicUpdates();
            } catch (error) {
                console.error('Error starting data fetching:', error);
            }
        },

        async fetchInitialData() {
            try {
                // Fetch data with timeout
                await Promise.race([
                    Promise.all([
                        cryptoChart?.updateChart?.(),
                        watchlist?.updatePrices?.(),
                        trendingCoins?.fetchTrending?.()
                    ].filter(Boolean)),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Initial data fetch timeout')), 10000)
                    )
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        },
        
        setupPeriodicUpdates() {
            // Update data periodically
            const updateData = () => {
                try {
                    cryptoChart?.updateChart?.();
                    watchlist?.updatePrices?.();
                    priceAlerts?.checkAlerts?.();
                } catch (error) {
                    console.error('Error in periodic update:', error);
                }
            };

            // Set up intervals
            setInterval(updateData, 60000); // Every minute
            setInterval(() => {
                try {
                    trendingCoins?.fetchTrending?.();
                } catch (error) {
                    console.error('Error updating trending coins:', error);
                }
            }, 900000); // Every 15 minutes
        }
    };

    // Start the application
    app.init();
});

// Theme Toggle
const themeToggle = {
    init() {
        this.button = document.getElementById('themeToggle');
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme based on system preference or stored preference
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.setAttribute('data-theme', storedTheme);
        } else {
            const theme = this.prefersDark.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        // Update button state
        this.updateButtonState();
        
        // Add event listeners
        this.button.addEventListener('click', () => this.toggleTheme());
        this.prefersDark.addEventListener('change', (e) => this.handleSystemThemeChange(e));
    },
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateButtonState();
        
        // Update chart if it exists
        if (window.cryptoChart && window.cryptoChart.chart) {
            window.cryptoChart.updateChartTheme();
        }
    },
    
    handleSystemThemeChange(e) {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            this.updateButtonState();
            
            // Update chart if it exists
            if (window.cryptoChart && window.cryptoChart.chart) {
                window.cryptoChart.updateChartTheme();
            }
        }
    },
    
    updateButtonState() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const sunIcon = this.button.querySelector('.fa-sun');
        const moonIcon = this.button.querySelector('.fa-moon');
        
        if (currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
};

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeToggle.init();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll animation for feature cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Add animation to CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseover', () => {
        ctaButton.style.transform = 'translateY(-2px)';
    });
    
    ctaButton.addEventListener('mouseout', () => {
        ctaButton.style.transform = 'translateY(0)';
    });
}

// Crypto Chart
const cryptoChart = {
    chart: null,
    elements: {
        chartCanvas: document.getElementById('cryptoChart'),
        currentPrice: document.getElementById('currentPrice'),
        priceChange: document.getElementById('priceChange'),
        lastUpdated: document.getElementById('lastUpdated'),
        coinButtons: document.querySelectorAll('.coin-btn'),
        timeButtons: document.querySelectorAll('.time-btn')
    },
    
    state: {
        currentCoin: 'bitcoin',
        currentDays: '1'
    },

    async fetchPriceData(coin, days) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`
            );
            const data = await response.json();
            return data.prices;
        } catch (error) {
            console.error('Error fetching price data:', error);
            return [];
        }
    },

    async fetchCurrentData(coin) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currency=usd`
            );
            const data = await response.json();
            return data[coin];
        } catch (error) {
            console.error('Error fetching current data:', error);
            return null;
        }
    },

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    },

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    },

    formatPriceChange(change) {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(change / 100);
        
        return change >= 0 ? `+${formatted}` : formatted;
    },

    updatePriceInfo(currentData) {
        if (!currentData) return;

        this.elements.currentPrice.textContent = this.formatPrice(currentData.usd);
        
        const change = currentData.usd_24h_change;
        this.elements.priceChange.textContent = this.formatPriceChange(change);
        this.elements.priceChange.className = change >= 0 ? 'positive' : 'negative';
        
        const lastUpdated = new Date(currentData.last_updated_at * 1000);
        this.elements.lastUpdated.textContent = lastUpdated.toLocaleString();
    },

    async initChart() {
        const ctx = document.getElementById('cryptoChart').getContext('2d');
        
        // Set default styles for the chart
        Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Price',
                    data: [],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'price'
                }, {
                    label: 'Volume',
                    data: [],
                    type: 'bar',
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() + '40',
                    borderColor: 'transparent',
                    yAxisID: 'volume'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim(),
                        titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM dd, yyyy HH:mm'
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0
                        }
                    },
                    price: {
                        position: 'left',
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() + '20'
                        },
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    },
                    volume: {
                        position: 'right',
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: value => {
                                if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
                                if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
                                if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
                                return value;
                            }
                        }
                    }
                }
            }
        });
        
        return chart;
    },

    createChart(prices) {
        const ctx = this.elements.chartCanvas.getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const labels = prices.map(price => new Date(price[0]).toLocaleString());
        const data = prices.map(price => price[1]);

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();

        this.chart = this.initChart();
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    },

    async updateChart() {
        const prices = await this.fetchPriceData(this.state.currentCoin, this.state.currentDays);
        const currentData = await this.fetchCurrentData(this.state.currentCoin);
        
        if (prices.length > 0) {
            this.createChart(prices);
        }
        
        this.updatePriceInfo(currentData);
    },

    updateChartTheme() {
        if (!this.chart) return;
        
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim();
        
        // Update chart defaults
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = borderColor;
        
        // Update datasets colors
        this.chart.data.datasets[0].borderColor = primaryColor;
        this.chart.data.datasets[1].backgroundColor = secondaryColor + '40';
        
        // Update tooltip styles
        this.chart.options.plugins.tooltip.backgroundColor = cardBg;
        this.chart.options.plugins.tooltip.titleColor = textColor;
        this.chart.options.plugins.tooltip.bodyColor = textColor;
        this.chart.options.plugins.tooltip.borderColor = borderColor;
        
        // Update grid colors
        this.chart.options.scales.price.grid.color = borderColor + '20';
        
        // Update the chart
        this.chart.update();
    },

    setupEventListeners() {
        // Coin selection
        this.elements.coinButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.coinButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.state.currentCoin = button.dataset.coin;
                this.updateChart();
            });
        });

        // Timeframe selection
        this.elements.timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.timeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.state.currentDays = button.dataset.days;
                this.updateChart();
            });
        });

        // Update chart when theme changes
        document.addEventListener('themeChanged', () => {
            this.updateChart();
        });
    },

    init() {
        if (!this.elements.chartCanvas) return;
        
        this.setupEventListeners();
        this.updateChart();

        // Auto-refresh every 5 minutes
        setInterval(() => this.updateChart(), 5 * 60 * 1000);
    }
};

// Initialize crypto chart
cryptoChart.init();

// Portfolio Tracker
const portfolioTracker = {
    elements: {
        coinSelect: document.getElementById('coinSelect'),
        assetAmount: document.getElementById('assetAmount'),
        assetPrice: document.getElementById('assetPrice'),
        addAssetBtn: document.getElementById('addAsset'),
        assetsList: document.getElementById('assetsList'),
        portfolioTotal: document.getElementById('portfolioTotal')
    },

    portfolio: [],

    async init() {
        if (!this.elements.addAssetBtn) return;

        // Load portfolio from localStorage
        this.loadPortfolio();

        // Add event listeners
        this.elements.addAssetBtn.addEventListener('click', () => this.addAsset());
        
        // Initial update
        await this.updatePortfolioValues();
        
        // Update portfolio values every minute
        setInterval(() => this.updatePortfolioValues(), 60000);
    },

    loadPortfolio() {
        const savedPortfolio = localStorage.getItem('cryptoPortfolio');
        if (savedPortfolio) {
            this.portfolio = JSON.parse(savedPortfolio);
            this.renderPortfolio();
        }
        this.updateEmptyState();
    },

    savePortfolio() {
        localStorage.setItem('cryptoPortfolio', JSON.stringify(this.portfolio));
        this.updateEmptyState();
    },

    async getCurrentPrice(coinId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currency=usd`
            );
            const data = await response.json();
            return data[coinId].usd;
        } catch (error) {
            console.error('Error fetching price:', error);
            return null;
        }
    },

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    },

    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    },

    async addAsset() {
        const coinId = this.elements.coinSelect.value;
        const amount = parseFloat(this.elements.assetAmount.value);
        const purchasePrice = parseFloat(this.elements.assetPrice.value);

        if (!coinId || !amount || !purchasePrice) {
            alert('Please fill in all fields');
            return;
        }

        const currentPrice = await this.getCurrentPrice(coinId);
        if (!currentPrice) {
            alert('Error fetching current price. Please try again.');
            return;
        }

        const asset = {
            id: Date.now(),
            coinId,
            coinName: this.elements.coinSelect.options[this.elements.coinSelect.selectedIndex].text,
            amount,
            purchasePrice,
            currentPrice
        };

        this.portfolio.push(asset);
        this.savePortfolio();
        this.renderPortfolio();

        // Reset form
        this.elements.coinSelect.value = '';
        this.elements.assetAmount.value = '';
        this.elements.assetPrice.value = '';
    },

    removeAsset(id) {
        this.portfolio = this.portfolio.filter(asset => asset.id !== id);
        this.savePortfolio();
        this.renderPortfolio();
    },

    async updatePortfolioValues() {
        for (let asset of this.portfolio) {
            asset.currentPrice = await this.getCurrentPrice(asset.coinId) || asset.currentPrice;
        }
        this.savePortfolio();
        this.renderPortfolio();
    },

    calculateAssetMetrics(asset) {
        const initialValue = asset.amount * asset.purchasePrice;
        const currentValue = asset.amount * asset.currentPrice;
        const profitLoss = currentValue - initialValue;
        const profitLossPercentage = (profitLoss / initialValue) * 100;

        return {
            currentValue,
            profitLoss,
            profitLossPercentage
        };
    },

    renderPortfolio() {
        if (!this.elements.assetsList) return;

        let totalValue = 0;
        this.elements.assetsList.innerHTML = '';

        this.portfolio.forEach(asset => {
            const { currentValue, profitLoss, profitLossPercentage } = this.calculateAssetMetrics(asset);
            totalValue += currentValue;

            const assetElement = document.createElement('div');
            assetElement.className = 'asset-item';
            assetElement.innerHTML = `
                <span class="asset-name">${asset.coinName}</span>
                <span class="asset-amount">${asset.amount}</span>
                <span class="asset-value">${this.formatCurrency(currentValue)}</span>
                <span class="asset-pl ${profitLoss >= 0 ? 'positive' : 'negative'}">
                    ${this.formatCurrency(profitLoss)}
                    (${this.formatPercentage(profitLossPercentage)})
                </span>
                <button class="remove-btn" onclick="portfolioTracker.removeAsset(${asset.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            this.elements.assetsList.appendChild(assetElement);
        });

        this.elements.portfolioTotal.textContent = this.formatCurrency(totalValue);
    }
};

// Initialize portfolio tracker
portfolioTracker.init();

// Crypto Converter
const cryptoConverter = {
    elements: {
        fromAmount: document.getElementById('fromAmount'),
        toAmount: document.getElementById('toAmount'),
        fromCurrency: document.getElementById('fromCurrency'),
        toCurrency: document.getElementById('toCurrency'),
        swapButton: document.getElementById('swapCurrencies'),
        exchangeRate: document.getElementById('exchangeRate'),
        fromCurrencyLabel: document.getElementById('fromCurrencyLabel'),
        toCurrencyLabel: document.getElementById('toCurrencyLabel'),
        lastUpdated: document.getElementById('lastUpdated')
    },

    rates: {},
    updateInterval: null,

    async init() {
        if (!this.elements.fromAmount) return;

        // Add event listeners
        this.elements.fromAmount.addEventListener('input', () => this.convert());
        this.elements.fromCurrency.addEventListener('change', () => this.updateConversion());
        this.elements.toCurrency.addEventListener('change', () => this.updateConversion());
        this.elements.swapButton.addEventListener('click', () => this.swapCurrencies());

        // Initial conversion
        await this.updateRates();
        
        // Update rates every minute
        this.updateInterval = setInterval(() => this.updateRates(), 60000);
    },

    async updateRates() {
        try {
            const currencies = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'];
            const vsCurrencies = ['usd', 'eur', 'gbp'];
            
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${currencies.join(',')}&vs_currencies=${vsCurrencies.join(',')}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch rates');
            
            this.rates = await response.json();
            this.updateConversion();
            
            // Update last updated time
            const now = new Date();
            this.elements.lastUpdated.textContent = now.toLocaleTimeString();
        } catch (error) {
            console.error('Error fetching rates:', error);
            this.elements.exchangeRate.textContent = 'Error fetching rates';
        }
    },

    getRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;

        // If converting between cryptocurrencies
        if (this.rates[fromCurrency] && this.rates[toCurrency]) {
            return this.rates[fromCurrency].usd / this.rates[toCurrency].usd;
        }

        // If converting from crypto to fiat
        if (this.rates[fromCurrency] && this.rates[fromCurrency][toCurrency]) {
            return this.rates[fromCurrency][toCurrency];
        }

        // If converting from fiat to crypto
        if (this.rates[toCurrency] && this.rates[toCurrency][fromCurrency]) {
            return 1 / this.rates[toCurrency][fromCurrency];
        }

        return null;
    },

    formatNumber(number) {
        if (number >= 1) {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
            });
        }
    },

    updateConversion() {
        const fromCurrency = this.elements.fromCurrency.value;
        const toCurrency = this.elements.toCurrency.value;
        
        // Update currency labels
        this.elements.fromCurrencyLabel.textContent = 
            this.elements.fromCurrency.options[this.elements.fromCurrency.selectedIndex].text.split(' ')[1];
        this.elements.toCurrencyLabel.textContent = 
            this.elements.toCurrency.options[this.elements.toCurrency.selectedIndex].text.split(' ')[1];

        // Update rate display
        const rate = this.getRate(fromCurrency, toCurrency);
        if (rate !== null) {
            this.elements.exchangeRate.textContent = this.formatNumber(rate);
            this.convert();
        } else {
            this.elements.exchangeRate.textContent = 'Rate not available';
            this.elements.toAmount.value = '';
        }
    },

    convert() {
        const fromCurrency = this.elements.fromCurrency.value;
        const toCurrency = this.elements.toCurrency.value;
        const amount = parseFloat(this.elements.fromAmount.value);

        if (!amount) {
            this.elements.toAmount.value = '';
            return;
        }

        const rate = this.getRate(fromCurrency, toCurrency);
        if (rate !== null) {
            const result = amount * rate;
            this.elements.toAmount.value = this.formatNumber(result);
        }
    },

    swapCurrencies() {
        // Get current values
        const fromCurrency = this.elements.fromCurrency.value;
        const toCurrency = this.elements.toCurrency.value;
        const fromAmount = this.elements.fromAmount.value;
        const toAmount = this.elements.toAmount.value;

        // Swap currencies
        this.elements.fromCurrency.value = toCurrency;
        this.elements.toCurrency.value = fromCurrency;

        // Swap amounts
        this.elements.fromAmount.value = toAmount;
        this.elements.toAmount.value = fromAmount;

        // Update conversion
        this.updateConversion();
    }
};

// Initialize crypto converter
cryptoConverter.init();

// Watchlist
const watchlist = {
    elements: {
        coinSearch: document.getElementById('coinSearch'),
        addButton: document.getElementById('addToWatchlist'),
        watchlistItems: document.getElementById('watchlistItems'),
        emptyState: document.getElementById('watchlistEmpty')
    },

    coins: [],
    updateInterval: null,

    async init() {
        if (!this.elements.coinSearch) return;

        // Load watchlist from localStorage
        this.loadWatchlist();

        // Add event listeners
        this.elements.addButton.addEventListener('click', () => this.addCoin());
        
        // Initial update
        await this.updatePrices();
        
        // Update prices every minute
        this.updateInterval = setInterval(() => this.updatePrices(), 60000);
    },

    loadWatchlist() {
        const savedWatchlist = localStorage.getItem('cryptoWatchlist');
        if (savedWatchlist) {
            this.coins = JSON.parse(savedWatchlist);
            this.renderWatchlist();
        }
        this.updateEmptyState();
    },

    saveWatchlist() {
        localStorage.setItem('cryptoWatchlist', JSON.stringify(this.coins));
        this.updateEmptyState();
    },

    async addCoin() {
        const coinId = this.elements.coinSearch.value;
        if (!coinId) return;

        // Check if coin is already in watchlist
        if (this.coins.some(coin => coin.id === coinId)) {
            alert('This coin is already in your watchlist');
            return;
        }

        const coinData = await this.getCoinData(coinId);
        if (coinData) {
            this.coins.push({
                id: coinId,
                name: this.elements.coinSearch.options[this.elements.coinSearch.selectedIndex].text,
                data: coinData
            });
            this.saveWatchlist();
            this.renderWatchlist();
        }

        // Reset select
        this.elements.coinSearch.value = '';
    },

    removeCoin(coinId) {
        this.coins = this.coins.filter(coin => coin.id !== coinId);
        this.saveWatchlist();
        this.renderWatchlist();
    },

    async getCoinData(coinId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
            );
            
            if (!response.ok) throw new Error('Failed to fetch coin data');
            
            const data = await response.json();
            return data[coinId];
        } catch (error) {
            console.error('Error fetching coin data:', error);
            return null;
        }
    },

    async updatePrices() {
        if (this.coins.length === 0) return;

        const coinIds = this.coins.map(coin => coin.id).join(',');
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
            );
            
            if (!response.ok) throw new Error('Failed to fetch prices');
            
            const data = await response.json();
            
            this.coins = this.coins.map(coin => ({
                ...coin,
                data: data[coin.id]
            }));
            
            this.renderWatchlist();
        } catch (error) {
            console.error('Error updating prices:', error);
        }
    },

    formatNumber(number, type) {
        if (value === null || value === undefined) return 'N/A';

        switch (type) {
            case 'price':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                }).format(number);

            case 'change':
                return number.toFixed(2) + '%';

            case 'marketCap':
                if (number >= 1e12) return (number / 1e12).toFixed(2) + 'T';
                if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
                if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
                return number.toFixed(2);

            default:
                return value.toString();
        }
    },

    updateEmptyState() {
        if (this.coins.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.watchlistItems.style.display = 'none';
        } else {
            this.elements.emptyState.style.display = 'none';
            this.elements.watchlistItems.style.display = 'flex';
        }
    },

    renderWatchlist() {
        if (!this.elements.watchlistItems) return;

        this.elements.watchlistItems.innerHTML = '';
        
        this.coins.forEach(coin => {
            const { data } = coin;
            if (!data) return;

            const change24h = data.usd_24h_change || 0;
            const changeClass = change24h >= 0 ? 'positive' : 'negative';
            const changePrefix = change24h >= 0 ? '+' : '';

            const item = document.createElement('div');
            item.className = 'watchlist-item';
            item.innerHTML = `
                <div class="coin-info">
                    <div class="coin-name">
                        <span>${coin.name}</span>
                    </div>
                </div>
                <div class="price">${this.formatNumber(data.usd, 'price')}</div>
                <div class="change-24h ${changeClass}">
                    ${changePrefix}${this.formatNumber(change24h, 'change')}
                </div>
                <div class="market-cap">
                    ${this.formatNumber(data.usd_market_cap, 'marketCap')}
                </div>
                <button class="remove-from-watchlist" onclick="watchlist.removeCoin('${coin.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            this.elements.watchlistItems.appendChild(item);
        });

        this.updateEmptyState();
    }
};

// Initialize watchlist
watchlist.init();

// Price Alerts
const priceAlerts = {
    elements: {
        alertCoin: document.getElementById('alertCoin'),
        alertType: document.getElementById('alertType'),
        alertPrice: document.getElementById('alertPrice'),
        addButton: document.getElementById('addAlert'),
        alertsList: document.getElementById('alertsList'),
        emptyState: document.getElementById('alertsEmpty')
    },

    alerts: [],
    updateInterval: null,

    async init() {
        if (!this.elements.alertCoin) return;

        // Load alerts from localStorage
        this.loadAlerts();

        // Add event listeners
        this.elements.addButton.addEventListener('click', () => this.addAlert());
        
        // Initial check
        await this.checkAlerts();
        
        // Check alerts every minute
        this.updateInterval = setInterval(() => this.checkAlerts(), 60000);
    },

    loadAlerts() {
        const savedAlerts = localStorage.getItem('cryptoPriceAlerts');
        if (savedAlerts) {
            this.alerts = JSON.parse(savedAlerts);
            this.renderAlerts();
        }
        this.updateEmptyState();
    },

    saveAlerts() {
        localStorage.setItem('cryptoPriceAlerts', JSON.stringify(this.alerts));
        this.updateEmptyState();
    },

    async addAlert() {
        const coinId = this.elements.alertCoin.value;
        const type = this.elements.alertType.value;
        const price = parseFloat(this.elements.alertPrice.value);

        if (!coinId || !type || !price) {
            alert('Please fill in all fields');
            return;
        }

        // Get current price for validation
        const currentPrice = await this.getCurrentPrice(coinId);
        if (!currentPrice) {
            alert('Error fetching current price. Please try again.');
            return;
        }

        // Validate alert conditions
        if (type === 'above' && price <= currentPrice) {
            alert('Target price must be above current price for this alert type');
            return;
        }
        if (type === 'below' && price >= currentPrice) {
            alert('Target price must be below current price for this alert type');
            return;
        }

        // Add alert
        const alert = {
            id: Date.now(),
            coinId,
            coinName: this.elements.alertCoin.options[this.elements.alertCoin.selectedIndex].text,
            type,
            targetPrice: price,
            currentPrice,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        this.alerts.push(alert);
        this.saveAlerts();
        this.renderAlerts();

        // Reset form
        this.elements.alertCoin.value = '';
        this.elements.alertPrice.value = '';
        this.elements.alertType.value = 'above';
    },

    removeAlert(id) {
        this.alerts = this.alerts.filter(alert => alert.id !== id);
        this.saveAlerts();
        this.renderAlerts();
    },

    async getCurrentPrice(coinId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
            );
            
            if (!response.ok) throw new Error('Failed to fetch price');
            
            const data = await response.json();
            return data[coinId].usd;
        } catch (error) {
            console.error('Error fetching price:', error);
            return null;
        }
    },

    async checkAlerts() {
        if (this.alerts.length === 0) return;

        const activeAlerts = this.alerts.filter(alert => alert.status === 'active');
        if (activeAlerts.length === 0) return;

        const coinIds = [...new Set(activeAlerts.map(alert => alert.coinId))];
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
            );
            
            if (!response.ok) throw new Error('Failed to fetch prices');
            
            const data = await response.json();
            
            let alertTriggered = false;
            this.alerts = this.alerts.map(alert => {
                if (alert.status !== 'active') return alert;

                const currentPrice = data[alert.coinId].usd;
                const isTriggered = alert.type === 'above' 
                    ? currentPrice >= alert.targetPrice
                    : currentPrice <= alert.targetPrice;

                if (isTriggered && alert.status === 'active') {
                    alertTriggered = true;
                    this.showNotification(alert, currentPrice);
                    return { ...alert, status: 'triggered', currentPrice };
                }

                return { ...alert, currentPrice };
            });

            if (alertTriggered) {
                this.saveAlerts();
            }
            
            this.renderAlerts();
        } catch (error) {
            console.error('Error checking alerts:', error);
        }
    },

    showNotification(alert, currentPrice) {
        const notification = new Notification('Crypto Price Alert', {
            body: `${alert.coinName} has reached your target price of $${alert.targetPrice}! Current price: $${currentPrice}`,
            icon: '/favicon.ico'
        });

        notification.onclick = () => {
            window.focus();
            document.getElementById('priceAlerts').scrollIntoView({ behavior: 'smooth' });
        };
    },

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    },

    updateEmptyState() {
        if (this.alerts.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.alertsList.style.display = 'none';
        } else {
            this.elements.emptyState.style.display = 'none';
            this.elements.alertsList.style.display = 'flex';
        }
    },

    renderAlerts() {
        if (!this.elements.alertsList) return;

        this.elements.alertsList.innerHTML = '';
        
        this.alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.innerHTML = `
                <div class="alert-info">
                    <span class="alert-coin">${alert.coinName}</span>
                    <span class="alert-condition">
                        Target: ${alert.type === 'above' ? 'Above' : 'Below'} ${this.formatPrice(alert.targetPrice)}
                    </span>
                </div>
                <div class="alert-current-price">
                    Current: ${this.formatPrice(alert.currentPrice)}
                </div>
                <div class="alert-status ${alert.status}">
                    ${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </div>
                <button class="remove-alert" onclick="priceAlerts.removeAlert(${alert.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            this.elements.alertsList.appendChild(item);
        });

        this.updateEmptyState();
    }
};

// Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Initialize price alerts
priceAlerts.init();

// Mining Calculator
const miningCalculator = {
    elements: {
        form: {
            coin: document.getElementById('miningCoin'),
            hashrate: document.getElementById('hashrate'),
            hashrateUnit: document.getElementById('hashrateUnit'),
            powerConsumption: document.getElementById('powerConsumption'),
            electricityCost: document.getElementById('electricityCost'),
            poolFee: document.getElementById('poolFee'),
            calculateBtn: document.getElementById('calculateMining')
        },
        results: {
            container: document.getElementById('miningResults'),
            dailyRevenue: document.getElementById('dailyRevenue'),
            dailyPowerCost: document.getElementById('dailyPowerCost'),
            dailyProfit: document.getElementById('dailyProfit'),
            monthlyRevenue: document.getElementById('monthlyRevenue'),
            monthlyPowerCost: document.getElementById('monthlyPowerCost'),
            monthlyProfit: document.getElementById('monthlyProfit'),
            networkDifficulty: document.getElementById('networkDifficulty'),
            networkHashrate: document.getElementById('networkHashrate'),
            blockReward: document.getElementById('blockReward'),
            lastUpdated: document.getElementById('lastUpdated')
        }
    },
    coinData: {
        BTC: { algorithm: 'SHA-256', units: 'TH/s', blockTime: 600, blockReward: 6.25 },
        ETH: { algorithm: 'Ethash', units: 'MH/s', blockTime: 13.5, blockReward: 2 },
        ETC: { algorithm: 'Ethash', units: 'MH/s', blockTime: 13.5, blockReward: 3.2 },
        RVN: { algorithm: 'KawPow', units: 'MH/s', blockTime: 60, blockReward: 2500 },
        ERG: { algorithm: 'Autolykos v2', units: 'MH/s', blockTime: 120, blockReward: 67.5 }
    },

    init() {
        if (!this.elements.form.calculateBtn) return;

        this.elements.form.calculateBtn.addEventListener('click', () => this.calculate());
        this.elements.form.coin.addEventListener('change', () => this.updateHashrateUnit());
    },

    updateHashrateUnit() {
        const coin = this.elements.form.coin.value;
        if (coin && this.coinData[coin]) {
            this.elements.form.hashrateUnit.value = this.coinData[coin].units;
        }
    },

    async getNetworkStats(coin) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
            if (!response.ok) throw new Error('Failed to fetch network stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching network stats:', error);
            return null;
        }
    },

    convertHashrate(value, fromUnit, toUnit) {
        const units = ['H', 'KH', 'MH', 'GH', 'TH', 'PH'];
        const fromIndex = units.indexOf(fromUnit);
        const toIndex = units.indexOf(toUnit);
        return value * Math.pow(1000, fromIndex - toIndex);
    },

    formatHashrate(value, unit) {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M${unit}`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)}k${unit}`;
        }
        return `${value.toFixed(2)}${unit}`;
    },

    formatNumber(value, decimals = 2) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },

    async calculate() {
        const coin = this.elements.form.coin.value;
        const hashrate = parseFloat(this.elements.form.hashrate.value);
        const hashrateUnit = this.elements.form.hashrateUnit.value;
        const powerConsumption = parseFloat(this.elements.form.powerConsumption.value);
        const electricityCost = parseFloat(this.elements.form.electricityCost.value);
        const poolFee = parseFloat(this.elements.form.poolFee.value) / 100;

        if (!coin || isNaN(hashrate) || isNaN(powerConsumption) || isNaN(electricityCost)) {
            alert('Please fill in all required fields with valid numbers');
            return;
        }

        try {
            // Get network stats and coin price
            const networkData = await this.getNetworkStats(coin);
            if (!networkData) {
                alert('Failed to fetch network data. Please try again later.');
                return;
            }

            const coinPrice = networkData.market_data.current_price.usd;
            const networkHashrate = networkData.market_data.total_volume.usd; // Using volume as a proxy for network hashrate
            const difficulty = networkData.market_data.high_24h.usd; // Using 24h high as a proxy for difficulty

            // Calculate mining rewards
            const coinData = this.coinData[coin];
            const blocksPerDay = (86400 / coinData.blockTime);
            const networkHashrateConverted = this.convertHashrate(networkHashrate, 'H', hashrateUnit);
            const userHashrateShare = hashrate / networkHashrateConverted;
            
            // Calculate daily earnings
            const dailyCoins = blocksPerDay * coinData.blockReward * userHashrateShare * (1 - poolFee);
            const dailyRevenue = dailyCoins * coinPrice;
            
            // Calculate power costs
            const dailyPowerCost = (powerConsumption * 24 / 1000) * electricityCost;
            const dailyProfit = dailyRevenue - dailyPowerCost;

            // Update results
            this.elements.results.container.style.display = 'block';
            this.elements.results.dailyRevenue.textContent = `$${this.formatNumber(dailyRevenue)}`;
            this.elements.results.dailyPowerCost.textContent = `$${this.formatNumber(dailyPowerCost)}`;
            this.elements.results.dailyProfit.textContent = `$${this.formatNumber(dailyProfit)}`;
            this.elements.results.monthlyRevenue.textContent = `$${this.formatNumber(dailyRevenue * 30)}`;
            this.elements.results.monthlyPowerCost.textContent = `$${this.formatNumber(dailyPowerCost * 30)}`;
            this.elements.results.monthlyProfit.textContent = `$${this.formatNumber(dailyProfit * 30)}`;

            // Update network details
            this.elements.results.networkDifficulty.textContent = this.formatNumber(difficulty);
            this.elements.results.networkHashrate.textContent = this.formatHashrate(networkHashrate, 'H/s');
            this.elements.results.blockReward.textContent = `${coinData.blockReward} ${coin}`;
            this.elements.results.lastUpdated.textContent = new Date().toLocaleString();

            // Color code profits
            const profitElements = [this.elements.results.dailyProfit, this.elements.results.monthlyProfit];
            profitElements.forEach(element => {
                if (parseFloat(element.textContent.replace('$', '')) > 0) {
                    element.style.color = 'var(--success-color)';
                } else {
                    element.style.color = 'var(--error-color)';
                }
            });

        } catch (error) {
            console.error('Error calculating mining profits:', error);
            alert('An error occurred while calculating mining profits. Please try again.');
        }
    }
};

// Initialize mining calculator
miningCalculator.init();

// Crypto Heatmap
const cryptoHeatmap = {
    elements: {
        chart: document.getElementById('heatmapChart'),
        tooltip: document.querySelector('.heatmap-tooltip'),
        timeframeButtons: document.querySelectorAll('.timeframe-btn'),
        sortSelect: document.getElementById('heatmapSort')
    },
    data: null,
    svg: null,
    currentTimeframe: '24h',
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    cellPadding: 4,

    async init() {
        if (!this.elements.chart) return;

        // Add event listeners
        this.elements.timeframeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeTimeframe(btn.dataset.timeframe));
        });

        this.elements.sortSelect.addEventListener('change', () => this.sortAndRender());

        // Initialize D3 SVG
        this.svg = d3.select('#heatmapChart')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('min-height', '400px');

        // Initial data fetch and render
        await this.fetchData();
        this.render();

        // Update every 5 minutes
        setInterval(() => this.fetchData(), 300000);

        // Handle window resize
        window.addEventListener('resize', () => this.render());
    },

    async fetchData() {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?' +
                'vs_currency=usd&order=market_cap_desc&per_page=100&page=1&' +
                'sparkline=false&price_change_percentage=24h,7d,30d'
            );

            if (!response.ok) throw new Error('Failed to fetch market data');
            
            this.data = await response.json();
            this.render();
        } catch (error) {
            console.error('Error fetching market data:', error);
            this.elements.chart.innerHTML = '<div class="error-message">Failed to load market data. Please try again later.</div>';
        }
    },

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        this.elements.timeframeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });
        this.render();
    },

    getColor(change) {
        if (change === null || change === undefined) return '#808080';
        
        if (change <= -10) return '#ff4d4d';
        if (change <= -5) return '#ff8080';
        if (change <= 0) return '#ffb3b3';
        if (change <= 5) return '#b3ffb3';
        if (change <= 10) return '#80ff80';
        return '#33cc33';
    },

    formatNumber(value, type = 'price') {
        if (value === null || value === undefined) return 'N/A';

        switch (type) {
            case 'price':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                }).format(value);

            case 'percentage':
                return value.toFixed(2) + '%';

            case 'marketcap':
                if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
                if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
                if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
                return value.toFixed(2);

            default:
                return value.toString();
        }
    },

    showTooltip(event, d) {
        const timeframeMap = {
            '24h': 'price_change_percentage_24h',
            '7d': 'price_change_percentage_7d',
            '30d': 'price_change_percentage_30d'
        };

        const change = d[timeframeMap[this.currentTimeframe]];
        const changeClass = change >= 0 ? 'positive' : 'negative';

        this.elements.tooltip.style.display = 'block';
        this.elements.tooltip.style.left = (event.pageX + 10) + 'px';
        this.elements.tooltip.style.top = (event.pageY + 10) + 'px';
        
        this.elements.tooltip.innerHTML = `
            <h4>${d.name} (${d.symbol.toUpperCase()})</h4>
            <p>Price: <span>${this.formatNumber(d.current_price)}</span></p>
            <p>Change ${this.currentTimeframe}: <span class="${changeClass}">${this.formatNumber(change, 'percentage')}</span></p>
            <p>Market Cap: <span>${this.formatNumber(d.market_cap, 'marketcap')}</span></p>
            <p>Volume: <span>${this.formatNumber(d.total_volume, 'marketcap')}</span></p>
        `;
    },

    hideTooltip() {
        this.elements.tooltip.style.display = 'none';
    },

    sortAndRender() {
        const sortBy = this.elements.sortSelect.value;
        const timeframeMap = {
            '24h': 'price_change_percentage_24h',
            '7d': 'price_change_percentage_7d',
            '30d': 'price_change_percentage_30d'
        };

        this.data.sort((a, b) => {
            switch (sortBy) {
                case 'marketcap':
                    return b.market_cap - a.market_cap;
                case 'price_change':
                    return b[timeframeMap[this.currentTimeframe]] - a[timeframeMap[this.currentTimeframe]];
                case 'volume':
                    return b.total_volume - a.total_volume;
                default:
                    return 0;
            }
        });

        this.render();
    },

    render() {
        if (!this.data || !this.svg) return;

        const container = this.elements.chart.getBoundingClientRect();
        const width = container.width - this.margin.left - this.margin.right;
        const height = Math.max(400, container.height) - this.margin.top - this.margin.bottom;

        // Clear previous content
        this.svg.selectAll('*').remove();

        // Calculate grid dimensions
        const numCols = Math.floor(Math.sqrt(this.data.length * (width / height)));
        const numRows = Math.ceil(this.data.length / numCols);
        const cellWidth = (width / numCols) - this.cellPadding;
        const cellHeight = (height / numRows) - this.cellPadding;

        // Update SVG dimensions
        this.svg
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom);

        // Create cells
        const timeframeMap = {
            '24h': 'price_change_percentage_24h',
            '7d': 'price_change_percentage_7d',
            '30d': 'price_change_percentage_30d'
        };

        const cells = this.svg.selectAll('.heatmap-cell')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'heatmap-cell')
            .attr('transform', (d, i) => {
                const row = Math.floor(i / numCols);
                const col = i % numCols;
                return `translate(${col * (cellWidth + this.cellPadding) + this.margin.left},
                                ${row * (cellHeight + this.cellPadding) + this.margin.top})`;
            });

        // Add rectangles
        cells.append('rect')
            .attr('width', cellWidth)
            .attr('height', cellHeight)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', d => this.getColor(d[timeframeMap[this.currentTimeframe]]))
            .attr('opacity', 0.8);

        // Add symbol text
        cells.append('text')
            .attr('x', cellWidth / 2)
            .attr('y', cellHeight / 2 - 8)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.symbol.toUpperCase())
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('fill', 'white');

        // Add percentage change text
        cells.append('text')
            .attr('x', cellWidth / 2)
            .attr('y', cellHeight / 2 + 8)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => {
                const change = d[timeframeMap[this.currentTimeframe]];
                return change !== null ? `${change.toFixed(1)}%` : 'N/A';
            })
            .style('font-size', '11px')
            .style('fill', 'white');

        // Add event listeners
        cells
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mousemove', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());
    }
};

// Initialize crypto heatmap
cryptoHeatmap.init();

// Learn Crypto Section
const learnCrypto = {
    init() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const contentSections = document.querySelectorAll('.content-section');
        const readMoreButtons = document.querySelectorAll('.read-more-btn');

        // Category switching
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Show selected content
                contentSections.forEach(section => {
                    if (section.id === category) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            });
        });

        // Read More functionality
        readMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.learn-card');
                const title = card.querySelector('h3').textContent;
                const content = card.querySelector('p').textContent;
                
                // Here you would typically open a modal or navigate to a full article
                // For now, we'll just log it
                console.log(`Opening full article: ${title}`);
                alert('Full article content will be added in the next update!');
            });
        });
    }
};

// Initialize learn crypto
learnCrypto.init();

// DCA Calculator
const dcaCalculator = {
    elements: {
        coin: document.getElementById('dcaCoin'),
        amount: document.getElementById('dcaAmount'),
        frequency: document.getElementById('dcaFrequency'),
        startDate: document.getElementById('dcaStartDate'),
        calculateBtn: document.getElementById('calculateDCA'),
        loadingOverlay: document.querySelector('.loading-overlay'),
        timeframeButtons: document.querySelectorAll('.timeframe-btn'),
        chart: document.getElementById('dcaChart'),
        tableBody: document.getElementById('investmentTableBody'),
        totalInvested: document.querySelector('.total-invested .result-value'),
        totalInvestedSub: document.querySelector('.total-invested .result-subtitle'),
        currentValue: document.querySelector('.current-value .result-value'),
        totalReturn: document.querySelector('.total-return .result-value'),
        totalReturnPercentage: document.querySelector('.total-return .result-percentage'),
        avgPrice: document.querySelector('.avg-price .result-value')
    },
    chart: null,
    data: null,
    currentTimeframe: 'all',

    init() {
        // Set default start date to 1 year ago
        const defaultStartDate = new Date();
        defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
        this.elements.startDate.value = defaultStartDate.toISOString().split('T')[0];

        // Add event listeners
        this.elements.calculateBtn.addEventListener('click', () => this.calculate());
        this.elements.timeframeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeTimeframe(btn.dataset.timeframe));
        });

        // Initialize chart
        this.initChart();
    },

    async calculate() {
        try {
            this.showLoading(true);

            // Get input values
            const coin = this.elements.coin.value;
            const amount = parseFloat(this.elements.amount.value);
            const frequency = this.elements.frequency.value;
            const startDate = new Date(this.elements.startDate.value);
            const endDate = new Date();

            // Validate inputs
            if (!this.validateInputs(amount, startDate)) {
                return;
            }

            // Fetch historical price data
            const priceData = await this.fetchHistoricalPrices(coin, startDate, endDate);
            
            // Calculate investment dates
            const investmentDates = this.generateInvestmentDates(startDate, endDate, frequency);

            // Calculate returns
            this.data = this.calculateReturns(investmentDates, amount, priceData);

            // Update UI
            this.updateResults();
            this.updateChart();
            this.updateTable();

        } catch (error) {
            console.error('Error calculating DCA:', error);
            alert('Failed to calculate DCA returns. Please try again.');
        } finally {
            this.showLoading(false);
        }
    },

    validateInputs(amount, startDate) {
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid investment amount');
            return false;
        }

        if (startDate >= new Date()) {
            alert('Start date must be in the past');
            return false;
        }

        return true;
    },

    async fetchHistoricalPrices(coin, startDate, endDate) {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?` +
            `vs_currency=usd&from=${Math.floor(startDate.getTime() / 1000)}` +
            `&to=${Math.floor(endDate.getTime() / 1000)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch price data');
        }

        const data = await response.json();
        return data.prices.reduce((acc, [timestamp, price]) => {
            acc[new Date(timestamp).toISOString().split('T')[0]] = price;
            return acc;
        }, {});
    },

    generateInvestmentDates(startDate, endDate, frequency) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));

            switch (frequency) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'biweekly':
                    currentDate.setDate(currentDate.getDate() + 14);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
        }

        return dates;
    },

    calculateReturns(dates, amount, priceData) {
        const investments = dates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const price = priceData[dateStr];
            
            if (!price) return null;

            const coins = amount / price;
            return {
                date,
                amount,
                price,
                coins,
                value: amount,
                return: 0
            };
        }).filter(inv => inv !== null);

        const currentPrice = Object.values(priceData).pop();
        let totalCoins = 0;
        let totalInvested = 0;

        investments.forEach(inv => {
            totalCoins += inv.coins;
            totalInvested += inv.amount;
            inv.value = totalCoins * currentPrice;
            inv.return = inv.value - totalInvested;
        });

        return {
            investments,
            summary: {
                totalInvested,
                totalCoins,
                currentPrice,
                currentValue: totalCoins * currentPrice,
                totalReturn: (totalCoins * currentPrice) - totalInvested,
                returnPercentage: ((totalCoins * currentPrice) / totalInvested - 1) * 100,
                averagePrice: totalInvested / totalCoins
            }
        };
    },

    updateResults() {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        const summary = this.data.summary;
        this.elements.totalInvested.textContent = formatter.format(summary.totalInvested);
        this.elements.totalInvestedSub.textContent = `Over ${this.data.investments.length} investments`;
        this.elements.currentValue.textContent = formatter.format(summary.currentValue);
        this.elements.totalReturn.textContent = formatter.format(summary.totalReturn);
        this.elements.totalReturnPercentage.textContent = `${summary.returnPercentage.toFixed(2)}%`;
        this.elements.totalReturnPercentage.className = `result-percentage ${summary.returnPercentage >= 0 ? 'positive' : 'negative'}`;
        this.elements.avgPrice.textContent = formatter.format(summary.averagePrice);
    },

    updateChart() {
        const data = this.filterDataByTimeframe(this.data.investments);
        
        const chartData = {
            labels: data.map(inv => inv.date.toLocaleDateString()),
            datasets: [{
                label: 'Portfolio Value',
                data: data.map(inv => inv.value),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }, {
                label: 'Total Invested',
                data: data.map(inv => inv.amount * (data.indexOf(inv) + 1)),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true
            }]
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.elements.chart, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.raw;
                                return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(value)}`;
                            }
                        }
                    }
                }
            }
        });
    },

    updateTable() {
        const data = this.filterDataByTimeframe(this.data.investments);
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        this.elements.tableBody.innerHTML = data.map(inv => `
            <tr>
                <td>${inv.date.toLocaleDateString()}</td>
                <td>${formatter.format(inv.amount)}</td>
                <td>${formatter.format(inv.price)}</td>
                <td>${inv.coins.toFixed(8)}</td>
                <td>${formatter.format(inv.value)}</td>
                <td class="${inv.return >= 0 ? 'positive' : 'negative'}">
                    ${formatter.format(inv.return)}
                </td>
            </tr>
        `).join('');
    },

    filterDataByTimeframe(investments) {
        const now = new Date();
        let filterDate = new Date();

        switch (this.currentTimeframe) {
            case 'month':
                filterDate.setMonth(filterDate.getMonth() - 1);
                break;
            case 'year':
                filterDate.setFullYear(filterDate.getFullYear() - 1);
                break;
            default:
                return investments;
        }

        return investments.filter(inv => inv.date >= filterDate);
    },

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        this.elements.timeframeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });

        if (this.data) {
            this.updateChart();
            this.updateTable();
        }
    },

    showLoading(show) {
        this.elements.loadingOverlay.classList.toggle('active', show);
    },

    initChart() {
        // Create empty chart
        this.chart = new Chart(this.elements.chart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true
                }, {
                    label: 'Total Invested',
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
};

// Initialize DCA calculator
dcaCalculator.init();

// Trending Coins
const trendingCoins = {
    elements: {
        grid: document.querySelector('.trending-grid'),
        refreshBtn: document.getElementById('refreshTrending'),
        lastUpdated: document.querySelector('.last-updated'),
        loading: document.querySelector('.trending-loading')
    },
    refreshInterval: null,

    init() {
        this.fetchTrending();
        
        // Refresh data every 5 minutes
        this.refreshInterval = setInterval(() => this.fetchTrending(), 300000);

        // Add click event for manual refresh
        this.elements.refreshBtn.addEventListener('click', () => {
            this.elements.refreshBtn.classList.add('refreshing');
            this.fetchTrending();
        });
    },

    async fetchTrending() {
        try {
            this.showLoading(true);

            // Fetch trending coins
            const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
            const trendingData = await trendingResponse.json();

            // Get coin IDs for price data
            const coinIds = trendingData.coins.map(coin => coin.item.id).join(',');

            // Fetch price data for trending coins
            const priceResponse = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24h_change=true`
            );
            const priceData = await priceResponse.json();

            // Combine trending and price data
            const combinedData = trendingData.coins.map(coin => ({
                ...coin.item,
                price: priceData[coin.item.id]
            }));

            this.renderTrending(combinedData);
            this.updateLastUpdated();

        } catch (error) {
            console.error('Error fetching trending coins:', error);
            this.elements.grid.innerHTML = `
                <div class="error-message">
                    Failed to load trending coins. Please try again later.
                </div>
            `;
        } finally {
            this.showLoading(false);
            this.elements.refreshBtn.classList.remove('refreshing');
        }
    },

    renderTrending(coins) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });

        this.elements.grid.innerHTML = coins.map((coin, index) => `
            <div class="trending-card">
                <div class="coin-rank">${index + 1}</div>
                <div class="coin-image">
                    <img src="${coin.large}" alt="${coin.name}">
                </div>
                <div class="coin-info">
                    <div class="coin-name">${coin.name}</div>
                    <div class="coin-symbol">${coin.symbol}</div>
                </div>
                <div class="coin-price">
                    <div class="price-value">${formatter.format(coin.price?.usd || 0)}</div>
                    ${this.renderPriceChange(coin.price?.usd_24h_change)}
                </div>
            </div>
        `).join('');
    },

    renderPriceChange(change) {
        if (!change) return '<div class="price-change">N/A</div>';

        const isPositive = change >= 0;
        const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const className = isPositive ? 'positive' : 'negative';

        return `
            <div class="price-change ${className}">
                <i class="fas ${icon}"></i>
                ${Math.abs(change).toFixed(2)}%
            </div>
        `;
    },

    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        this.elements.lastUpdated.textContent = `Updated: ${timeString}`;
    },

    showLoading(show) {
        this.elements.loading.classList.toggle('active', show);
    },

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
};

// Initialize trending coins
trendingCoins.init();

// Price Predictions
const pricePredictions = {
    storageKey: 'cryptoPricePredictions',
    elements: {
        tabs: document.querySelectorAll('.tab-btn'),
        tabPanes: document.querySelectorAll('.tab-pane'),
        predictionForm: document.getElementById('predictionForm'),
        leaderboardTimeframe: document.getElementById('leaderboardTimeframe'),
        leaderboardCoin: document.getElementById('leaderboardCoin'),
        leaderboardBody: document.getElementById('leaderboardBody'),
        predictionDate: document.getElementById('predictionDate')
    },

    init() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.elements.predictionDate.min = today;

        // Initialize tabs
        this.elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
                if (tab.dataset.tab === 'leaderboard') {
                    this.updateLeaderboard();
                }
            });
        });

        // Initialize form submission
        this.elements.predictionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitPrediction();
        });

        // Initialize leaderboard filters
        this.elements.leaderboardTimeframe.addEventListener('change', () => this.updateLeaderboard());
        this.elements.leaderboardCoin.addEventListener('change', () => this.updateLeaderboard());

        // Load saved nickname
        const savedNickname = localStorage.getItem('predictionNickname');
        if (savedNickname) {
            document.getElementById('predictionNickname').value = savedNickname;
        }
    },

    switchTab(tabId) {
        this.elements.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        this.elements.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    },

    async submitPrediction() {
        const formData = {
            coin: document.getElementById('predictionCoin').value,
            price: parseFloat(document.getElementById('predictionPrice').value),
            date: document.getElementById('predictionDate').value,
            nickname: document.getElementById('predictionNickname').value,
            timestamp: new Date().toISOString()
        };

        // Save nickname
        localStorage.setItem('predictionNickname', formData.nickname);

        // Get current predictions
        let predictions = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        predictions.push(formData);

        // Save prediction
        localStorage.setItem(this.storageKey, JSON.stringify(predictions));

        // Show success message
        alert('Your prediction has been submitted!');
        this.elements.predictionForm.reset();

        // Switch to leaderboard
        this.switchTab('leaderboard');
        this.updateLeaderboard();
    },

    async updateLeaderboard() {
        const timeframe = this.elements.leaderboardTimeframe.value;
        const selectedCoin = this.elements.leaderboardCoin.value;
        
        // Get predictions
        let predictions = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

        // Filter by timeframe
        const now = new Date();
        if (timeframe !== 'all') {
            const timeframeDays = timeframe === 'week' ? 7 : 30;
            const cutoff = new Date(now.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));
            predictions = predictions.filter(p => new Date(p.timestamp) >= cutoff);
        }

        // Filter by coin
        if (selectedCoin !== 'all') {
            predictions = predictions.filter(p => p.coin === selectedCoin);
        }

        // Filter out future predictions
        predictions = predictions.filter(p => new Date(p.date) <= now);

        // Calculate accuracy
        const accuracyPromises = predictions.map(async prediction => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${prediction.coin}&vs_currencies=usd`
                );
                const data = await response.json();
                const actualPrice = data[prediction.coin].usd;
                const accuracy = 100 - Math.abs((prediction.price - actualPrice) / actualPrice * 100);
                return { ...prediction, actualPrice, accuracy };
            } catch (error) {
                console.error('Error fetching actual price:', error);
                return null;
            }
        });

        const resolvedPredictions = (await Promise.all(accuracyPromises))
            .filter(p => p !== null)
            .sort((a, b) => b.accuracy - a.accuracy);

        // Render leaderboard
        this.renderLeaderboard(resolvedPredictions);
    },

    renderLeaderboard(predictions) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });

        this.elements.leaderboardBody.innerHTML = predictions.map((prediction, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${prediction.nickname}</td>
                <td>${prediction.coin.charAt(0).toUpperCase() + prediction.coin.slice(1)}</td>
                <td>${formatter.format(prediction.price)}</td>
                <td>${formatter.format(prediction.actualPrice)}</td>
                <td>
                    <span class="accuracy-badge ${this.getAccuracyClass(prediction.accuracy)}">
                        ${prediction.accuracy.toFixed(2)}%
                    </span>
                </td>
                <td>${new Date(prediction.date).toLocaleDateString()}</td>
            </tr>
        `).join('');

        if (predictions.length === 0) {
            this.elements.leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No predictions found</td>
                </tr>
            `;
        }
    },

    getAccuracyClass(accuracy) {
        if (accuracy >= 95) return 'accuracy-high';
        if (accuracy >= 80) return 'accuracy-medium';
        return 'accuracy-low';
    }
};

// Initialize price predictions
pricePredictions.init();

// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#6c5ce7'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6c5ce7',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});
