// Professional Scroll-Triggered Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0,
            rootMargin: '0px 0px -10px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addAnimationClasses();
        this.setupParallaxEffects();
        this.setupStaggeredAnimations();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('[data-animate]');
        animatableElements.forEach(el => this.observer.observe(el));
    }

    // Enhanced animation method with better timing control
    animateElement(element) {
        const animationType = element.dataset.animate;
        const delay = parseFloat(element.dataset.delay) || 0;
        const duration = parseFloat(element.dataset.duration) || 0.3;

        // Set initial state
        element.style.opacity = '0';
        element.style.visibility = 'hidden';

        // Add animation class with delay
        setTimeout(() => {
            element.classList.add('animate-in');
            element.style.visibility = 'visible';
            
            // Animate opacity smoothly
            element.style.transition = `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            element.style.opacity = '1';
            
            // Ensure element stays visible
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }, duration * 1000);
        }, delay * 1000);

        // Stop observing after animation
        this.observer.unobserve(element);
    }

    addAnimationClasses() {
        // Add data-animate attributes to key elements
        const elements = [
            { selector: '.stat-card', animation: 'fadeInUp', delay: 0.1 },
            { selector: '.chart-container', animation: 'fadeInLeft', delay: 0.2 },
            { selector: '.peak-hours-container', animation: 'fadeInRight', delay: 0.3 },
            { selector: '.top-appliances', animation: 'fadeInUp', delay: 0.4 },
            { selector: '.usage-timeline', animation: 'fadeInUp', delay: 0.5 },
            { selector: '.tracking-section', animation: 'fadeInUp', delay: 0.6 },
            { selector: '.current-usage', animation: 'fadeInUp', delay: 0.7 },
            { selector: '.alerts-section', animation: 'fadeInUp', delay: 0.8 },
            { selector: '.suggestions-section', animation: 'fadeInUp', delay: 0.9 },
            { selector: '.efficiency-section', animation: 'fadeInUp', delay: 1.0 }
        ];

        elements.forEach(({ selector, animation, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('data-animate', animation);
                element.setAttribute('data-delay', delay);
                element.setAttribute('data-duration', '0.8');
            }
        });

        // Add staggered animations to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.setAttribute('data-animate', 'fadeInUp');
            card.setAttribute('data-delay', (index * 0.1).toString());
            card.setAttribute('data-duration', '0.6');
        });

        // Add staggered animations to period buttons
        const periodButtons = document.querySelectorAll('.period-btn');
        periodButtons.forEach((btn, index) => {
            btn.setAttribute('data-animate', 'fadeInUp');
            btn.setAttribute('data-delay', (0.2 + index * 0.1).toString());
            btn.setAttribute('data-duration', '0.5');
        });
    }

    setupParallaxEffects() {
        // Parallax effect for header
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            if (header) {
                const rate = scrolled * -0.5;
                header.style.transform = `translateY(${rate}px)`;
            }
        });

        // Scroll progress indicator
        this.setupScrollProgress();
    }

    setupScrollProgress() {
        // Create scroll progress bar if it doesn't exist
        if (!document.querySelector('.scroll-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    }

    setupStaggeredAnimations() {
        // Staggered animation for timeline items
        this.observeTimelineItems();
        
        // Staggered animation for appliance items
        this.observeApplianceItems();
    }

    observeTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.setAttribute('data-animate', 'slideInLeft');
            item.setAttribute('data-delay', (index * 0.1).toString());
            item.setAttribute('data-duration', '0.6');
            this.observer.observe(item);
        });
    }

    observeApplianceItems() {
        const applianceItems = document.querySelectorAll('.appliance-item');
        applianceItems.forEach((item, index) => {
            item.setAttribute('data-animate', 'fadeInUp');
            item.setAttribute('data-delay', (index * 0.1).toString());
            item.setAttribute('data-duration', '0.5');
            this.observer.observe(item);
        });
    }

    // Method to refresh animations when new content is added
    refreshAnimations() {
        this.setupIntersectionObserver();
        this.addAnimationClasses();
        this.setupStaggeredAnimations();
    }

    // Add entrance animation to elements when they come into view
    addEntranceAnimation(element, animationType = 'fadeInUp', delay = 0) {
        element.setAttribute('data-animate', animationType);
        element.setAttribute('data-delay', delay.toString());
        element.setAttribute('data-duration', '0.8');
        
        // Observe this element
        this.observer.observe(element);
    }

    // Add exit animation when elements leave viewport
    addExitAnimation(element, animationType = 'fadeOutDown') {
        const exitObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.style.animation = `${animationType} 0.5s ease-out forwards`;
                }
            });
        }, { threshold: 0 });

        exitObserver.observe(element);
    }

    // Add scroll-triggered counter animations
    addCounterAnimation(element, targetValue, suffix = '') {
        element.setAttribute('data-animate', 'counter');
        element.setAttribute('data-suffix', suffix);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    AnimationUtils.animateCounter(element, targetValue, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    }
}

// Enhanced animation utilities
const AnimationUtils = {
    // Smooth scroll to element
    scrollToElement: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Animate counter values
    animateCounter: (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.dataset.animate === 'counter') {
                const suffix = element.dataset.suffix || '';
                element.textContent = current.toFixed(2) + suffix;
            }
        }, 16);
    },

    // Add hover animations
    addHoverEffects: () => {
        const cards = document.querySelectorAll('.stat-card, .chart-container, .tracking-section');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    },

    // Add typing effect to text
    typeWriter: (element, text, speed = 50) => {
        let i = 0;
        element.innerHTML = '';
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    },

    // Add pulse effect to elements
    addPulseEffect: (element, duration = 1000) => {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },

    // Add shake effect to elements
    addShakeEffect: (element, duration = 500) => {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },

    // Add floating effect to elements
    addFloatingEffect: (element) => {
        element.style.animation = 'float 3s ease-in-out infinite';
    },

    // Remove floating effect
    removeFloatingEffect: (element) => {
        element.style.animation = '';
    }
};

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('ecogo_theme', newTheme);
    
    // Update icon
    if (newTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.title = 'Switch to Dark Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.title = 'Switch to Light Mode';
    }
    
    // Update charts if they exist
    if (window.usageChart) {
        window.usageChart.update();
    }
    if (window.peakHoursChart) {
        window.peakHoursChart.update();
    }
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('ecogo_theme') || 'dark';
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    html.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.title = 'Switch to Dark Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.title = 'Switch to Light Mode';
    }
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    // Update toast styling based on type
    toast.className = `notification-toast ${type}`;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide toast after specified duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Notification Center Toggle
function toggleNotificationCenter() {
    const center = document.getElementById('notificationCenter');
    center.classList.toggle('show');
}

// Mark all alerts as read
function markAllRead() {
    if (window.ecoGoApp) {
        window.ecoGoApp.markAllAlertsRead();
    }
}

// Clear old alerts
function clearOldAlerts() {
    if (window.ecoGoApp) {
        window.ecoGoApp.clearOldAlerts();
    }
}

// Chart type toggle
function toggleChartType() {
    if (window.ecoGoApp) {
        window.ecoGoApp.toggleChartType();
    }
}

// Export chart data
function exportChartData() {
    if (window.ecoGoApp) {
        window.ecoGoApp.exportChartData();
    }
}

// Global function to start an appliance with countdown
function startAppliance() {
    const applianceSelect = document.getElementById('applianceSelect');
    const applianceNameInput = document.getElementById('applianceName');
    const powerRating = parseFloat(document.getElementById('powerRating').value);
    const durationHours = parseInt(document.getElementById('durationHours').value) || 0;
    const durationMinutes = parseInt(document.getElementById('durationMinutes').value) || 0;

    // Get appliance name based on selection
    let applianceName;
    if (applianceSelect.value === 'Others|0') {
        applianceName = applianceNameInput.value.trim();
        if (!applianceName) {
            alert('Please enter a custom appliance name!');
            return;
        }
    } else if (applianceSelect.value) {
        const [name] = applianceSelect.value.split('|');
        applianceName = name;
    } else {
        alert('Please select an appliance!');
        return;
    }

    // Validate inputs
    if (!powerRating || powerRating <= 0) {
        alert('Please enter a valid power rating!');
        return;
    }

    if (durationHours === 0 && durationMinutes === 0) {
        alert('Duration must be greater than 0!');
        return;
    }

    // Start the appliance
    if (window.ecoGoApp) {
        window.ecoGoApp.startAppliance(applianceName, powerRating, durationHours, durationMinutes);
    }
}

// Global function to shutdown an appliance
function shutdownAppliance(applianceId) {
    if (window.ecoGoApp) {
        window.ecoGoApp.shutdownAppliance(applianceId);
    }
}

// Global function to extend appliance time
function extendAppliance(applianceId) {
    if (window.ecoGoApp) {
        window.ecoGoApp.extendAppliance(applianceId);
    }
}

// Global function to force stop an appliance
function forceStopAppliance(applianceId) {
    if (window.ecoGoApp) {
        window.ecoGoApp.forceStopAppliance(applianceId);
    }
}

// Global function to update power rating based on appliance selection
function updatePowerRating() {
    const applianceSelect = document.getElementById('applianceSelect');
    const powerRatingInput = document.getElementById('powerRating');
    const customApplianceGroup = document.getElementById('customApplianceGroup');
    const applianceNameInput = document.getElementById('applianceName');
    
    const selectedValue = applianceSelect.value;
    
    if (selectedValue === 'Others|0') {
        // Show custom appliance input and make power rating editable
        customApplianceGroup.style.display = 'block';
        powerRatingInput.readOnly = false;
        powerRatingInput.value = '';
        powerRatingInput.placeholder = 'Enter power rating in watts';
        applianceNameInput.required = true;
    } else if (selectedValue) {
        // Hide custom appliance input and set power rating
        customApplianceGroup.style.display = 'none';
        powerRatingInput.readOnly = true;
        const [, powerRating] = selectedValue.split('|');
        powerRatingInput.value = powerRating;
        applianceNameInput.required = false;
    } else {
        // No selection
        customApplianceGroup.style.display = 'none';
        powerRatingInput.readOnly = true;
        powerRatingInput.value = '';
        applianceNameInput.required = false;
    }
}

// EcoGo Energy Monitoring App
class EcoGoApp {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.checkAuthentication();
        
        this.appliances = [];
        this.alerts = [];
        this.persistentAlerts = [];
        this.suggestions = [];
        this.currentUsage = [];
        this.electricityRate = 6.5; // ₹6.5 per kWh (Indian standard)
        this.selectedPeriod = 7; // Default to 7 days
        this.activeAppliances = []; // Track active appliances with countdowns
        this.countdownTimers = {}; // Store countdown timer intervals
        this.autoShutdownTimers = {}; // Store auto-shutdown timers
        
        // Enhanced features
        this.chartType = 'bar'; // 'bar' or 'line'
        this.usageChart = null;
        this.peakHoursChart = null;
        this.dailyGoal = 15; // kWh daily goal
        this.efficiencyScore = 85;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.cleanupPersistentAlerts();
        this.updateDashboard();
        this.updateHistoricalData();
        this.startSmartPlugSimulation();
        this.startPeriodicUpdates();
        this.generateAlerts();
        this.generateSuggestions();
        this.updateCurrentUsage();
        this.updateApplianceIntelligence();
        
        // Initialize enhanced charts quickly after first paint
        setTimeout(() => {
            this.createPeakHoursChart();
        }, 200);
    }

    checkAuthentication() {
        if (!this.currentUser) {
            // Redirect to login page if not authenticated
            window.location.href = 'login.html';
            return;
        }
        
        // Display user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name;
        }
    }

    getCurrentUser() {
        const user = localStorage.getItem('ecogo_user') || sessionStorage.getItem('ecogo_user');
        return user ? JSON.parse(user) : null;
    }

    setupEventListeners() {
        // Manual tracking form
        const form = document.getElementById('manualTrackingForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualUsage();
        });

        // Period selector buttons
        const periodButtons = document.querySelectorAll('.period-btn');
        periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                periodButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                // Update selected period
                this.selectedPeriod = parseInt(e.target.dataset.period);
                this.updateHistoricalData();
            });
        });

        // Set default times for form
        this.setDefaultTimes();
    }

    setDefaultTimes() {
        const now = new Date();
        
        // Set default date to today
        document.getElementById('usageDate').value = now.toISOString().split('T')[0];
        
        // Set default start time to current time
        document.getElementById('startTime').value = now.toTimeString().slice(0, 5);
        
        // Duration defaults to 1 hour
        document.getElementById('durationHours').value = 1;
        document.getElementById('durationMinutes').value = 0;
    }

    formatDateTimeLocal(date) {
        return date.toISOString().slice(0, 16);
    }

    addManualUsage() {
        const applianceSelect = document.getElementById('applianceSelect');
        const applianceNameInput = document.getElementById('applianceName');
        const powerRating = parseFloat(document.getElementById('powerRating').value);
        const usageDate = document.getElementById('usageDate').value;
        const startTime = document.getElementById('startTime').value;
        const durationHours = parseInt(document.getElementById('durationHours').value) || 0;
        const durationMinutes = parseInt(document.getElementById('durationMinutes').value) || 0;

        // Get appliance name based on selection
        let applianceName;
        if (applianceSelect.value === 'Others|0') {
            applianceName = applianceNameInput.value.trim();
            if (!applianceName) {
                this.showNotification('Please enter a custom appliance name!', 'error');
                return;
            }
        } else if (applianceSelect.value) {
            const [name] = applianceSelect.value.split('|');
            applianceName = name;
        } else {
            this.showNotification('Please select an appliance!', 'error');
            return;
        }

        // Validate inputs
        if (!powerRating || powerRating <= 0) {
            this.showNotification('Please enter a valid power rating!', 'error');
            return;
        }

        if (durationHours === 0 && durationMinutes === 0) {
            this.showNotification('Duration must be greater than 0!', 'error');
            return;
        }

        // Calculate total duration in hours
        const totalDuration = durationHours + (durationMinutes / 60);
        
        // Create start datetime by combining date and time
        const startDateTime = new Date(`${usageDate}T${startTime}`);
        
        // Calculate end time
        const endDateTime = new Date(startDateTime.getTime() + (totalDuration * 60 * 60 * 1000));

        const energyUsed = (powerRating * totalDuration) / 1000; // kWh
        const cost = energyUsed * this.electricityRate;

        const usage = {
            id: Date.now(),
            name: applianceName,
            powerRating: powerRating,
            startTime: startDateTime,
            endTime: endDateTime,
            duration: totalDuration,
            energyUsed: energyUsed,
            cost: cost,
            type: 'manual',
            isActive: false
        };

        this.appliances.push(usage);
        this.saveUserData();
        this.updateDashboard();
        this.updateHistoricalData();
        this.updateCurrentUsage();
        this.generateAlerts();
        this.generateSuggestions();
        this.showNotification('Appliance usage added successfully!', 'success');
        
        // Reset form
        document.getElementById('manualTrackingForm').reset();
        this.setDefaultTimes();
        
        // Reset dropdown state
        updatePowerRating();
    }

    loadUserData() {
        // Load user-specific data from localStorage
        const userDataKey = `ecogo_user_data_${this.currentUser.id}`;
        const savedData = localStorage.getItem(userDataKey);
        
        if (savedData) {
            const userData = JSON.parse(savedData);
            this.appliances = userData.appliances || [];
            this.alerts = userData.alerts || [];
            this.persistentAlerts = userData.persistentAlerts || [];
            this.suggestions = userData.suggestions || [];
            this.currentUsage = userData.currentUsage || [];
            this.electricityRate = userData.electricityRate || 6.5;
            this.activeAppliances = userData.activeAppliances || [];
            
            // Convert date strings back to Date objects
            this.appliances.forEach(appliance => {
                if (appliance.startTime) appliance.startTime = new Date(appliance.startTime);
                if (appliance.endTime) appliance.endTime = new Date(appliance.endTime);
            });

            // Convert active appliances date strings and restart countdown timers
            this.activeAppliances.forEach(appliance => {
                if (appliance.startTime) appliance.startTime = new Date(appliance.startTime);
                if (appliance.endTime) appliance.endTime = new Date(appliance.endTime);
                
                // Recalculate remaining time
                const now = new Date();
                appliance.remainingTime = Math.max(0, appliance.endTime.getTime() - now.getTime());
                
                // Restart countdown if still active
                if (appliance.remainingTime > 0) {
                    this.startCountdownTimer(appliance.id);
                } else {
                    // Appliance has expired - auto-shutdown it
                    this.autoShutdownAppliance(appliance.id);
                }
            });
            
            console.log(`Loaded existing data for user ${this.currentUser.name}: ${this.appliances.length} appliances`);
        } else {
            // New user - start with completely empty data (zero-based)
            this.appliances = [];
            this.alerts = [];
            this.persistentAlerts = [];
            this.suggestions = [];
            this.currentUsage = [];
            this.electricityRate = 6.5; // Indian standard rate
            this.activeAppliances = [];
            
            // Save the initial empty data for the new user
            this.saveUserData();
            
            console.log(`New user ${this.currentUser.name} initialized with zero data`);
        }
    }



    startSmartPlugSimulation() {
        // Simulate real-time smart plug data updates
        setInterval(() => {
            this.updateSmartPlugData();
        }, 30000); // Update every 30 seconds
    }

    startPeriodicUpdates() {
        // Update historical data and charts every 2 minutes
        setInterval(() => {
            this.updateHistoricalData();
            this.generateProactiveNotifications();
        }, 120000); // Update every 2 minutes
    }

    updateSmartPlugData() {
        this.appliances.forEach(appliance => {
            if (appliance.type === 'smart-plug' && appliance.isActive) {
                // Simulate power fluctuations
                const powerVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
                appliance.powerRating = Math.max(0, appliance.powerRating * (1 + powerVariation));
                
                // Update duration and energy usage
                const now = new Date();
                appliance.duration = (now - appliance.startTime) / (1000 * 60 * 60);
                appliance.energyUsed = (appliance.powerRating * appliance.duration) / 1000;
                appliance.cost = appliance.energyUsed * this.electricityRate;
            }
        });

        this.saveUserData();
        this.updateDashboard();
        this.updateHistoricalData();
        this.updateCurrentUsage();
        this.generateAlerts();
    }

    saveUserData() {
        const userDataKey = `ecogo_user_data_${this.currentUser.id}`;
        const userData = {
            appliances: this.appliances,
            alerts: this.alerts,
            persistentAlerts: this.persistentAlerts,
            suggestions: this.suggestions,
            currentUsage: this.currentUsage,
            electricityRate: this.electricityRate,
            activeAppliances: this.activeAppliances,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userDataKey, JSON.stringify(userData));
    }

    updateDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalEnergy = 0;
        let totalCost = 0;
        // Include both ephemeral and persistent alerts (filter persistent by expiry)
        const nowTs = Date.now();
        const persistentActiveCount = (this.persistentAlerts || []).filter(a => !a.expiresAt || new Date(a.expiresAt).getTime() > nowTs).length;
        const activeAlerts = (this.alerts || []).filter(alert => alert.isActive).length + persistentActiveCount;

        this.appliances.forEach(appliance => {
            if (appliance.startTime >= today) {
                totalEnergy += appliance.energyUsed;
                totalCost += appliance.cost;
            }
        });

        document.getElementById('todayUsage').textContent = `${totalEnergy.toFixed(2)} kWh`;
        document.getElementById('todayCost').textContent = `₹${totalCost.toFixed(2)}`;
        document.getElementById('activeAlerts').textContent = activeAlerts;

        // Update goal progress
        const goalProgress = Math.min(100, (totalEnergy / this.dailyGoal) * 100);
        document.getElementById('goalProgress').textContent = `${goalProgress.toFixed(0)}%`;
        
        // Update goal progress bar color based on usage
        const goalElement = document.getElementById('goalProgress');
        if (goalElement) {
            if (goalProgress >= 90) {
                goalElement.style.color = '#ff6b6b'; // Red when close to goal
            } else if (goalProgress >= 70) {
                goalElement.style.color = '#ffc107'; // Yellow when moderate
            } else {
                goalElement.style.color = '#00ff88'; // Green when good
            }
        }
    }

    updateHistoricalData() {
        const periodData = this.getPeriodData();
        this.updateHistoricalStats(periodData);
        this.createUsageChart(periodData); // Use enhanced Chart.js
        this.updateTopAppliances(periodData);
        this.updateUsageTimeline(periodData);
    }

    getPeriodData() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - this.selectedPeriod);

        const periodAppliances = this.appliances.filter(appliance => {
            const applianceDate = new Date(appliance.startTime);
            return applianceDate >= startDate && applianceDate <= endDate;
        });

        // Group by day for chart data
        const dailyData = {};
        for (let i = 0; i < this.selectedPeriod; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = {
                energy: 0,
                cost: 0,
                count: 0
            };
        }

        periodAppliances.forEach(appliance => {
            const dateKey = new Date(appliance.startTime).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].energy += appliance.energyUsed;
                dailyData[dateKey].cost += appliance.cost;
                dailyData[dateKey].count += 1;
            }
        });

        return {
            appliances: periodAppliances,
            dailyData: dailyData,
            totalEnergy: periodAppliances.reduce((sum, app) => sum + app.energyUsed, 0),
            totalCost: periodAppliances.reduce((sum, app) => sum + app.cost, 0),
            usageDays: Object.values(dailyData).filter(day => day.energy > 0).length
        };
    }

    updateHistoricalStats(periodData) {
        const dailyAverage = periodData.usageDays > 0 ? periodData.totalEnergy / periodData.usageDays : 0;

        document.getElementById('periodEnergy').textContent = `${periodData.totalEnergy.toFixed(2)} kWh`;
        document.getElementById('periodCost').textContent = `₹${periodData.totalCost.toFixed(2)}`;
        document.getElementById('dailyAverage').textContent = `${dailyAverage.toFixed(2)} kWh`;
        document.getElementById('usageDays').textContent = periodData.usageDays;
    }

    updateUsageChart(periodData) {
        const canvas = document.getElementById('usageChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const dailyData = periodData.dailyData;
        const dates = Object.keys(dailyData).sort();
        const energyValues = dates.map(date => dailyData[date].energy);
        
        if (energyValues.every(val => val === 0)) {
            // Show "No data" message
            ctx.fillStyle = '#666';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No usage data for this period', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxEnergy = Math.max(...energyValues);
        const chartWidth = canvas.width - 60;
        const chartHeight = canvas.height - 60;
        const barWidth = chartWidth / dates.length;
        const maxBarHeight = chartHeight * 0.8;

        // Draw bars
        dates.forEach((date, index) => {
            const energy = dailyData[date].energy;
            const barHeight = maxEnergy > 0 ? (energy / maxEnergy) * maxBarHeight : 0;
            const x = 30 + index * barWidth;
            const y = canvas.height - 30 - barHeight;

            // Bar color based on usage
            const intensity = maxEnergy > 0 ? energy / maxEnergy : 0;
            ctx.fillStyle = `rgba(102, 126, 234, ${0.3 + intensity * 0.7})`;
            
            ctx.fillRect(x, y, barWidth - 4, barHeight);

            // Draw value on top
            if (energy > 0) {
                ctx.fillStyle = '#333';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`${energy.toFixed(1)}`, x + barWidth / 2, y - 5);
            }

            // Draw date label
            const dateObj = new Date(date);
            const dayLabel = dateObj.getDate();
            ctx.fillStyle = '#666';
            ctx.font = '11px Inter';
            ctx.fillText(dayLabel.toString(), x + barWidth / 2, canvas.height - 10);
        });

        // Draw axis labels
        ctx.fillStyle = '#333';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Energy Usage (kWh)', canvas.width / 2, 20);
    }

    // Enhanced Chart.js Implementation
    createUsageChart(periodData) {
        const ctx = document.getElementById('usageChart').getContext('2d');
        
        if (this.usageChart) {
            this.usageChart.destroy();
        }
        
        const dailyData = periodData.dailyData;
        const dates = Object.keys(dailyData).sort();
        const energyValues = dates.map(date => dailyData[date].energy);
        
        this.usageChart = new Chart(ctx, {
            type: this.chartType,
            data: {
                labels: dates.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Energy Usage (kWh)',
                    data: energyValues,
                    backgroundColor: 'rgba(0, 255, 136, 0.6)',
                    borderColor: 'rgba(0, 255, 136, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                        }
                    }
                }
            }
        });
    }

    // Peak Hours Analysis
    createPeakHoursChart() {
        const ctx = document.getElementById('peakHoursChart').getContext('2d');
        
        if (this.peakHoursChart) {
            this.peakHoursChart.destroy();
        }
        
        // Generate 24-hour usage data (simulated for now)
        const hours = Array.from({length: 24}, (_, i) => i);
        const usageData = hours.map(hour => {
            // Simulate peak usage during morning (7-9) and evening (18-22)
            if (hour >= 7 && hour <= 9) return Math.random() * 2 + 1;
            if (hour >= 18 && hour <= 22) return Math.random() * 3 + 2;
            if (hour >= 23 || hour <= 6) return Math.random() * 0.5;
            return Math.random() * 1 + 0.5;
        });
        
        this.peakHoursChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{
                    label: 'Hourly Usage (kWh)',
                    data: usageData,
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    borderColor: 'rgba(0, 212, 255, 1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                        }
                    }
                }
            }
        });
        
        // Update peak insights
        this.updatePeakInsights(usageData);
    }

    updatePeakInsights(usageData) {
        const maxIndex = usageData.indexOf(Math.max(...usageData));
        const minIndex = usageData.indexOf(Math.min(...usageData));
        
        document.getElementById('peakHour').textContent = `${maxIndex}:00`;
        document.getElementById('offPeakHour').textContent = `${minIndex}:00`;
    }

    // Chart Controls
    toggleChartType() {
        this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
        if (this.usageChart) {
            this.usageChart.config.type = this.chartType;
            this.usageChart.update();
        }
        showNotification(`Switched to ${this.chartType} chart`, 'info');
    }

    exportChartData() {
        const periodData = this.getPeriodData();
        const dailyData = periodData.dailyData;
        const dates = Object.keys(dailyData).sort();
        
        let csvContent = 'Date,Energy (kWh),Cost (₹)\n';
        dates.forEach(date => {
            const data = dailyData[date];
            csvContent += `${date},${data.energy.toFixed(2)},${data.cost.toFixed(2)}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecogo_usage_${this.selectedPeriod}_days.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
    }

    updateTopAppliances(periodData) {
        const applianceUsage = {};
        
        periodData.appliances.forEach(appliance => {
            if (!applianceUsage[appliance.name]) {
                applianceUsage[appliance.name] = {
                    energy: 0,
                    cost: 0,
                    count: 0
                };
            }
            applianceUsage[appliance.name].energy += appliance.energyUsed;
            applianceUsage[appliance.name].cost += appliance.cost;
            applianceUsage[appliance.name].count += 1;
        });

        const topAppliances = Object.entries(applianceUsage)
            .sort(([,a], [,b]) => b.energy - a.energy)
            .slice(0, 5);

        const container = document.getElementById('topAppliancesList');
        container.innerHTML = '';

        if (topAppliances.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No appliance usage data for this period</p>';
            return;
        }

        topAppliances.forEach(([name, data]) => {
            const applianceDiv = document.createElement('div');
            applianceDiv.className = 'appliance-item';
            
            const icon = this.getApplianceIcon(name);
            const color = this.getApplianceIconColor(name);
            
            applianceDiv.innerHTML = `
                <div class="appliance-info">
                    <div class="appliance-icon" style="background: ${color}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="appliance-details">
                        <h4>${name}</h4>
                        <p>Used ${data.count} time${data.count !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <div class="appliance-usage">
                    <div class="usage-value">${data.energy.toFixed(2)} kWh</div>
                    <div class="usage-label">₹${data.cost.toFixed(2)}</div>
                </div>
            `;
            
            container.appendChild(applianceDiv);
        });
    }

    updateUsageTimeline(periodData) {
        const timelineContainer = document.getElementById('usageTimeline');
        timelineContainer.innerHTML = '';

        const recentAppliances = periodData.appliances
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
            .slice(0, 10);

        if (recentAppliances.length === 0) {
            timelineContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No recent usage activity</p>';
            return;
        }

        recentAppliances.forEach(appliance => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            const icon = this.getApplianceIcon(appliance.name);
            const color = this.getApplianceIconColor(appliance.name);
            const startTime = new Date(appliance.startTime);
            const endTime = new Date(appliance.endTime);
            const duration = appliance.duration;
            
            timelineItem.innerHTML = `
                <div class="timeline-icon" style="background: ${color}">
                    <i class="${icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4 class="timeline-title">${appliance.name}</h4>
                        <span class="timeline-time">${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div class="timeline-details">
                        Duration: ${duration.toFixed(1)} hours | Power: ${appliance.powerRating}W
                    </div>
                    <div class="timeline-usage">
                        ${appliance.energyUsed.toFixed(2)} kWh • ₹${appliance.cost.toFixed(2)}
                    </div>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });
    }

    updateCurrentUsage() {
        const usageList = document.getElementById('currentUsageList');
        usageList.innerHTML = '';

        const activeAppliances = this.activeAppliances;

        if (activeAppliances.length === 0) {
            usageList.innerHTML = '<div class="usage-item"><p>No appliances currently running</p></div>';
            return;
        }

        activeAppliances.forEach(appliance => {
            const usageItem = document.createElement('div');
            usageItem.className = 'usage-item';

            const icon = this.getApplianceIcon(appliance.name);
            const iconColor = this.getApplianceIconColor(appliance.name);
            const countdownClass = this.getCountdownClass(appliance.remainingTime);

            usageItem.innerHTML = `
                <div class="usage-info">
                    <div class="usage-icon" style="background: ${iconColor}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="usage-details">
                        <h4>${appliance.name}</h4>
                        <p>Started at ${appliance.startTime.toLocaleTimeString()}</p>
                        <div class="appliance-status">
                            <div class="status-indicator"></div>
                            <span class="status-text">Active</span>
                        </div>
                    </div>
                </div>
                <div class="usage-stats">
                    <div class="power">${appliance.powerRating.toFixed(0)}W</div>
                    <div class="duration">${appliance.duration.toFixed(1)}h</div>
                </div>
                <div class="countdown-timer ${countdownClass}">
                    <i class="fas fa-clock countdown-icon"></i>
                    <span class="countdown-text">Time Remaining:</span>
                    <span class="countdown-time">${this.formatTimeRemaining(appliance.remainingTime)}</span>
                </div>
                <div class="usage-actions">
                    <button class="btn btn-danger btn-sm" onclick="forceStopAppliance('${appliance.id}')" title="Force Stop">
                        <i class="fas fa-stop"></i> Force Stop
                    </button>
                </div>
            `;

            usageList.appendChild(usageItem);
        });
    }

    getApplianceIcon(name) {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('ac') || nameLower.includes('air')) return 'fas fa-snowflake';
        if (nameLower.includes('geyser') || nameLower.includes('water heater')) return 'fas fa-fire';
        if (nameLower.includes('mixer') || nameLower.includes('grinder')) return 'fas fa-blender';
        if (nameLower.includes('tv')) return 'fas fa-tv';
        if (nameLower.includes('light') || nameLower.includes('lamp')) return 'fas fa-lightbulb';
        if (nameLower.includes('fan')) return 'fas fa-fan';
        if (nameLower.includes('heater')) return 'fas fa-fire';
        if (nameLower.includes('refrigerator') || nameLower.includes('fridge')) return 'fas fa-box';
        if (nameLower.includes('washing') || nameLower.includes('dryer')) return 'fas fa-tshirt';
        if (nameLower.includes('dishwasher')) return 'fas fa-utensils';
        if (nameLower.includes('microwave')) return 'fas fa-microchip';
        if (nameLower.includes('oven') || nameLower.includes('stove')) return 'fas fa-fire-burner';
        if (nameLower.includes('laptop') || nameLower.includes('computer')) return 'fas fa-laptop';
        return 'fas fa-plug';
    }

    getApplianceIconColor(name) {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('ac') || nameLower.includes('air')) return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        if (nameLower.includes('geyser') || nameLower.includes('water heater')) return 'linear-gradient(135deg, #ef4444, #dc2626)';
        if (nameLower.includes('mixer') || nameLower.includes('grinder')) return 'linear-gradient(135deg, #f97316, #ea580c)';
        if (nameLower.includes('tv')) return 'linear-gradient(135deg, #667eea, #764ba2)';
        if (nameLower.includes('light') || nameLower.includes('lamp')) return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
        if (nameLower.includes('fan')) return 'linear-gradient(135deg, #10b981, #059669)';
        if (nameLower.includes('heater')) return 'linear-gradient(135deg, #ef4444, #dc2626)';
        if (nameLower.includes('refrigerator') || nameLower.includes('fridge')) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
        if (nameLower.includes('washing') || nameLower.includes('dryer')) return 'linear-gradient(135deg, #06b6d4, #0891b2)';
        if (nameLower.includes('dishwasher')) return 'linear-gradient(135deg, #84cc16, #65a30d)';
        if (nameLower.includes('microwave')) return 'linear-gradient(135deg, #f97316, #ea580c)';
        if (nameLower.includes('oven') || nameLower.includes('stove')) return 'linear-gradient(135deg, #ec4899, #db2777)';
        if (nameLower.includes('laptop') || nameLower.includes('computer')) return 'linear-gradient(135deg, #6366f1, #4f46e5)';
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }

    generateAlerts() {
        this.alerts = [];

        // Check for appliances running too long
        this.appliances.forEach(appliance => {
            if (appliance.isActive && appliance.duration > 6) {
                this.alerts.push({
                    id: Date.now() + Math.random(),
                    type: 'warning',
                    title: 'Appliance Running Too Long',
                    message: `${appliance.name} has been running for ${appliance.duration.toFixed(1)} hours. Consider turning it off to save energy.`,
                    isActive: true,
                    appliance: appliance.name,
                    createdAt: new Date().toISOString(),
                    isRead: false
                });
            }

            // Check for high power consumption (Indian standards)
            if (appliance.powerRating > 3000) {
                this.alerts.push({
                    id: Date.now() + Math.random(),
                    type: 'danger',
                    title: 'High Power Consumption',
                    message: `${appliance.name} is consuming ${appliance.powerRating.toFixed(0)}W, which is unusually high.`,
                    isActive: true,
                    appliance: appliance.name,
                    createdAt: new Date().toISOString(),
                    isRead: false
                });
            }
        });

        // Check for unusual usage patterns (Indian household standards)
        const totalPower = this.appliances
            .filter(appliance => appliance.isActive)
            .reduce((sum, appliance) => sum + appliance.powerRating, 0);

        if (totalPower > 8000) {
            this.alerts.push({
                id: Date.now() + Math.random(),
                type: 'danger',
                title: 'High Total Power Usage',
                message: `Total power consumption is ${totalPower.toFixed(0)}W. Consider turning off unnecessary appliances.`,
                isActive: true,
                createdAt: new Date().toISOString(),
                isRead: false
            });
        }

        this.saveUserData();
        this.updateAlertsDisplay();
    }

    updateAlertsDisplay() {
        const alertsContainer = document.getElementById('alertsContainer');
        alertsContainer.innerHTML = '';

        // Purge expired persistent alerts
        this.cleanupPersistentAlerts();

        const activePersistent = (this.persistentAlerts || []).slice();
        const combinedAlerts = [...(this.alerts || []), ...activePersistent];

        if (combinedAlerts.length === 0) {
            alertsContainer.innerHTML = '<div class="alert-item info"><div class="alert-icon"><i class="fas fa-check-circle"></i></div><div class="alert-content"><h4>All Good!</h4><p>No alerts at the moment. Your energy usage looks normal.</p></div></div>';
            return;
        }

        combinedAlerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;

            const icon = alert.type === 'danger' ? 'fas fa-exclamation-triangle' : 
                        alert.type === 'warning' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';

            alertItem.innerHTML = `
                <div class="alert-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                </div>
            `;

            alertsContainer.appendChild(alertItem);
        });
    }

    cleanupPersistentAlerts() {
        const now = Date.now();
        const before = (this.persistentAlerts || []).length;
        this.persistentAlerts = (this.persistentAlerts || []).filter(a => !a.expiresAt || new Date(a.expiresAt).getTime() > now);
        if (this.persistentAlerts.length !== before) {
            this.saveUserData();
        }
    }

    generateSuggestions() {
        this.suggestions = [];

        // Analyze usage patterns and generate suggestions
        const totalEnergy = this.appliances.reduce((sum, appliance) => sum + appliance.energyUsed, 0);
        const activeAppliances = this.appliances.filter(appliance => appliance.isActive);

        // Suggestion based on total energy usage (Indian standards)
        if (totalEnergy > 20) {
            this.suggestions.push({
                id: Date.now() + Math.random(),
                title: 'High Daily Energy Usage',
                message: `You've used ${totalEnergy.toFixed(2)} kWh today. Try using energy-efficient appliances and turning off unused devices.`
            });
        }

        // Suggestion based on number of active appliances
        if (activeAppliances.length > 4) {
            this.suggestions.push({
                id: Date.now() + Math.random(),
                title: 'Multiple Appliances Running',
                message: `You have ${activeAppliances.length} appliances running. Consider turning off appliances you're not actively using.`
            });
        }

        // Specific appliance suggestions for Indian households
        this.appliances.forEach(appliance => {
            if (appliance.name.toLowerCase().includes('ac') && appliance.duration > 4) {
                this.suggestions.push({
                    id: Date.now() + Math.random(),
                    title: 'AC Usage Optimization',
                    message: `${appliance.name} has been on for ${appliance.duration.toFixed(1)} hours. Set temperature to 24°C for optimal efficiency and comfort.`
                });
            }

            if (appliance.name.toLowerCase().includes('geyser') && appliance.duration > 1) {
                this.suggestions.push({
                    id: Date.now() + Math.random(),
                    title: 'Geyser Usage Tip',
                    message: `${appliance.name} has been running for ${appliance.duration.toFixed(1)} hours. Turn off geyser after use to save energy.`
                });
            }

            if (appliance.name.toLowerCase().includes('fan') && appliance.duration > 8) {
                this.suggestions.push({
                    id: Date.now() + Math.random(),
                    title: 'Fan Usage Reminder',
                    message: `${appliance.name} has been running for ${appliance.duration.toFixed(1)} hours. Consider using natural ventilation when possible.`
                });
            }

            if (appliance.name.toLowerCase().includes('tv') && appliance.duration > 4) {
                this.suggestions.push({
                    id: Date.now() + Math.random(),
                    title: 'TV Usage Reminder',
                    message: `${appliance.name} has been running for ${appliance.duration.toFixed(1)} hours. Remember to turn off the TV when not watching.`
                });
            }
        });

        // General energy-saving tips for Indian households
        this.suggestions.push({
            id: Date.now() + Math.random(),
            title: 'Energy Saving Tip',
            message: 'Use LED bulbs instead of CFL or incandescent bulbs. They consume 80% less energy and last longer.'
        });

        this.suggestions.push({
            id: Date.now() + Math.random(),
            title: 'Indian Household Tip',
            message: 'Use pressure cookers for cooking as they reduce cooking time and energy consumption by 50-70%.'
        });

        this.saveUserData();
        this.updateSuggestionsDisplay();
    }

    updateSuggestionsDisplay() {
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        suggestionsContainer.innerHTML = '';

        // Show only the first 5 suggestions to avoid overwhelming the user
        const displaySuggestions = this.suggestions.slice(0, 5);

        displaySuggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            suggestionItem.innerHTML = `
                <div class="suggestion-icon">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="suggestion-content">
                    <h4>${suggestion.title}</h4>
                    <p>${suggestion.message}</p>
                </div>
            `;

            suggestionsContainer.appendChild(suggestionItem);
        });
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        // Update toast styling based on type
        toast.className = `notification-toast ${type}`;
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    generateProactiveNotifications() {
        // Generate proactive notifications based on usage patterns
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get today's usage
        const todayUsage = this.appliances.filter(appliance => {
            const applianceDate = new Date(appliance.startTime);
            return applianceDate >= today;
        });
        
        const totalEnergy = todayUsage.reduce((sum, app) => sum + app.energyUsed, 0);
        const totalCost = todayUsage.reduce((sum, app) => sum + app.cost, 0);
        
        // Check for high usage alerts
        if (totalEnergy > 15) { // More than 15 kWh in a day
            this.showNotification(`High energy usage today: ${totalEnergy.toFixed(2)} kWh (₹${totalCost.toFixed(2)})`, 'warning');
        }
        
        // Check for cost savings opportunities
        if (totalCost > 100) { // More than ₹100 in a day
            this.showNotification(`Today's energy cost: ₹${totalCost.toFixed(2)}. Consider using energy-efficient appliances!`, 'info');
        }
        
        // Check for active appliances
        if (this.activeAppliances.length > 0) {
            const activeCount = this.activeAppliances.length;
            this.showNotification(`${activeCount} appliance(s) currently running. Monitor their usage!`, 'info');
        }
        
        // Check for unusual usage patterns
        const recentUsage = this.appliances.filter(appliance => {
            const applianceDate = new Date(appliance.startTime);
            const hoursAgo = (today - applianceDate) / (1000 * 60 * 60);
            return hoursAgo <= 24;
        });
        
        if (recentUsage.length > 5) {
            this.showNotification(`High appliance activity detected. Consider consolidating usage for better efficiency.`, 'info');
        }
        
        // Check for potential savings
        const avgDailyUsage = this.getAverageDailyUsage();
        if (totalEnergy > avgDailyUsage * 1.5) {
            this.showNotification(`Today's usage is 50% higher than average. Check for unnecessary appliances!`, 'warning');
        }
    }

    getAverageDailyUsage() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Last 30 days
        
        const periodAppliances = this.appliances.filter(appliance => {
            const applianceDate = new Date(appliance.startTime);
            return applianceDate >= startDate && applianceDate <= endDate;
        });
        
        if (periodAppliances.length === 0) return 0;
        
        const totalEnergy = periodAppliances.reduce((sum, app) => sum + app.energyUsed, 0);
        return totalEnergy / 30; // Average per day
    }

    startAppliance(name, powerRating, durationHours, durationMinutes) {
        const totalDuration = durationHours + (durationMinutes / 60);
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (totalDuration * 60 * 60 * 1000));
        
        const activeAppliance = {
            id: Date.now().toString(),
            name: name,
            powerRating: powerRating,
            startTime: startTime,
            endTime: endTime,
            duration: totalDuration,
            remainingTime: totalDuration * 60 * 60 * 1000, // in milliseconds
            isActive: true,
            type: 'active'
        };

        this.activeAppliances.push(activeAppliance);
        this.startCountdownTimer(activeAppliance.id);
        this.saveUserData();
        this.updateCurrentUsage();
        this.showNotification(`${name} started successfully!`, 'success');
    }

    startCountdownTimer(applianceId) {
        const appliance = this.activeAppliances.find(app => app.id === applianceId);
        if (!appliance) return;

        this.countdownTimers[applianceId] = setInterval(() => {
            const now = new Date();
            const remainingTime = appliance.endTime.getTime() - now.getTime();
            
            if (remainingTime <= 0) {
                // Time's up - show shutdown alert
                this.showShutdownAlert(appliance);
                this.stopCountdownTimer(applianceId);
            } else {
                // Update remaining time
                appliance.remainingTime = remainingTime;
                this.updateCurrentUsage();
            }
        }, 1000); // Update every second
    }

    stopCountdownTimer(applianceId) {
        if (this.countdownTimers[applianceId]) {
            clearInterval(this.countdownTimers[applianceId]);
            delete this.countdownTimers[applianceId];
        }
    }

    showShutdownAlert(appliance) {
        const shutdownAlertsContainer = document.getElementById('shutdownAlerts');
        const alertId = `shutdown-${appliance.id}`;
        
        // Check if alert already exists
        if (document.getElementById(alertId)) return;

        const alertDiv = document.createElement('div');
        alertDiv.id = alertId;
        alertDiv.className = 'shutdown-alert';
        
        alertDiv.innerHTML = `
            <div class="shutdown-alert-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="shutdown-alert-content">
                <h4>Time to Shutdown!</h4>
                <p>${appliance.name} has been running for ${appliance.duration.toFixed(1)} hours. It's time to turn it off to save energy.</p>
            </div>
            <div class="shutdown-alert-actions">
                <button class="shutdown-btn" onclick="shutdownAppliance('${appliance.id}')">
                    <i class="fas fa-power-off"></i> Shutdown
                </button>
                <button class="shutdown-btn" onclick="extendAppliance('${appliance.id}')">
                    <i class="fas fa-clock"></i> Extend 30min
                </button>
            </div>
        `;

        shutdownAlertsContainer.appendChild(alertDiv);

        // Auto-shutdown after 2 minutes if user doesn't respond
        this.autoShutdownTimers[appliance.id] = setTimeout(() => {
            // Check if appliance is still active after 2 minutes
            const isStillActive = this.activeAppliances.some(app => app.id === appliance.id);
            if (isStillActive) {
                // Automatically shut down the appliance
                this.autoShutdownAppliance(appliance.id);
                
                // Remove the shutdown alert
                if (document.getElementById(alertId)) {
                    document.getElementById(alertId).remove();
                }
                
                // Add a persistent alert that lasts for 12 hours
                const twelveHoursMs = 12 * 60 * 60 * 1000;
                const now = Date.now();
                this.persistentAlerts.push({
                    id: Date.now() + Math.random(),
                    type: 'danger',
                    title: 'Auto-Shutdown Alert',
                    message: `${appliance.name} was automatically shut down after 2 minutes of inactivity to save energy.`,
                    isActive: true,
                    appliance: appliance.name,
                    createdAt: new Date(now).toISOString(),
                    expiresAt: new Date(now + twelveHoursMs).toISOString(),
                    isRead: false
                });
                
                this.saveUserData();
                this.updateAlertsDisplay();
                this.updateDashboard();
                this.showNotification(`${appliance.name} was auto-shutdown to save energy!`, 'warning');
            }
        }, 2 * 60 * 1000); // 2 minutes
    }

    shutdownAppliance(applianceId) {
        const applianceIndex = this.activeAppliances.findIndex(app => app.id === applianceId);
        if (applianceIndex === -1) return;

        const appliance = this.activeAppliances[applianceIndex];
        
        // Calculate final energy usage and cost
        const actualDuration = (new Date() - appliance.startTime) / (1000 * 60 * 60);
        const energyUsed = (appliance.powerRating * actualDuration) / 1000;
        const cost = energyUsed * this.electricityRate;

        // Add to appliances history
        const usage = {
            id: Date.now(),
            name: appliance.name,
            powerRating: appliance.powerRating,
            startTime: appliance.startTime,
            endTime: new Date(),
            duration: actualDuration,
            energyUsed: energyUsed,
            cost: cost,
            type: 'manual',
            isActive: false
        };

        this.appliances.push(usage);
        
        // Remove from active appliances
        this.activeAppliances.splice(applianceIndex, 1);
        this.stopCountdownTimer(applianceId);
        
        // Remove shutdown alert
        const alertId = `shutdown-${applianceId}`;
        if (document.getElementById(alertId)) {
            document.getElementById(alertId).remove();
        }

        // Clear auto-shutdown timer
        if (this.autoShutdownTimers[applianceId]) {
            clearTimeout(this.autoShutdownTimers[applianceId]);
            delete this.autoShutdownTimers[applianceId];
        }

        this.saveUserData();
        this.updateDashboard();
        this.updateHistoricalData();
        this.updateCurrentUsage();
        this.showNotification(`${appliance.name} has been shut down!`, 'success');
    }

    autoShutdownAppliance(applianceId) {
        const applianceIndex = this.activeAppliances.findIndex(app => app.id === applianceId);
        if (applianceIndex === -1) return;

        const appliance = this.activeAppliances[applianceIndex];
        
        // Calculate final energy usage and cost
        const actualDuration = (new Date() - appliance.startTime) / (1000 * 60 * 60);
        const energyUsed = (appliance.powerRating * actualDuration) / 1000;
        const cost = energyUsed * this.electricityRate;

        // Add to appliances history
        const usage = {
            id: Date.now(),
            name: appliance.name,
            powerRating: appliance.powerRating,
            startTime: appliance.startTime,
            endTime: new Date(),
            duration: actualDuration,
            energyUsed: energyUsed,
            cost: cost,
            type: 'auto-shutdown',
            isActive: false
        };

        this.appliances.push(usage);
        
        // Remove from active appliances
        this.activeAppliances.splice(applianceIndex, 1);
        this.stopCountdownTimer(applianceId);
        
        // Clear auto-shutdown timer
        if (this.autoShutdownTimers[applianceId]) {
            clearTimeout(this.autoShutdownTimers[applianceId]);
            delete this.autoShutdownTimers[applianceId];
        }

        this.saveUserData();
        this.updateDashboard();
        this.updateHistoricalData();
        this.updateCurrentUsage();
    }

    extendAppliance(applianceId) {
        const appliance = this.activeAppliances.find(app => app.id === applianceId);
        if (!appliance) return;

        // Extend by 30 minutes
        const extensionTime = 30 * 60 * 1000; // 30 minutes in milliseconds
        appliance.endTime = new Date(appliance.endTime.getTime() + extensionTime);
        appliance.remainingTime += extensionTime;
        appliance.duration += 0.5; // Add 30 minutes to duration

        // Remove shutdown alert
        const alertId = `shutdown-${applianceId}`;
        if (document.getElementById(alertId)) {
            document.getElementById(alertId).remove();
        }

        // Clear auto-shutdown timer and restart countdown
        if (this.autoShutdownTimers[applianceId]) {
            clearTimeout(this.autoShutdownTimers[applianceId]);
            delete this.autoShutdownTimers[applianceId];
        }
        
        // Restart countdown timer for the extended time
        this.startCountdownTimer(applianceId);

        this.saveUserData();
        this.updateCurrentUsage();
        this.showNotification(`${appliance.name} extended by 30 minutes!`, 'info');
    }

    forceStopAppliance(applianceId) {
        const applianceIndex = this.activeAppliances.findIndex(app => app.id === applianceId);
        if (applianceIndex === -1) return;

        const appliance = this.activeAppliances[applianceIndex];
        
        // Calculate final energy usage and cost
        const actualDuration = (new Date() - appliance.startTime) / (1000 * 60 * 60);
        const energyUsed = (appliance.powerRating * actualDuration) / 1000;
        const cost = energyUsed * this.electricityRate;

        // Add to appliances history
        const usage = {
            id: Date.now(),
            name: appliance.name,
            powerRating: appliance.powerRating,
            startTime: appliance.startTime,
            endTime: new Date(),
            duration: actualDuration,
            energyUsed: energyUsed,
            cost: cost,
            type: 'manual',
            isActive: false
        };

        this.appliances.push(usage);
        
        // Remove from active appliances
        this.activeAppliances.splice(applianceIndex, 1);
        this.stopCountdownTimer(applianceId);
        
        // Remove shutdown alert if it exists
        const alertId = `shutdown-${applianceId}`;
        if (document.getElementById(alertId)) {
            document.getElementById(alertId).remove();
        }

        // Clear auto-shutdown timer
        if (this.autoShutdownTimers[applianceId]) {
            clearTimeout(this.autoShutdownTimers[applianceId]);
            delete this.autoShutdownTimers[applianceId];
        }

        this.saveUserData();
        this.updateDashboard();
        this.updateHistoricalData();
        this.updateCurrentUsage();
        this.showNotification(`${appliance.name} has been force stopped!`, 'warning');
    }

    formatTimeRemaining(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }

    getCountdownClass(remainingTime) {
        const hours = remainingTime / (1000 * 60 * 60);
        if (hours <= 0.25) return 'danger'; // Less than 15 minutes
        if (hours <= 0.5) return 'warning'; // Less than 30 minutes
        return ''; // Normal
    }

    // Appliance Intelligence
    updateApplianceIntelligence() {
        // Calculate efficiency score based on usage patterns
        this.calculateEfficiencyScore();
        
        // Update efficiency meter
        const efficiencyElement = document.getElementById('efficiencyScore');
        if (efficiencyElement) {
            efficiencyElement.textContent = this.efficiencyScore;
            
            // Update meter circle
            const meterCircle = document.querySelector('.meter-circle');
            if (meterCircle) {
                const percentage = (this.efficiencyScore / 100) * 360;
                meterCircle.style.background = `conic-gradient(var(--accent-primary) 0deg, var(--accent-primary) ${percentage}deg, var(--border) ${percentage}deg)`;
            }
        }
        
        // Generate smart scheduling suggestions
        this.generateSmartScheduling();
        
        // Generate cost optimization tips
        this.generateCostOptimizationTips();
    }

    calculateEfficiencyScore() {
        let score = 100;
        
        // Deduct points for high usage
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsage = this.appliances.filter(appliance => {
            const applianceDate = new Date(appliance.startTime);
            return applianceDate >= today;
        });
        
        const totalEnergy = todayUsage.reduce((sum, app) => sum + app.energyUsed, 0);
        
        if (totalEnergy > this.dailyGoal) {
            score -= Math.min(30, (totalEnergy - this.dailyGoal) * 5);
        }
        
        // Deduct points for appliances running too long
        this.appliances.forEach(appliance => {
            if (appliance.isActive && appliance.duration > 6) {
                score -= 10;
            }
        });
        
        // Deduct points for high power appliances
        const highPowerAppliances = this.appliances.filter(app => app.powerRating > 2000);
        score -= highPowerAppliances.length * 5;
        
        this.efficiencyScore = Math.max(0, Math.round(score));
    }

    generateSmartScheduling() {
        const suggestions = [
            {
                icon: 'fas fa-clock',
                text: 'Run AC during off-peak hours (10 PM - 6 AM)'
            },
            {
                icon: 'fas fa-leaf',
                text: 'Use geyser only when needed, not continuously'
            },
            {
                icon: 'fas fa-sun',
                text: 'Use natural light during daytime instead of bulbs'
            },
            {
                icon: 'fas fa-thermometer-half',
                text: 'Set AC temperature to 24°C for optimal efficiency'
            }
        ];
        
        const container = document.getElementById('scheduleSuggestions');
        if (container) {
            container.innerHTML = suggestions.map(suggestion => `
                <div class="schedule-item">
                    <i class="${suggestion.icon}"></i>
                    <span>${suggestion.text}</span>
                </div>
            `).join('');
        }
    }

    generateCostOptimizationTips() {
        const tips = [
            {
                icon: 'fas fa-lightbulb',
                text: 'Switch to LED bulbs to save ₹200/month'
            },
            {
                icon: 'fas fa-thermometer-half',
                text: 'Set AC to 24°C for optimal efficiency'
            },
            {
                icon: 'fas fa-plug',
                text: 'Unplug chargers when not in use'
            },
            {
                icon: 'fas fa-clock',
                text: 'Use timers for appliances to avoid overuse'
            }
        ];
        
        const container = document.getElementById('costTips');
        if (container) {
            container.innerHTML = tips.map(tip => `
                <div class="tip-item">
                    <i class="${tip.icon}"></i>
                    <span>${tip.text}</span>
                </div>
            `).join('');
        }
    }

    // Enhanced Alert Management
    markAllAlertsRead() {
        this.alerts.forEach(alert => alert.isRead = true);
        this.persistentAlerts.forEach(alert => alert.isRead = true);
        this.saveUserData();
        this.updateAlertsDisplay();
        showNotification('All alerts marked as read', 'success');
    }

    clearOldAlerts() {
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        
        this.alerts = this.alerts.filter(alert => {
            if (alert.createdAt) {
                return new Date(alert.createdAt).getTime() > oneWeekAgo;
            }
            return true;
        });
        
        this.persistentAlerts = this.persistentAlerts.filter(alert => {
            if (alert.expiresAt) {
                return new Date(alert.expiresAt).getTime() > now;
            }
            return true;
        });
        
        this.saveUserData();
        this.updateAlertsDisplay();
        showNotification('Old alerts cleared', 'success');
    }

    // Simple notification without animations
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        // Update toast styling based on type
        toast.className = `notification-toast ${type}`;
        
        // Show toast
        toast.classList.add('show');

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    initializeTheme();
    
    // Then initialize the app
    window.ecoGoApp = new EcoGoApp();
});

