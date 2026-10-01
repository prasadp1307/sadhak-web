# Quick Start: Dummy Users

## 🚀 Create Dummy Users (One Command)

```bash
npx tsx scripts/create-dummy-users.ts
```

## 🔐 Test & Showcase Demo Credentials

| Email | Password | Role / Scope |
|-------|----------|--------------|
| **demo@sadhak.com** | `Sadhak@2026` | 🌟 **Showcase Demo Admin** (Active & Verified - Isolated Clean State) |
| **showcase@sadhak.com** | `Sadhak@2026` | 🌟 **Showcase Demo Admin** (Active & Verified - Isolated Clean State) |
| **admin@sadhak.com** | `Sadhak@2026` | 🌟 **Showcase Demo Admin** (Isolated Clean State) |
| **user1@sadhak.com** | `password123` | Standard User |
| **user2@sadhak.com** | `password123` | Standard User |
| **user3@sadhak.com** | `password123` | Standard User |

## 🔍 View Users

### Option 1: In-App (Recommended)
1. Start dev server: `npm run dev`
2. Sign in at: http://localhost:3000/auth
3. View users at: http://localhost:3000/admin/users

### Option 2: Firebase Console
Go to: https://console.firebase.google.com/project/sadhak-web/authentication/users

## ✅ Test Sign In

1. Go to: http://localhost:3000/auth
2. Use any credentials above
3. Click "Sign In"

## 📚 Full Documentation

See `DUMMY_USERS_GUIDE.md` for complete instructions and troubleshooting.
