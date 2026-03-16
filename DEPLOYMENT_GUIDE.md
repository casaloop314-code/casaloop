# CasaLoop Deployment Guide

## Production-Ready Checklist

### 1. Firebase Security Rules

**IMPORTANT:** Deploy the Firestore security rules to protect your database.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

The `firestore.rules` file includes:
- User data protection (users can only edit their own data)
- Listing ownership validation
- Read-only payment logs
- Message sender verification
- Report submission controls

### 2. Environment Variables

Set these in Vercel (or your hosting platform):

```
NEXT_PUBLIC_PI_API_KEY=f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 4. Pi Network Developer Portal Configuration

1. Go to https://develop.pi
2. Update your app settings:
   - **App URL**: Your production Vercel URL (e.g., https://casaloop.vercel.app)
   - **Authorized Domains**: Add your production domain
   - **Payment Settings**: Enable Pi Payments
   - **Webhook URL**: `https://your-domain.vercel.app/api/verify-payment`

3. Complete app information:
   - Upload app icon (512x512px)
   - Add screenshots
   - Add privacy policy URL: `https://your-domain.vercel.app/privacy`
   - Add terms of service URL: `https://your-domain.vercel.app/terms`

4. Submit for review

## Key Features Implemented

### Security Features

1. **Firebase Security Rules** - Database protected with granular access controls
2. **Payment Verification API** - Server-side payment validation with Pi Network
3. **Fraud Detection** - Rate limiting, duplicate transaction prevention, audit trails
4. **Error Boundary** - Graceful error handling with user-friendly messages
5. **Report System** - Users can flag suspicious listings, services, or users

### Performance Features

1. **Pagination** - Properties load 10 at a time for better performance
2. **Image Optimization** - Vercel Blob for efficient image storage and delivery
3. **Optimistic Updates** - Immediate UI feedback for better UX

### User Experience

1. **Modern Navigation** - 4-tab bottom navigation for easy mobile access
2. **Streak System** - Daily rewards to encourage engagement
3. **Daily Spin Wheel** - Gamified rewards
4. **Quest System** - Guided user engagement
5. **Verification Badges** - Trust indicators for sellers and service providers

## Testing Before Production

### 1. Test Payment Flow

```javascript
// Test payment verification
const response = await fetch('/api/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentId: 'test_payment_id',
    userId: 'user_uid',
    amount: 100,
    type: 'reservation',
    propertyId: 'property_id'
  })
});
```

### 2. Test Firebase Rules

Use Firebase Console > Firestore > Rules Playground to test:
- User can read their own data
- User cannot edit other users' data
- Payment logs are read-only
- Reports can be created but not modified

### 3. Test Error Handling

- Disconnect internet and verify error messages
- Try invalid payment IDs
- Test with duplicate payment IDs

### 4. Test Pagination

- Create 15+ listings
- Verify pagination controls appear
- Test page navigation

## Monitoring

### 1. Firebase Console

Monitor:
- Database reads/writes
- Authentication attempts
- Error logs

### 2. Vercel Analytics

Track:
- Page load times
- API response times
- Error rates

### 3. Payment Logs

Check Firestore `paymentLogs` collection for:
- Successful payments
- Failed payment attempts
- Fraud scores

## Common Issues & Solutions

### Payment Verification Fails

**Issue**: Payment verification returns 400 error

**Solution**:
1. Check Pi API key is correct
2. Verify payment ID is valid from Pi SDK
3. Check user ID matches authenticated user
4. Ensure amount matches exactly

### Firebase Permission Denied

**Issue**: Users see "Permission denied" errors

**Solution**:
1. Deploy Firestore security rules
2. Verify user is authenticated
3. Check user is editing their own data

### Images Not Loading

**Issue**: Uploaded images don't display

**Solution**:
1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check Vercel Blob storage quota
3. Ensure images are uploaded with `access: 'public'`

### Pagination Not Working

**Issue**: All properties load at once

**Solution**:
1. Clear browser cache
2. Verify `paginatedProperties` is used in render
3. Check `ITEMS_PER_PAGE` constant

## Support

For issues or questions:
1. Check Firebase logs for errors
2. Check Vercel deployment logs
3. Test in Pi Browser specifically
4. Review Pi Network developer documentation: https://developers.minepi.com

## Legal Compliance

Ensure you:
- Display Privacy Policy and Terms of Service links
- Handle user data according to GDPR/local laws
- Implement right to deletion (contact support)
- Keep payment records for 7 years (legal requirement)
- Respond to user reports within reasonable time

## Post-Launch

1. Monitor reports collection for flagged content
2. Review payment logs for suspicious activity
3. Update content based on user feedback
4. Add features based on analytics
5. Respond to Pi Network review feedback promptly
