// Cloud Service for EcoGo - Firebase Integration
class CloudService {
    constructor() {
        this.auth = window.firebaseAuth;
        this.db = window.firebaseDB;
        this.currentUser = null;
        this.setupAuthListener();
    }

    // Setup authentication state listener
    setupAuthListener() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserData();
                this.updateUIForUser(user);
            } else {
                this.currentUser = null;
                this.redirectToLogin();
            }
        });
    }

    // Update UI when user is authenticated
    updateUIForUser(user) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.displayName || user.email;
        }
    }

    // Redirect to login if not authenticated
    redirectToLogin() {
        if (window.location.pathname !== '/login.html' && window.location.pathname !== '/') {
            window.location.href = 'login.html';
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Sign up new user
    async signUp(email, password, displayName) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({
                displayName: displayName
            });
            
            // Create initial user data
            await this.createInitialUserData(userCredential.user);
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Sign in existing user
    async signIn(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Sign out user
    async signOut() {
        try {
            await this.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Create initial user data structure
    async createInitialUserData(user) {
        const userData = {
            userId: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date(),
            settings: {
                theme: 'dark',
                notifications: true,
                currency: '₹',
                timezone: 'Asia/Kolkata'
            },
            energyData: {
                currentUsage: 0,
                dailyGoal: 10,
                costPerKwh: 8.5,
                appliances: [],
                alerts: [],
                usageHistory: []
            }
        };

        await this.db.collection('users').doc(user.uid).set(userData);
    }

    // Load user data from Firebase
    async loadUserData() {
        if (!this.currentUser) return null;

        try {
            const doc = await this.db.collection('users').doc(this.currentUser.uid).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }

    // Save user data to Firebase
    async saveUserData(data) {
        if (!this.currentUser) return false;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update(data);
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    // Save energy usage data
    async saveEnergyUsage(usageData) {
        if (!this.currentUser) return false;

        try {
            const userRef = this.db.collection('users').doc(this.currentUser.uid);
            await userRef.update({
                'energyData.currentUsage': usageData.currentUsage,
                'energyData.usageHistory': firebase.firestore.FieldValue.arrayUnion(usageData.entry)
            });
            return true;
        } catch (error) {
            console.error('Error saving energy usage:', error);
            return false;
        }
    }

    // Save appliance data
    async saveAppliances(appliances) {
        if (!this.currentUser) return false;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                'energyData.appliances': appliances
            });
            return true;
        } catch (error) {
            console.error('Error saving appliances:', error);
            return false;
        }
    }

    // Save alerts
    async saveAlerts(alerts) {
        if (!this.currentUser) return false;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                'energyData.alerts': alerts
            });
            return true;
        } catch (error) {
            console.error('Error saving alerts:', error);
            return false;
        }
    }

    // Save settings
    async saveSettings(settings) {
        if (!this.currentUser) return false;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                settings: settings
            });
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    // Get real-time updates
    setupRealtimeListener(callback) {
        if (!this.currentUser) return null;

        return this.db.collection('users').doc(this.currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data());
                }
            });
    }
}

// Initialize cloud service
window.cloudService = new CloudService();
