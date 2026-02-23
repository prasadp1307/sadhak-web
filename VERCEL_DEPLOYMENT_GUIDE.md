# Vercel Deployment Guide - Firebase Environment Variables

## Issue
The production deployment at https://sadhak-web.vercel.app/ shows a blank page with Firebase configuration errors:

```
Missing required environment variables: 
NEXT_PUBLIC_FIREBASE_API_KEY, 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

## Solution
The `.env.local` file is not automatically deployed to Vercel. You need to add the environment variables to your Vercel project settings.

### Steps to Fix:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `sadhak-web`

2. **Navigate to Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Each Variable**
   
   Add the following variables with these values:
   
   | Variable Name | Value |
   |--------------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAfAnsIBmTKqWyVyCs7bUI-tw0fALkhRfw` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `sadhak-web.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `sadhak-web` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `sadhak-web.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `9985334229` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:9985334229:web:48a0a743049340cffe3b5c` |

4. **Set Environment Scope**
   - For each variable, set the scope to **Production** (and optionally Preview/Development)

5. **Redeploy**
   - Go to the **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy**

## Important Notes

⚠️ **Do NOT commit `.env.local` to version control!** 
- It's already in `.gitignore`
- Never share your Firebase credentials publicly

⚠️ **Security Best Practices**
- The `.env.production.example` file shows the required variable names without actual values
- Keep your API keys secure

## Verification
After redeploying, visit: https://sadhak-web.vercel.app/
- The app should load without errors
- You can test Firebase at: https://sadhak-web.vercel.app/test-firebase