// Clean up timers when page is unloaded
window.addEventListener('beforeunload', () => {
    if (window.ecoGoApp) {
        // Clear countdown timers
        Object.keys(window.ecoGoApp.countdownTimers).forEach(timerId => {
            clearInterval(window.ecoGoApp.countdownTimers[timerId]);
        });
        
        // Clear auto-shutdown timers
        Object.keys(window.ecoGoApp.autoShutdownTimers).forEach(timerId => {
            clearTimeout(window.ecoGoApp.autoShutdownTimers[timerId]);
        });
    }
});

// Logout function
function logout() {
    // Clear all timers if app exists
    if (window.ecoGoApp) {
        // Clear countdown timers
        Object.keys(window.ecoGoApp.countdownTimers).forEach(timerId => {
            clearInterval(window.ecoGoApp.countdownTimers[timerId]);
        });
        
        // Clear auto-shutdown timers
        Object.keys(window.ecoGoApp.autoShutdownTimers).forEach(timerId => {
            clearTimeout(window.ecoGoApp.autoShutdownTimers[timerId]);
        });
    }
    
    // Clear user session
    localStorage.removeItem('ecogo_user');
    sessionStorage.removeItem('ecogo_user');
    localStorage.removeItem('ecogo_current_user_id');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Add some CSS for notification types
const style = document.createElement('style');
style.textContent = `
    .notification-toast.success {
        border-left: 4px solid #10b981;
    }
    
    .notification-toast.error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-toast.warning {
        border-left: 4px solid #f59e0b;
    }
    
    .notification-toast.info {
        border-left: 4px solid #3b82f6;
    }
`;
document.head.appendChild(style);
