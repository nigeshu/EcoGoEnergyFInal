# Firebase Setup Guide for EcoGo

## 🚀 **Step-by-Step Firebase Configuration**

### **Step 1: Create Firebase Project**

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Enter project name: `ecogo-energy-monitor`
   - Enable Google Analytics (optional)
   - Click "Create project"

### **Step 2: Enable Authentication**

1. **Navigate to Authentication**
   - In Firebase Console, click "Authentication" in the left sidebar
   - Click "Get started"

2. **Enable Email/Password Sign-in**
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Enable "Email/Password"
   - Click "Save"

### **Step 3: Set up Firestore Database**

1. **Create Database**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location (choose closest to your users)
   - Click "Done"

2. **Set Security Rules**
   - Go to "Rules" tab
   - Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Step 4: Get Firebase Configuration**

1. **Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Web App Configuration**
   - Scroll down to "Your apps" section
   - Click the web icon (</>)
   - Register app with name: `EcoGo Web App`
   - Click "Register app"

3. **Copy Configuration**
   - Copy the `firebaseConfig` object
   - Replace the placeholder in `firebase-config.js`

### **Step 5: Update firebase-config.js**

Replace the placeholder values in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🔧 **Alternative Options**

### **Option 2: Supabase (PostgreSQL-based)**
- Free tier with 500MB database
- Real-time subscriptions
- Built-in authentication
- SQL database

### **Option 3: MongoDB Atlas**
- Free tier with 512MB storage
- Document-based database
- Easy to scale

### **Option 4: AWS Amplify**
- Free tier available
- Full AWS ecosystem integration
- GraphQL support

## 🌐 **Deployment Considerations**

### **Vercel Deployment**
- Firebase works perfectly with Vercel
- No additional configuration needed
- Environment variables can be set in Vercel dashboard

### **Security Best Practices**
1. **Environment Variables**
   - Store Firebase config in environment variables
   - Never commit API keys to Git

2. **Firestore Rules**
   - Always validate user authentication
   - Restrict access to user's own data

3. **Authentication**
   - Enable email verification
   - Set up password reset functionality

## 📱 **Testing the Setup**

1. **Local Testing**
   ```bash
   npm run dev
   ```

2. **Create Test Account**
   - Go to your app
   - Sign up with a test email
   - Verify data is saved in Firestore

3. **Check Firebase Console**
   - Authentication > Users (should show new user)
   - Firestore > Data (should show user document)

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Firebase not initialized"**
   - Check if Firebase scripts are loaded
   - Verify `firebase-config.js` has correct values

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"Network error"**
   - Check internet connection
   - Verify Firebase project is active

### **Debug Commands:**
```javascript
// Check if Firebase is loaded
console.log('Firebase:', window.firebase);

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
  console.log('Auth state:', user);
});

// Check Firestore connection
firebase.firestore().collection('users').get()
  .then(snapshot => console.log('Firestore connected'))
  .catch(error => console.error('Firestore error:', error));
```

## 🎯 **Next Steps**

1. **Set up Firebase project** (follow steps above)
2. **Update configuration** in `firebase-config.js`
3. **Test locally** with `npm run dev`
4. **Deploy to Vercel** with `vercel --prod`
5. **Monitor usage** in Firebase Console

## 💰 **Costs**

### **Firebase Free Tier:**
- **Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Hosting**: 10GB storage, 360MB/day transfer

### **When to Upgrade:**
- More than 10,000 users
- More than 1GB data storage
- High read/write operations

---

**Need Help?** Check Firebase documentation or create an issue in your GitHub repository!
