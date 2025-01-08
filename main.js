// Feature Categories
const FEATURES = {
    market: {
        id: 'market',
        title: 'Market Overview',
        icon: '📊'
    },
    calculator: {
        id: 'calculator',
        title: 'DCA Calculator',
        icon: '🧮'
    },
    trending: {
        id: 'trending',
        title: 'Trending Coins',
        icon: '🔥'
    },
    predictions: {
        id: 'predictions',
        title: 'Price Predictions',
        icon: '🎯'
    },
    learn: {
        id: 'learn',
        title: 'Learn Crypto',
        icon: '📚'
    }
};

// Initialize Feature Filters
function initializeFeatureFilters() {
    const filterContainer = document.getElementById('feature-filters');
    Object.values(FEATURES).forEach(feature => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.feature = feature.id;
        button.innerHTML = `${feature.icon} ${feature.title}`;
        button.onclick = () => filterFeatures(feature.id);
        filterContainer.appendChild(button);
    });
}

// Filter Features
function filterFeatures(featureId) {
    const buttons = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('section');

    // Update button states
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.feature === featureId);
    });

    // Show/hide sections
    sections.forEach(section => {
        if (featureId === 'all' || section.id === featureId) {
            section.style.display = 'block';
            section.classList.add('fade-in');
        } else {
            section.style.display = 'none';
            section.classList.remove('fade-in');
        }
    });
}

// Market Data Functions
const MarketAPI = {
    async getGlobalStats() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            const data = await response.json();
            updateGlobalStats(data.data);
        } catch (error) {
            console.error('Error fetching global stats:', error);
        }
    },

    async getTrendingCoins() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
            const data = await response.json();
            updateTrendingCoins(data.coins);
        } catch (error) {
            console.error('Error fetching trending coins:', error);
        }
    }
};

// DCA Calculator
const DCACalculator = {
    calculate(amount, frequency, duration) {
        // Add your DCA calculation logic here
        const totalInvestment = amount * duration;
        const estimatedReturn = totalInvestment * 1.15; // Example calculation
        return { totalInvestment, estimatedReturn };
    }
};

// Price Predictions
const PredictionManager = {
    savePrediction(prediction) {
        const predictions = this.getPredictions();
        predictions.push({
            ...prediction,
            timestamp: Date.now()
        });
        localStorage.setItem('predictions', JSON.stringify(predictions));
        this.updateLeaderboard();
    },

    getPredictions() {
        return JSON.parse(localStorage.getItem('predictions') || '[]');
    },

    updateLeaderboard() {
        const predictions = this.getPredictions();
        const leaderboard = document.getElementById('prediction-leaderboard');
        if (!leaderboard) return;

        const leaderboardHTML = predictions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
            .map(p => `
                <div class="prediction-card">
                    <div class="prediction-info">
                        <span class="nickname">${p.nickname}</span>
                        <span class="coin">${p.coin}</span>
                    </div>
                    <div class="prediction-details">
                        <span class="price">$${p.price}</span>
                        <span class="date">${new Date(p.date).toLocaleDateString()}</span>
                    </div>
                </div>
            `)
            .join('');

        leaderboard.innerHTML = leaderboardHTML;
    }
};

// Theme Switcher
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on user's system preference or stored preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    } else {
        const isDark = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.checked = isDark;
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update chart colors if chart exists
        if (typeof updateChartColors === 'function') {
            const colors = getThemeColors();
            updateChartColors(colors);
        }
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.checked = e.matches;
            
            // Update chart colors if chart exists
            if (typeof updateChartColors === 'function') {
                const colors = getThemeColors();
                updateChartColors(colors);
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatureFilters();
    MarketAPI.getGlobalStats();
    MarketAPI.getTrendingCoins();
    PredictionManager.updateLeaderboard();
    initializeTheme();

    // Add scroll animation for sections
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
