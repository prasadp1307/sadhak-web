#!/bin/bash
# Setup Firebase environment variables for Vercel
# Run this locally with: bash setup-vercel-env.sh

echo "Setting up Firebase environment variables in Vercel..."

# API Key
echo "Adding NEXT_PUBLIC_FIREBASE_API_KEY..."
echo "AIzaSyAfAnsIBmTKqWyVyCs7bUI-tw0fALkhRfw" | npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

# Auth Domain
echo "Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
echo "sadhak-web.firebaseapp.com" | npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

# Project ID
echo "Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
echo "sadhak-web" | npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

# Storage Bucket
echo "Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
echo "sadhak-web.firebasestorage.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

# Messaging Sender ID
echo "Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
echo "9985334229" | npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

# App ID
echo "Adding NEXT_PUBLIC_FIREBASE_APP_ID..."
echo "1:9985334229:web:48a0a743049340cffe3b5c" | npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo "Done! Now trigger a deployment with: git commit --allow-empty -m 'trigger deployment' && git push"
