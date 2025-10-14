# Firebase Setup Guide

## Error: auth/configuration-not-found

This error means Firebase Authentication is not properly configured in your Firebase Console.

## Steps to Fix:

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sadhak-web**
3. In the left sidebar, click on **"Build"** → **"Authentication"**
4. Click **"Get Started"** if you haven't enabled Authentication yet
5. Go to the **"Sign-in method"** tab
6. Click on **"Email/Password"**
7. Toggle **"Enable"** to ON
8. Click **"Save"**

### 2. Enable Firestore Database

1. In the Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### 3. Verify Your Credentials

Your current Firebase configuration:
```
Project ID: sadhak-web
API Key: AIzaSyAfAnsIBmTKqWyVyCs7bUI-tw0fALkhRfw
Auth Domain: sadhak-web.firebaseapp.com
Storage Bucket: sadhak-web.firebasestorage.app
Messaging Sender ID: 9985334229
App ID: 1:9985334229:web:48a0a743049340cffe3b5c
```

### 4. Test the Connection

After enabling Authentication and Firestore:

1. Navigate to: http://localhost:3000/test-firebase
2. Click "Run Firebase Tests"
3. Verify all services show ✅ (green checkmarks)

### 5. Test Authentication

1. Navigate to: http://localhost:3000/auth
2. Try to sign up with a test email and password
3. If successful, you should be able to sign in

## Common Issues:

### Issue 1: "auth/configuration-not-found"
**Solution:** Enable Email/Password authentication in Firebase Console (see Step 1 above)

### Issue 2: "auth/invalid-api-key"
**Solution:** Verify your API key in .env.local matches the one in Firebase Console

### Issue 3: "Missing or insufficient permissions" for Firestore
**Solution:** Update Firestore security rules to allow read/write in test mode:

**Step-by-step:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sadhak-web**
3. Click on **"Firestore Database"** in the left sidebar
4. Click on the **"Rules"** tab
5. Replace the existing rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For testing only!
    }
  }
}
```
6. Click **"Publish"**
7. Wait a few seconds for the rules to propagate
8. Refresh your test page and run the tests again

### Issue 4: "auth/operation-not-allowed"
**Solution:** Make sure Email/Password provider is enabled in Authentication settings

## Security Notes:

⚠️ **Important for Production:**
- Change Firestore rules to restrict access
- Enable only necessary authentication methods
- Set up proper security rules
- Never commit .env.local to version control
- Use Firebase App Check for additional security

## Next Steps:

1. ✅ Enable Firebase Authentication (Email/Password)
2. ✅ Enable Firestore Database
3. ✅ Test connection at /test-firebase
4. ✅ Test authentication at /auth
5. ✅ Update security rules for production

## Need Help?

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project exists at console.firebase.google.com
3. Ensure you're logged into the correct Google account
4. Check that the project ID matches: **sadhak-web**
