// EcoGo Authentication System - Firebase Integration
class AuthSystem {
    constructor() {
        this.cloudService = window.cloudService;
        this.currentUser = null;
        console.log('AuthSystem initialized with Firebase');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

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
        // Check if user is already authenticated
        if (this.cloudService && this.cloudService.isAuthenticated()) {
            // User is already logged in, redirect to main page
            window.location.href = 'index.html';
        }
    }

    async handleLogin() {
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

        // Show loading state
        this.showNotification('Signing in...', 'info');

        // Attempt login with Firebase
        const result = await this.cloudService.signIn(email, password);
        
        if (result.success) {
            console.log('Login successful for user:', result.user.email);
            this.showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            console.log('Login failed:', result.error);
            this.showNotification(result.error, 'error');
        }
    }

    async handleSignup() {
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

        // Show loading state
        this.showNotification('Creating account...', 'info');

        // Create new user with Firebase
        const result = await this.cloudService.signUp(email, password, name);
        
        if (result.success) {
            console.log('User created successfully:', result.user.email);
            this.showNotification('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            console.log('Signup failed:', result.error);
            this.showNotification(result.error, 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
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
    // Wait for Firebase to initialize
    setTimeout(() => {
        if (window.cloudService) {
            window.authSystem = new AuthSystem();
        } else {
            console.error('Cloud service not available');
        }
    }, 1000);
});
