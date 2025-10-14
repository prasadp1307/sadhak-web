# Dummy Users Guide

This guide explains how to create and view dummy users in the Sadhak Web application.

## 📋 Dummy User Credentials

Three dummy users have been configured:

| User | Email | Password |
|------|-------|----------|
| User 1 | user1@sadhak.com | password123 |
| User 2 | user2@sadhak.com | password123 |
| User 3 | user3@sadhak.com | password123 |

## 🚀 How to Create Dummy Users

### Method 1: Using the Script (Recommended)

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Make sure your .env.local file has Firebase credentials**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=sadhak-web
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Run the dummy user creation script**:
   ```bash
   npx tsx scripts/create-dummy-users.ts
   ```

4. **Expected output**:
   ```
   🚀 Starting to create dummy users...

   ✅ Created user: user1@sadhak.com
      UID: abc123...
      Email: user1@sadhak.com

   ✅ Created user: user2@sadhak.com
      UID: def456...
      Email: user2@sadhak.com

   ✅ Created user: user3@sadhak.com
      UID: ghi789...
      Email: user3@sadhak.com

   ✨ Dummy user creation process completed!
   ```

### Method 2: Manual Creation via UI

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the auth page**:
   ```
   http://localhost:3000/auth
   ```

3. **Sign up manually** with each dummy user:
   - Click "Don't have an account? Sign Up"
   - Enter email: `user1@sadhak.com`
   - Enter password: `password123`
   - Click "Sign Up"
   - Repeat for user2 and user3

## 🔍 How to View Dummy Users

### Option 1: In-App Admin Page

1. **Start the development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Sign in with any dummy user**:
   - Go to: http://localhost:3000/auth
   - Use any of the dummy user credentials above

3. **Navigate to the admin users page**:
   ```
   http://localhost:3000/admin/users
   ```

4. **You will see**:
   - Current signed-in user details
   - User UID, email, creation date, last sign-in time
   - Links to Firebase Console for full user list

### Option 2: Firebase Console (See All Users)

1. **Go to Firebase Console**:
   ```
   https://console.firebase.google.com/project/sadhak-web/authentication/users
   ```

2. **Sign in** with your Google account

3. **View all users**:
   - You'll see a complete list of all registered users
   - Each user shows: Email, UID, Created date, Last sign-in, Provider
   - You can search, filter, and manage users from here

### Option 3: Test Sign In

1. **Go to the auth page**:
   ```
   http://localhost:3000/auth
   ```

2. **Try signing in** with each dummy user:
   - Email: `user1@sadhak.com`
   - Password: `password123`

3. **If successful**, you'll be authenticated and can access protected pages

## 🛠️ Troubleshooting

### Script fails with "auth/configuration-not-found"
**Solution:** Enable Email/Password authentication in Firebase Console:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Save and try again

### Script fails with "auth/email-already-in-use"
**Solution:** Users already exist! You can:
- Sign in with existing credentials
- Delete users from Firebase Console and run script again
- Skip this error (users are already created)

### Cannot view users in admin page
**Solution:** 
1. Make sure you're signed in (go to /auth first)
2. Check browser console for errors
3. Verify Firebase configuration in .env.local

### Script command not found: tsx
**Solution:** Install tsx globally or use npx:
```bash
npm install -g tsx
# OR
npx tsx scripts/create-dummy-users.ts
```

## 📊 User Management Features

### Current Features:
- ✅ View currently signed-in user
- ✅ Display user UID, email, creation date
- ✅ Show email verification status
- ✅ Link to Firebase Console for full user list

### Firebase Console Features:
- View all users in one place
- Search and filter users
- Delete users
- Disable/enable user accounts
- View user sign-in history
- Export user data

## 🔐 Security Notes

⚠️ **Important:**
- These are TEST credentials only
- Never use these passwords in production
- Change passwords for production users
- Enable email verification for production
- Set up proper security rules

## 📝 Next Steps

After creating dummy users, you can:

1. **Test authentication flow**:
   - Sign up, sign in, sign out
   - Test password validation
   - Test error handling

2. **Test protected routes**:
   - Create pages that require authentication
   - Test redirect logic

3. **Add user profiles**:
   - Store additional user data in Firestore
   - Create user profile pages

4. **Implement role-based access**:
   - Add admin roles
   - Restrict certain pages to admins only

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Check Firebase Console for user status
4. Review FIREBASE_SETUP_GUIDE.md
5. Ensure Email/Password auth is enabled in Firebase
