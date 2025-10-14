# 🚀 Quick Fix Guide - Firebase Issues

## Current Issues & Solutions

### ❌ Issue 1: "auth/configuration-not-found"
**What it means:** Firebase Authentication is not enabled in your Firebase Console.

**Quick Fix:**
1. Go to https://console.firebase.google.com/
2. Select project: **sadhak-web**
3. Navigate to: **Build** → **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

---

### ❌ Issue 2: "Missing or insufficient permissions" (Firestore)
**What it means:** Firestore security rules are blocking access.

**Quick Fix:**
1. Go to https://console.firebase.google.com/
2. Select project: **sadhak-web**
3. Navigate to: **Build** → **Firestore Database** → **Rules**
4. Copy the rules from `firestore.rules` file in this project
5. Paste into the Firebase Console Rules editor
6. Click **Publish**
7. Wait 10-30 seconds for rules to propagate

**Or use this rule directly:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## ✅ Verification Steps

After applying the fixes above:

1. **Restart your dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test Firebase Connection:**
   - Open: http://localhost:3000/test-firebase
   - Click "Run Firebase Tests"
   - All tests should show ✅ (green checkmarks)

3. **Test Authentication:**
   - Open: http://localhost:3000/auth
   - Try signing up with a test email (e.g., test@example.com)
   - Password should be at least 6 characters
   - You should be able to sign in successfully

---

## 📋 Checklist

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firestore security rules updated to allow access
- [ ] .env.local file has correct credentials
- [ ] Dev server restarted
- [ ] Test page shows all green checkmarks
- [ ] Can sign up and sign in successfully

---

## 🔍 Still Having Issues?

### Check Browser Console
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Look for detailed error messages
4. Share the error code with the team

### Verify Credentials
Your current Firebase config:
- **Project ID:** sadhak-web
- **Auth Domain:** sadhak-web.firebaseapp.com
- **API Key:** Check .env.local file

### Common Mistakes
- ❌ Forgot to click "Publish" after updating Firestore rules
- ❌ Didn't wait for rules to propagate (wait 30 seconds)
- ❌ Authentication method not enabled in Firebase Console
- ❌ Wrong Firebase project selected
- ❌ .env.local file not saved properly

---

## 📞 Need More Help?

See the detailed guide: `FIREBASE_SETUP_GUIDE.md`
