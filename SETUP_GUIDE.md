# CasaLoop Production Setup Guide

This guide will help you deploy CasaLoop to production and make it mainnet-ready.

## Step 1: Firebase Setup

### 1.1 Deploy Security Rules

**Option A: Using Firebase Console (Easiest)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your CasaLoop project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` from your project
5. Paste into the Firebase console
6. Click **Publish**

**Option B: Using Firebase CLI (Recommended)**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 1.2 Deploy Indexes

Firestore indexes improve query performance:

```bash
firebase deploy --only firestore:indexes
```

Or manually create indexes in Firebase Console when you see index errors in logs.

## Step 2: Environment Variables

Set these environment variables in Vercel:

### Required Variables

```env
# Pi Network
NEXT_PUBLIC_PI_API_KEY=f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng
PI_API_SECRET=your_pi_api_secret_here

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Setting Variables in Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select environments: Production, Preview, Development
5. Click **Save**

## Step 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables
7. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Your production URL will be: `https://casaloop.vercel.app` (or your custom domain)

## Step 4: Pi Developer Portal Configuration

### 4.1 Update App Settings

1. Go to [Pi Developer Portal](https://develop.pi)
2. Select your CasaLoop app
3. Update **App URL** to your Vercel production URL
   - Example: `https://casaloop.vercel.app`
4. Add to **Authorized Domains**:
   - `casaloop.vercel.app`
   - Add any custom domain if you have one

### 4.2 Configure Payment Webhooks

Set up webhook URLs for payment callbacks:

1. In Pi Developer Portal → **Payments** → **Webhooks**
2. Add webhook URL: `https://casaloop.vercel.app/api/verify-payment`
3. Enable payment events: `payment_completed`, `payment_failed`

### 4.3 Submit for Review

1. Complete all required information:
   - App name: **CasaLoop**
   - Description: "Professional real estate marketplace on Pi Network. Buy, sell, and rent properties securely using Pi tokens."
   - Category: **Real Estate**
   - Upload app icon (512x512px PNG)
   - Upload screenshots (at least 3)

2. Add legal pages:
   - Privacy Policy: `https://casaloop.vercel.app/privacy`
   - Terms of Service: `https://casaloop.vercel.app/terms`

3. Click **Submit for Review**

## Step 5: Testing Checklist

Before submitting to Pi Network, test these features:

### Core Features
- [ ] Pi authentication works
- [ ] Properties can be created and viewed
- [ ] Services can be listed and browsed
- [ ] Search and filters work correctly
- [ ] Pagination loads properly

### Payments
- [ ] Property reservation payment flows work
- [ ] Service booking payments complete successfully
- [ ] Payment verification API validates transactions
- [ ] Failed payments show error messages

### Security
- [ ] Firebase security rules prevent unauthorized access
- [ ] Users can only edit their own data
- [ ] Payment records are read-only
- [ ] Report system saves to database

### User Experience
- [ ] Loading skeletons show while data loads
- [ ] Error boundary catches crashes gracefully
- [ ] Mobile responsive on all screen sizes
- [ ] Images load correctly from Vercel Blob

## Step 6: Post-Deployment Monitoring

### Check Logs

**Vercel Logs:**
```bash
vercel logs [deployment-url]
```

**Firebase Console:**
- Firestore → Usage
- Authentication → Users

### Monitor Errors

1. Check Vercel **Deployments** → **Functions** tab for API errors
2. Check browser console for client-side errors
3. Monitor Firebase security rule violations

## Troubleshooting

### Common Issues

**1. "Firebase rules deny access"**
- Verify rules are deployed: `firebase deploy --only firestore:rules`
- Check user is authenticated
- Verify userId matches in security rules

**2. "Payment verification failed"**
- Check `PI_API_SECRET` is set in Vercel
- Verify webhook URL in Pi Developer Portal
- Check API logs in Vercel Functions

**3. "Images not uploading"**
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob storage quota
- Ensure file size is under 5MB

**4. "Authentication not working"**
- Verify `NEXT_PUBLIC_PI_API_KEY` is correct
- Check authorized domains in Pi Developer Portal
- Ensure Pi SDK script is loading

## Performance Optimization

### Enable Caching

Add these headers in `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ];
}
```

### Image Optimization

Images are automatically optimized by Next.js when using the `<Image>` component.

## Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review [Vercel Documentation](https://vercel.com/docs)
3. Check [Pi Network Developer Docs](https://developers.minepi.com)

---

**Congratulations!** Your CasaLoop app is now production-ready and mainnet-ready for Pi Network.
