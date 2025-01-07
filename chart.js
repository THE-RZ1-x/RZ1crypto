// Chart.js configuration and setup
let cryptoChart;
let currentCoin = 'bitcoin';
let currentTimeframe = 30; // Default to 30 days

// Get current theme colors
function getThemeColors() {
    const style = getComputedStyle(document.documentElement);
    return {
        textColor: style.getPropertyValue('--text-color').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        secondaryColor: style.getPropertyValue('--secondary-color').trim(),
        gridColor: style.getPropertyValue('--border-color').trim()
    };
}

// Initialize chart data
async function initializeChart() {
    const chartCtx = document.getElementById('cryptoChart').getContext('2d');
    const colors = getThemeColors();
    
    cryptoChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Price',
                    data: [],
                    borderColor: colors.primaryColor,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'price'
                },
                {
                    label: 'Volume',
                    data: [],
                    borderColor: colors.secondaryColor,
                    borderWidth: 1,
                    fill: true,
                    backgroundColor: `${colors.secondaryColor}20`,
                    tension: 0.4,
                    yAxisID: 'volume'
                }
            ]
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
                    backgroundColor: colors.textColor === '#ffffff' ? '#1a1a1a' : '#ffffff',
                    titleColor: colors.textColor === '#ffffff' ? '#ffffff' : '#1a1a1a',
                    bodyColor: colors.textColor === '#ffffff' ? '#ffffff' : '#1a1a1a',
                    borderColor: colors.gridColor,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label === 'Price') {
                                return `${label}: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            } else {
                                return `${label}: $${context.parsed.y.toLocaleString('en-US')}`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colors.textColor
                    }
                },
                price: {
                    type: 'linear',
                    position: 'left',
                    grid: {
                        color: colors.gridColor
                    },
                    ticks: {
                        color: colors.textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        }
                    }
                },
                volume: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colors.textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                        }
                    }
                }
            }
        }
    });

    // Initial data fetch
    await updateChartData();

    // Update chart colors when theme changes
    const observer = new MutationObserver(() => {
        const newColors = getThemeColors();
        updateChartColors(newColors);
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Update chart colors when theme changes
function updateChartColors(colors) {
    if (!cryptoChart) return;

    cryptoChart.data.datasets[0].borderColor = colors.primaryColor;
    cryptoChart.data.datasets[1].borderColor = colors.secondaryColor;
    cryptoChart.data.datasets[1].backgroundColor = `${colors.secondaryColor}20`;

    cryptoChart.options.plugins.tooltip.backgroundColor = colors.textColor === '#ffffff' ? '#1a1a1a' : '#ffffff';
    cryptoChart.options.plugins.tooltip.titleColor = colors.textColor === '#ffffff' ? '#ffffff' : '#1a1a1a';
    cryptoChart.options.plugins.tooltip.bodyColor = colors.textColor === '#ffffff' ? '#ffffff' : '#1a1a1a';
    cryptoChart.options.plugins.tooltip.borderColor = colors.gridColor;

    cryptoChart.options.scales.x.ticks.color = colors.textColor;
    cryptoChart.options.scales.price.ticks.color = colors.textColor;
    cryptoChart.options.scales.volume.ticks.color = colors.textColor;
    cryptoChart.options.scales.price.grid.color = colors.gridColor;

    cryptoChart.update();
}

// Fetch price data from CoinGecko API
async function fetchPriceData(coin, days) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching price data:', error);
        return null;
    }
}

// Update chart with new data
async function updateChartData() {
    const data = await fetchPriceData(currentCoin, currentTimeframe);
    if (!data) return;

    const prices = data.prices;
    const volumes = data.total_volumes;

    const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
    const priceData = prices.map(price => price[1]);
    const volumeData = volumes.map(volume => volume[1]);

    cryptoChart.data.labels = labels;
    cryptoChart.data.datasets[0].data = priceData;
    cryptoChart.data.datasets[1].data = volumeData;
    cryptoChart.update();

    // Update price statistics
    updatePriceStats(priceData, volumeData);
}

// Update price statistics
function updatePriceStats(prices, volumes) {
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    const dayHigh = Math.max(...prices.slice(-24));
    const dayLow = Math.min(...prices.slice(-24));
    const lastVolume = volumes[volumes.length - 1];
    const marketCap = currentPrice * 21000000; // Approximate for Bitcoin

    document.getElementById('currentPrice').textContent = formatCurrency(currentPrice);
    document.getElementById('priceChange').textContent = formatPercentage(priceChange);
    document.getElementById('priceChange').className = `stat-value ${priceChange >= 0 ? 'positive' : 'negative'}`;
    document.getElementById('dayHigh').textContent = formatCurrency(dayHigh);
    document.getElementById('dayLow').textContent = formatCurrency(dayLow);
    document.getElementById('volume').textContent = formatCurrency(lastVolume);
    document.getElementById('marketCap').textContent = formatCurrency(marketCap);
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
}

// Format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Format percentage values
function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

// Event listeners for coin selection
document.querySelectorAll('.coin-btn').forEach(button => {
    button.addEventListener('click', async function() {
        document.querySelector('.coin-btn.active').classList.remove('active');
        this.classList.add('active');
        currentCoin = this.dataset.coin;
        await updateChartData();
    });
});

// Event listeners for timeframe selection
document.querySelectorAll('.time-btn').forEach(button => {
    button.addEventListener('click', async function() {
        document.querySelector('.time-btn.active').classList.remove('active');
        this.classList.add('active');
        currentTimeframe = this.dataset.days;
        await updateChartData();
    });
});

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChart);