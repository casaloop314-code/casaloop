# Deploy CasaLoop to Vercel - Simple Steps

Follow these steps to make CasaLoop accessible to pioneers worldwide.

---

## Step 1: Push Code to GitHub

First, make sure your code is on GitHub:

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial CasaLoop commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/casaloop.git
git branch -M main
git push -u origin main
```

---

## Step 2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

---

## Step 3: Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your CasaLoop repository in the list
3. Click **"Import"**

---

## Step 4: Configure Environment Variables

Before deploying, add your Firebase credentials:

1. In the **"Configure Project"** screen, scroll to **"Environment Variables"**
2. Add each variable from your `firebase-config.ts` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
```

**How to find these values:**
- Open `/lib/firebase-config.ts` in your project
- Copy each value (without quotes)
- Paste into Vercel

---

## Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see a success screen with your live URL

**Your URL will look like:**
```
https://casaloop-abc123.vercel.app
```

---

## Step 6: Update Pi Developer Portal

Now register your live URL with Pi Network:

1. Go to https://develop.pi/applications
2. Login with your Pi account
3. Find your CasaLoop app or create new one
4. Under **"Allowed Domains"**, add:
   ```
   https://casaloop-abc123.vercel.app
   ```
   (Use your actual Vercel URL)
5. Save changes

---

## Step 7: Test Your Live App

1. Open your Vercel URL in a browser
2. You should see the CasaLoop loading screen
3. Login with Pi Network
4. Verify everything works

---

## Troubleshooting

### "Something went wrong" on live site

**Cause:** Firebase rules or environment variables

**Fix:**
1. Go to Firebase Console → Firestore Database → Rules
2. Change to test mode:
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
3. Click **Publish**

### "Authentication failed" error

**Cause:** Pi Network doesn't recognize your domain

**Fix:**
1. Verify you added the exact Vercel URL to Pi Developer Portal
2. Include `https://` in the URL
3. Wait 5-10 minutes for Pi Network to update

### Build fails on Vercel

**Cause:** Missing dependencies or build errors

**Fix:**
1. Check the build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing packages

---

## Next Steps After Deployment

### 1. Add Custom Domain (Optional)
- Buy a domain like `casaloop.com`
- In Vercel → Project Settings → Domains
- Add your custom domain and follow DNS instructions

### 2. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 3. Monitor Your App
- Vercel Dashboard shows:
  - Visitors count
  - Performance metrics
  - Error logs

### 4. Enable Analytics (Optional)
```bash
# In Vercel dashboard
Project Settings → Analytics → Enable
```

---

## Quick Reference Commands

### Redeploy after changes:
```bash
git add .
git commit -m "Updated features"
git push
```
Vercel automatically redeploys when you push to GitHub!

### View live logs:
```bash
vercel logs
```

### Roll back deployment:
In Vercel dashboard → Deployments → Click "..." on previous version → "Promote to Production"

---

## Your App is Now Live! 🎉

Pioneers worldwide can now access CasaLoop at your Vercel URL. Share your link in:
- Pi Network community
- Social media
- Pi app marketplace

Need help? Check:
- Vercel docs: https://vercel.com/docs
- Firebase docs: https://firebase.google.com/docs
- Pi docs: https://minepi.com/pi-developer-kit
