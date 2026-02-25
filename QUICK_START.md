# CasaLoop Quick Start Guide

## 🚀 Simple Command to Set Up Security

Run this single command to deploy Firebase security rules:

```bash
chmod +x scripts/deploy-firebase-rules.sh && ./scripts/deploy-firebase-rules.sh
```

**What this does:**
1. Makes the script executable
2. Installs Firebase CLI (if not installed)
3. Logs you into Firebase
4. Deploys your Firestore security rules
5. Deploys your Firestore indexes

---

## ✅ Test Everything

Run this command to verify all features work:

```bash
chmod +x scripts/test-casaloop.sh && ./scripts/test-casaloop.sh
```

**What this tests:**
- Core files and structure
- Security rules and payment system
- Legal pages (Privacy & Terms)
- All UI components and tabs
- Gamification features (streaks, quests, badges)
- Performance optimizations (pagination, skeletons)
- Notification system
- Documentation completeness

---

## 📋 Complete Deployment Checklist

### Step 1: Test Locally
```bash
# Run comprehensive tests
./scripts/test-casaloop.sh
```

### Step 2: Set Up Firebase
```bash
# Deploy security rules
./scripts/deploy-firebase-rules.sh

# Select option 1 (Deploy Firestore Rules)
```

### Step 3: Configure Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_PI_API_KEY=f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

### Step 5: Configure Pi Developer Portal

1. Go to https://develop.pi
2. Add your app details:
   - **Name:** CasaLoop
   - **URL:** Your Vercel production URL
   - **Description:** Professional real estate marketplace on Pi Network
3. Whitelist your domain
4. Add payment callback URLs
5. Submit for review

---

## 🧪 Manual Testing Checklist

### Authentication
- [ ] Click "Login with Pi" button
- [ ] Verify authentication completes in under 5 seconds
- [ ] Check welcome banner appears for new users
- [ ] Verify 10 $CASA welcome bonus is credited

### Home Tab
- [ ] Search for properties by location
- [ ] Filter by type (House, Apartment, etc.)
- [ ] Test pagination (10 items per page)
- [ ] Click heart icon to favorite a property
- [ ] View property details
- [ ] Report suspicious listings

### Services Tab
- [ ] Browse service providers
- [ ] Filter by category
- [ ] Test pagination
- [ ] Book a service
- [ ] Leave a review

### Listings Tab
- [ ] Create a new property listing
- [ ] Upload images
- [ ] Verify listing appears in Home tab
- [ ] Edit your listing
- [ ] Mark property as sold

### Messages Tab
- [ ] Send message to property owner
- [ ] Verify real-time updates
- [ ] Search conversations

### Analytics Tab
- [ ] View listing performance
- [ ] Check views and favorites count
- [ ] See engagement trends

### Profile/Rewards Tab
- [ ] Claim daily $CASA (3.4 tokens)
- [ ] Check current streak
- [ ] Spin the daily wheel
- [ ] Complete quests
- [ ] View transaction history
- [ ] Access Privacy Policy
- [ ] Access Terms of Service

### Notifications
- [ ] Click bell icon in header
- [ ] View notifications list
- [ ] Mark notifications as read
- [ ] Verify badge count updates

### Payment System
- [ ] Initiate a Pi payment
- [ ] Verify payment verification API works
- [ ] Check transaction logs in Firebase
- [ ] Test fraud detection (multiple rapid payments blocked)

### Trust & Verification
- [ ] View trust badges on listings
- [ ] Check verification status
- [ ] Report fraudulent content
- [ ] Verify report saves to Firebase

### Performance
- [ ] App loads in under 5 seconds
- [ ] Pagination loads instantly
- [ ] Skeleton loaders show during data fetch
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Firebase Rules Not Deploying
```bash
# Ensure you're in the project root
cd /path/to/casaloop

# Login again
firebase login

# Deploy rules manually
firebase deploy --only firestore:rules
```

### Pi SDK Not Loading
1. Check Developer Portal whitelist includes your exact URL
2. Verify API key is correct in code
3. Check browser console for errors
4. Ensure using HTTPS (not HTTP)

### Database Permissions Error
1. Deploy Firestore rules: `./scripts/deploy-firebase-rules.sh`
2. Check Firebase Console > Firestore > Rules tab
3. Verify rules were deployed successfully

### Images Not Uploading
1. Check Vercel Blob is configured
2. Verify BLOB_READ_WRITE_TOKEN environment variable
3. Check file size limits (max 4.5MB)

---

## 📞 Support

If you encounter issues:
1. Check console logs with `console.log("[v0] ...")`
2. Review Firebase Console for errors
3. Test with Firebase emulators locally
4. Check Pi Developer Portal for whitelist issues

---

## ✨ Features Summary

**Core Features:**
- Property listings with images
- Service provider marketplace
- Real-time messaging
- Pi Network payments
- Review & rating system
- Analytics dashboard

**Engagement Features:**
- Daily streak rewards (2x, 3x multipliers)
- Daily spin wheel (1-100 $CASA)
- Quest system with rewards
- Level & achievement system
- Leaderboards

**Security Features:**
- Multi-layer verification system
- Trust badges & scores
- Payment fraud detection
- Report & flag system
- Firestore security rules
- Server-side payment verification

**Performance Features:**
- 3-5 second initial load
- Pagination (10 items/page)
- Skeleton loading states
- Preconnect optimization
- Error boundaries

**Legal Compliance:**
- Privacy Policy page
- Terms of Service page
- Payment disclaimers
- Refund policies
- Dispute resolution

---

**CasaLoop is now ready for Pi Network mainnet! 🎉**
