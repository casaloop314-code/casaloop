# Simple CasaLoop Deployment Guide

## Step 1: Push Code to GitHub (5 minutes)

1. Go to https://github.com and create a new repository
2. Name it "casaloop"
3. In your terminal, run:
```bash
git init
git add .
git commit -m "Initial CasaLoop commit"
git branch -M main
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

## Step 2: Deploy to Vercel (10 minutes)

1. Go to https://vercel.com
2. Click "Sign Up" and choose "Continue with GitHub"
3. Click "Add New Project"
4. Find your "casaloop" repository and click "Import"
5. Add these environment variables by clicking "Environment Variables":

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. Click "Deploy"
7. Wait 2-3 minutes for deployment to complete
8. Copy your live URL (e.g., casaloop.vercel.app)

## Step 3: Register with Pi Network (5 minutes)

1. Go to https://develop.pi/applications
2. Login with your Pi account
3. Create new app or edit existing
4. Add your Vercel URL to "Allowed Domains"
5. Copy your Pi API Key
6. Go back to Vercel → Settings → Environment Variables
7. Add:
```
PI_API_KEY=your_pi_api_key_here
```

## Step 4: Fix Firestore (2 minutes)

1. Go to https://console.firebase.google.com
2. Select your CasaLoop project
3. Click "Firestore Database" → "Rules" tab
4. Paste this and click "Publish":
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null || true;
    }
  }
}
```

## Done!

Your app is now live at: `https://your-app.vercel.app`

Test by visiting the URL in your browser. Pioneers anywhere in the world can now access CasaLoop!

## Quick Troubleshooting

- **"Service firestore is not available"** → Wait 5 minutes after enabling Firestore, then redeploy
- **"Authentication failed"** → Check Pi Developer Portal has correct Vercel URL
- **"Page not loading"** → Check all environment variables are added in Vercel

## Updates

To update your live app after making changes:
```bash
git add .
git commit -m "Updates"
git push
```

Vercel automatically redeploys in 1-2 minutes.
