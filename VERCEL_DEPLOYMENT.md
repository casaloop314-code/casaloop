# 🚀 Deploy CasaLoop to Vercel - Complete Guide

This guide will walk you through deploying CasaLoop to Vercel step-by-step.

---

## Prerequisites

Before starting, make sure you have:
- ✅ Firebase project set up with your config
- ✅ Pi Network API key from Pi Developer Portal
- ✅ CasaLoop code ready

---

## Method 1: Deploy via Vercel Dashboard (Easiest - Recommended)

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended) or email
4. Complete the sign-up process

### Step 2: Import Your Project

**Option A: If your code is on GitHub:**
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Authorize Vercel to access your GitHub account
4. Find your CasaLoop repository and click **"Import"**

**Option B: If your code is local (not on GitHub yet):**
1. First, create a GitHub repository:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `casaloop`
   - Make it **Private**
   - Click **"Create repository"**

2. Push your local code to GitHub:
   ```bash
   # In your CasaLoop folder, run:
   git init
   git add .
   git commit -m "Initial CasaLoop commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/casaloop.git
   git push -u origin main
   ```

3. Then follow **Option A** above to import from GitHub

### Step 3: Configure Project Settings

When importing, Vercel will detect Next.js automatically. Configure:

1. **Project Name:** `casaloop` (or your preferred name)
2. **Framework Preset:** Next.js (should be auto-detected)
3. **Root Directory:** `./` (leave as default)
4. **Build Command:** Leave default (`npm run build`)
5. **Output Directory:** Leave default (`.next`)

### Step 4: Add Environment Variables

**CRITICAL:** Before deploying, click **"Environment Variables"** and add these:

#### Firebase Configuration (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Pi Network Configuration (Required)
```
NEXT_PUBLIC_PI_API_KEY=f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng
```

**Where to find these values:**

**Firebase Config:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ (Settings) → **Project Settings**
4. Scroll to "Your apps" → Click your web app
5. Copy the config values from `firebaseConfig`

**Pi API Key:**
- You already have this: `f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng`

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. ✅ You'll see "Congratulations! Your project has been deployed"
4. Click **"Visit"** to see your live app

Your app will be live at: `https://casaloop-[random].vercel.app`

---

## Method 2: Deploy via Command Line (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
# In your CasaLoop directory
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** casaloop
- **Directory?** ./ (press Enter)
- **Override settings?** No

### Step 4: Add Environment Variables

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_PI_API_KEY
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Step 6: Update Pi Developer Portal (CRITICAL)

After deployment, you MUST update your Pi app settings:

1. Go to [https://develop.pi](https://develop.pi)
2. Select your CasaLoop app
3. Go to **"App Settings"**
4. Update **"App URL"** to your Vercel URL:
   ```
   https://casaloop-[your-url].vercel.app
   ```
5. Under **"Authorized Domains"**, add:
   ```
   casaloop-[your-url].vercel.app
   ```
6. Click **"Save"**

**⚠️ IMPORTANT:** The URL must match EXACTLY (no trailing slash, include https://)

---

## Step 7: Deploy Firebase Security Rules

After your app is live, deploy the security rules:

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Or use the script:
```bash
chmod +x scripts/deploy-firebase-rules.sh
./scripts/deploy-firebase-rules.sh
```

---

## Step 8: Test Your Live App

1. Open your Vercel URL in a browser
2. You should see the CasaLoop loading screen
3. Click **"Login with Pi"**
4. Authenticate with Pi Network
5. ✅ You should be redirected to the Home page

---

## Common Issues & Solutions

### Issue 1: "Pi SDK not loading"
**Solution:** 
- Check that your Vercel URL is whitelisted in Pi Developer Portal
- Ensure URL matches exactly (no http, use https)

### Issue 2: "Firebase connection failed"
**Solution:**
- Verify all Firebase environment variables are set in Vercel
- Check Firebase config in [Firebase Console](https://console.firebase.google.com)
- Make sure Firebase project is active

### Issue 3: "Deployment failed"
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all required files are committed to Git
- Check that `package.json` has all dependencies

### Issue 4: "Environment variables not working"
**Solution:**
- After adding env vars, redeploy: `vercel --prod` or use dashboard
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access
- Check for typos in variable names

---

## Custom Domain (Optional)

To use your own domain (e.g., casaloop.com):

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain: `casaloop.com`
5. Follow DNS configuration instructions
6. After domain is verified, update Pi Developer Portal with new domain

---

## Continuous Deployment

Once set up, every time you push to GitHub:
1. Vercel automatically detects the change
2. Builds and deploys your app
3. Your live site updates in 2-3 minutes

To push updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

---

## Vercel Dashboard Features

Access at [https://vercel.com/dashboard](https://vercel.com/dashboard):

- **Deployments:** View all deployment history
- **Analytics:** See traffic and performance
- **Logs:** Debug runtime errors
- **Environment Variables:** Update secrets
- **Domains:** Manage custom domains
- **Settings:** Configure build settings

---

## Getting Help

If you encounter issues:

1. **Vercel Logs:** Check deployment logs in Vercel Dashboard
2. **Browser Console:** Open DevTools (F12) and check for errors
3. **Firebase Console:** Verify Firestore data and rules
4. **Pi Developer Portal:** Ensure app is properly configured

---

## Summary Checklist

- ✅ Created Vercel account
- ✅ Imported CasaLoop project
- ✅ Added all environment variables
- ✅ Deployed successfully
- ✅ Updated Pi Developer Portal with Vercel URL
- ✅ Deployed Firebase security rules
- ✅ Tested live app with Pi authentication

**Your CasaLoop app is now LIVE! 🎉**

Production URL: `https://casaloop-[your-url].vercel.app`

---

## Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls

# Pull latest deployment
vercel pull

# Open project in browser
vercel open
```

---

## Next Steps

1. Submit app to Pi Network for review
2. Share your app URL with test users
3. Monitor analytics in Vercel Dashboard
4. Gather user feedback
5. Iterate and improve

**Need more help?** Contact: casaloop314@gmail.com
