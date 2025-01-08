// Theme management
const themeManager = {
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.setInitialTheme();
        this.setupEventListeners();
    },

    setInitialTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set theme based on saved preference or system preference
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(theme);
        
        // Update toggle state
        this.themeToggle.checked = theme === 'dark';
    },

    setupEventListeners() {
        // Theme toggle click
        this.themeToggle.addEventListener('change', () => {
            const newTheme = this.themeToggle.checked ? 'dark' : 'light';
            this.applyTheme(newTheme);
        });

        // System theme change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.themeToggle.checked = e.matches;
            }
        });
    },

    applyTheme(theme) {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update chart colors if chart exists and has updateChartColors function
        if (typeof updateChartColors === 'function') {
            const colors = {
                textColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
                gridColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
            };
            updateChartColors(colors);
        }
    }
};

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});
