// EcoGo Energy Monitoring App - Firebase Integration
class EcoGoApp {
    constructor() {
        this.cloudService = window.cloudService;
        this.userData = null;
        this.charts = {};
        this.currentPeriod = 7;
        this.init();
    }

    async init() {
        // Wait for Firebase to initialize
        if (!this.cloudService) {
            setTimeout(() => this.init(), 1000);
            return;
        }

        // Check authentication first
        await this.checkAuthentication();
        
        this.setupEventListeners();
        this.loadUserData();
        this.initializeCharts();
        this.setupRealtimeUpdates();
    }

    async checkAuthentication() {
        // Check if user is authenticated
        const currentUser = this.cloudService.auth.currentUser;
        if (!currentUser) {
            // User is not authenticated, redirect to login
            window.location.href = 'login.html';
            return;
        }
        
        console.log('User authenticated:', currentUser.email);
        
        // Hide loading screen and show main content
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        if (loadingScreen && mainContainer) {
            loadingScreen.style.display = 'none';
            mainContainer.style.display = 'block';
        }
    }

    setupEventListeners() {
        // Period selector
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePeriodChange(e.target.dataset.period);
            });
        });

        // Add appliance form
        const addApplianceForm = document.getElementById('addApplianceForm');
        if (addApplianceForm) {
            addApplianceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addAppliance();
            });
        }

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async loadUserData() {
        try {
            this.userData = await this.cloudService.loadUserData();
            if (this.userData) {
                this.updateDashboard();
                this.updateCharts();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading data', 'error');
        }
    }

    setupRealtimeUpdates() {
        this.cloudService.setupRealtimeListener((data) => {
            this.userData = data;
            this.updateDashboard();
            this.updateCharts();
        });
    }

    updateDashboard() {
        if (!this.userData) return;

        const energyData = this.userData.energyData;
        
        // Update stats
        document.getElementById('todayUsage').textContent = `${energyData.currentUsage.toFixed(2)} kWh`;
        document.getElementById('todayCost').textContent = `₹${(energyData.currentUsage * energyData.costPerKwh).toFixed(2)}`;
        document.getElementById('activeAlerts').textContent = energyData.alerts.length;
        
        const goalProgress = Math.min((energyData.currentUsage / energyData.dailyGoal) * 100, 100);
        document.getElementById('goalProgress').textContent = `${goalProgress.toFixed(1)}%`;

        // Update appliance list
        this.updateApplianceList();
        
        // Update alerts
        this.updateAlerts();
    }

    updateApplianceList() {
        const applianceList = document.getElementById('applianceList');
        if (!applianceList || !this.userData) return;

        applianceList.innerHTML = '';
        
        this.userData.energyData.appliances.forEach(appliance => {
            const applianceItem = document.createElement('div');
            applianceItem.className = 'appliance-item';
            applianceItem.innerHTML = `
                <div class="appliance-info">
                    <h4>${appliance.name}</h4>
                    <p>${appliance.power}W - ${appliance.usage} hours</p>
                </div>
                <div class="appliance-usage">
                    <span>${(appliance.power * appliance.usage / 1000).toFixed(2)} kWh</span>
                    <button onclick="app.toggleAppliance('${appliance.id}')" class="toggle-btn">
                        <i class="fas fa-${appliance.isOn ? 'pause' : 'play'}"></i>
                    </button>
                </div>
            `;
            applianceList.appendChild(applianceItem);
        });
    }

    updateAlerts() {
        const alertsList = document.getElementById('alertsList');
        if (!alertsList || !this.userData) return;

        alertsList.innerHTML = '';
        
        this.userData.energyData.alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            alertItem.innerHTML = `
                <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                    <small>${new Date(alert.timestamp).toLocaleString()}</small>
                </div>
                <button onclick="app.dismissAlert('${alert.id}')" class="dismiss-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;
            alertsList.appendChild(alertItem);
        });
    }

    getAlertIcon(type) {
        const icons = {
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle',
            success: 'check-circle'
        };
        return icons[type] || 'info-circle';
    }

    async addAppliance() {
        const name = document.getElementById('applianceName').value.trim();
        const power = parseFloat(document.getElementById('appliancePower').value);
        const usage = parseFloat(document.getElementById('applianceUsage').value);

        if (!name || !power || !usage) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        const newAppliance = {
            id: Date.now().toString(),
            name: name,
            power: power,
            usage: usage,
            isOn: false
        };

        const appliances = [...this.userData.energyData.appliances, newAppliance];
        
        const success = await this.cloudService.saveAppliances(appliances);
        if (success) {
            this.showNotification('Appliance added successfully', 'success');
            document.getElementById('addApplianceForm').reset();
        } else {
            this.showNotification('Error adding appliance', 'error');
        }
    }

    async toggleAppliance(applianceId) {
        const appliances = this.userData.energyData.appliances.map(app => {
            if (app.id === applianceId) {
                return { ...app, isOn: !app.isOn };
            }
            return app;
        });

        const success = await this.cloudService.saveAppliances(appliances);
        if (success) {
            this.showNotification('Appliance status updated', 'success');
        } else {
            this.showNotification('Error updating appliance', 'error');
        }
    }

    async dismissAlert(alertId) {
        const alerts = this.userData.energyData.alerts.filter(alert => alert.id !== alertId);
        
        const success = await this.cloudService.saveAlerts(alerts);
        if (success) {
            this.showNotification('Alert dismissed', 'success');
        } else {
            this.showNotification('Error dismissing alert', 'error');
        }
    }

    handlePeriodChange(period) {
        this.currentPeriod = parseInt(period);
        
        // Update active button
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        this.updateCharts();
    }

    initializeCharts() {
        // Usage Chart
        const usageCtx = document.getElementById('usageChart');
        if (usageCtx) {
            this.charts.usage = new Chart(usageCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Energy Usage (kWh)',
                        data: [],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Peak Hours Chart
        const peakCtx = document.getElementById('peakHoursChart');
        if (peakCtx) {
            this.charts.peak = new Chart(peakCtx, {
                type: 'bar',
                data: {
                    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                    datasets: [{
                        label: 'Usage (kWh)',
                        data: [2.1, 1.8, 2.3, 3.2, 4.1, 3.8, 4.5, 3.9],
                        backgroundColor: '#2196F3'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        if (!this.userData) return;

        // Update usage chart with historical data
        if (this.charts.usage) {
            const history = this.userData.energyData.usageHistory.slice(-this.currentPeriod);
            const labels = history.map((entry, index) => `Day ${index + 1}`);
            const data = history.map(entry => entry.usage);

            this.charts.usage.data.labels = labels;
            this.charts.usage.data.datasets[0].data = data;
            this.charts.usage.update();
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const themeIcon = document.getElementById('themeIcon');
        
        if (html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
        } else {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-moon';
        }

        // Save theme preference
        if (this.userData) {
            const settings = { ...this.userData.settings };
            settings.theme = html.getAttribute('data-theme');
            this.cloudService.saveSettings(settings);
        }
    }

    async logout() {
        await this.cloudService.signOut();
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastMessage) return;
        
        toastMessage.textContent = message;
        toast.className = `notification-toast ${type}`;
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions
function toggleTheme() {
    if (window.app) {
        window.app.toggleTheme();
    }
}

function logout() {
    if (window.app) {
        window.app.logout();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to initialize
    setTimeout(() => {
        if (window.cloudService) {
            window.app = new EcoGoApp();
        } else {
            console.error('Cloud service not available');
        }
    }, 1000);
});
