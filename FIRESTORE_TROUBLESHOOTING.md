# Firestore Troubleshooting Guide

If you're seeing "Service firestore is not available" error, follow these steps:

## Step 1: Verify Firestore is Created

1. Go to: https://console.firebase.google.com
2. Select your CasaLoop project
3. Click "Firestore Database" in the left sidebar
4. You should see:
   - ✅ A database dashboard with "Data", "Rules", "Indexes" tabs
   - ✅ A message saying "Cloud Firestore" at the top
   - ❌ If you see "Create database" button, Firestore is NOT created yet

## Step 2: Check Database Status

After creating Firestore, it takes 2-3 minutes to fully initialize.

**Signs Firestore is ready:**
- You can click on "Data" tab and see collections
- No loading spinners or "Provisioning" messages
- You can manually add a test document

## Step 3: Verify Security Rules

1. In Firebase Console > Firestore Database
2. Click "Rules" tab
3. You should see rules like this for testing:

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

4. Click "Publish" if you made changes
5. Wait 30 seconds for rules to deploy

## Step 4: Check Firebase Config

Open `/lib/firebase-config.ts` and verify:
- ✅ All values are filled in (no "YOUR_..." placeholders)
- ✅ Values match Firebase Console > Project Settings
- ✅ No extra quotes or spaces
- ✅ apiKey starts with "AIza..."
- ✅ projectId matches your project

## Step 5: Run Diagnostic Test

```bash
# In your terminal
npm run test:firestore
```

Or manually:
```bash
npx tsx scripts/test-firestore-connection.ts
```

This will:
- Test Firebase initialization
- Test Firestore connection
- Test read/write permissions
- Show specific error messages

## Step 6: Common Fixes

### Error: "PERMISSION_DENIED"
**Problem:** Security rules are too restrictive
**Fix:** Change rules to test mode (see Step 3)

### Error: "Service unavailable"
**Problem:** Firestore not fully initialized
**Fix:** Wait 5 minutes after creating database, then refresh

### Error: "Failed to get document"
**Problem:** Database exists but can't connect
**Fix:** 
1. Check internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private window

### Error: "Invalid API key"
**Problem:** Wrong Firebase config
**Fix:** Copy values again from Firebase Console

## Step 7: Manual Test in Firebase Console

1. Go to Firestore Database > Data tab
2. Click "Start collection"
3. Collection ID: `test`
4. Document ID: Auto-ID
5. Add field: `message` (string) = `"hello"`
6. Click Save
7. If successful, Firestore is working

## Step 8: Clear Cache and Retry

If everything above looks correct:
1. Clear browser cache completely
2. Close all browser tabs
3. Restart your development server
4. Open app in fresh browser tab

## Still Not Working?

Check these:
- [ ] Firebase project has billing enabled (free tier is fine)
- [ ] You're logged into the correct Google account
- [ ] Project is in the correct region
- [ ] No browser extensions blocking Firebase
- [ ] Try different browser (Chrome recommended)

## Get Help

If none of these work, check:
1. Console logs in browser (F12 > Console)
2. Network tab for failed requests
3. Firebase Console > Usage tab for errors
