// EcoGo Authentication System
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        console.log('AuthSystem initialized:', {
            usersCount: this.users.length,
            currentUser: this.currentUser ? this.currentUser.name : 'None'
        });
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Password toggle buttons
        this.setupPasswordToggles();
    }

    setupPasswordToggles() {
        // Login password toggle
        const togglePassword = document.querySelector('#loginForm .toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility('password');
            });
        }

        // Signup password toggles
        const toggleSignupPassword = document.querySelector('#signupForm .toggle-password');
        if (toggleSignupPassword) {
            toggleSignupPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility('signupPassword');
            });
        }

        const toggleConfirmPassword = document.querySelector('#signupForm .toggle-password:last-of-type');
        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility('confirmPassword');
            });
        }
    }

    togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        const toggleBtn = field.parentElement.querySelector('.toggle-password');
        const icon = toggleBtn.querySelector('i');

        if (field.type === 'password') {
            field.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            field.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    checkAuthStatus() {
        if (this.currentUser) {
            // User is already logged in, redirect to main page
            window.location.href = 'index.html';
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        console.log('Login attempt:', { email, password: password.substring(0, 3) + '***', rememberMe });

        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            return;
        }

        // Check if users exist
        console.log('Available users:', this.users.map(u => ({ email: u.email, name: u.name })));

        // Attempt login
        const user = this.authenticateUser(email, password);
        if (user) {
            console.log('Login successful for user:', user.name);
            this.loginUser(user, rememberMe);
            this.showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            console.log('Login failed - invalid credentials');
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        console.log('Signup attempt:', { name, email, password: password.substring(0, 3) + '***', agreeTerms });

        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (name.length < 2) {
            this.showError('signupName', 'Name must be at least 2 characters');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('signupEmail', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('signupPassword', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }

        // Check if user already exists
        if (this.userExists(email)) {
            this.showError('signupEmail', 'An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = this.createUser(name, email, password);
        console.log('User created successfully:', newUser.name);
        this.loginUser(newUser, false);
        this.showNotification('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    userExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    authenticateUser(email, password) {
        const user = this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
        return user;
    }

    createUser(name, email, password) {
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email.toLowerCase(),
            password: password,
            createdAt: new Date().toISOString(),
            // Initialize user data with zero values
            userData: {
                appliances: [],
                alerts: [],
                suggestions: [],
                currentUsage: [],
                electricityRate: 6.5, // ₹6.5 per kWh (Indian standard)
                totalEnergyUsed: 0,
                totalCost: 0,
                joinDate: new Date().toISOString()
            }
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    loginUser(user, rememberMe) {
        this.currentUser = user;
        
        if (rememberMe) {
            localStorage.setItem('ecogo_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('ecogo_user', JSON.stringify(user));
        }

        // Save current user ID for the main app
        localStorage.setItem('ecogo_current_user_id', user.id);
    }

    getCurrentUser() {
        const user = localStorage.getItem('ecogo_user') || sessionStorage.getItem('ecogo_user');
        return user ? JSON.parse(user) : null;
    }

    loadUsers() {
        const users = localStorage.getItem('ecogo_users');
        const parsedUsers = users ? JSON.parse(users) : [];
        console.log('Loaded users from localStorage:', parsedUsers.length);
        return parsedUsers;
    }

    saveUsers() {
        localStorage.setItem('ecogo_users', JSON.stringify(this.users));
        console.log('Users saved to localStorage:', this.users.length);
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const wrapper = field.parentElement;
        
        wrapper.classList.add('error');
        
        // Remove existing error message
        const existingError = wrapper.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        wrapper.parentElement.appendChild(errorDiv);
    }

    clearErrors() {
        // Remove all error classes
        document.querySelectorAll('.input-wrapper.error').forEach(wrapper => {
            wrapper.classList.remove('error');
        });
        
        // Remove all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = document.getElementById('toastMessage');
        
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

// Global functions for form switching
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Password toggle functions (for onclick attributes - fallback)
function togglePassword() {
    const auth = window.authSystem;
    if (auth) {
        auth.togglePasswordVisibility('password');
    }
}

function toggleSignupPassword() {
    const auth = window.authSystem;
    if (auth) {
        auth.togglePasswordVisibility('signupPassword');
    }
}

function toggleConfirmPassword() {
    const auth = window.authSystem;
    if (auth) {
        auth.togglePasswordVisibility('confirmPassword');
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
