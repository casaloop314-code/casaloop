/**
 * Firestore Connection Diagnostic Test
 * Run this to verify your Firestore setup
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../lib/firebase-config';

async function testFirestoreConnection() {
  console.log("=== FIRESTORE CONNECTION TEST ===\n");
  
  try {
    // Step 1: Test Firebase initialization
    console.log("1. Testing Firebase initialization...");
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    console.log("   ✅ Firebase app initialized successfully");
    console.log("   Project ID:", app.options.projectId);
    console.log("");

    // Step 2: Test Firestore initialization
    console.log("2. Testing Firestore initialization...");
    const db = getFirestore(app);
    console.log("   ✅ Firestore instance created");
    console.log("");

    // Step 3: Test write permission
    console.log("3. Testing WRITE permission...");
    const testData = {
      test: true,
      message: "CasaLoop connection test",
      timestamp: Date.now()
    };
    
    const docRef = await addDoc(collection(db, "connection_test"), testData);
    console.log("   ✅ Write successful! Document ID:", docRef.id);
    console.log("");

    // Step 4: Test read permission
    console.log("4. Testing READ permission...");
    const querySnapshot = await getDocs(collection(db, "connection_test"));
    console.log("   ✅ Read successful! Found", querySnapshot.size, "document(s)");
    console.log("");

    // Step 5: Clean up test document
    console.log("5. Cleaning up test data...");
    await deleteDoc(doc(db, "connection_test", docRef.id));
    console.log("   ✅ Cleanup successful");
    console.log("");

    // Success summary
    console.log("=== ALL TESTS PASSED ===");
    console.log("Your Firestore database is configured correctly!");
    console.log("\nNext steps:");
    console.log("- Your app should now work properly");
    console.log("- If you still see errors, clear your browser cache");
    
  } catch (error: any) {
    console.error("\n❌ TEST FAILED\n");
    console.error("Error:", error.message);
    console.error("\nCommon issues:");
    
    if (error.message.includes("PERMISSION_DENIED")) {
      console.error("- Issue: Firestore security rules are blocking access");
      console.error("- Solution: Go to Firebase Console > Firestore Database > Rules");
      console.error("- Change to test mode or use these rules:");
      console.error("\n  rules_version = '2';");
      console.error("  service cloud.firestore {");
      console.error("    match /databases/{database}/documents {");
      console.error("      match /{document=**} {");
      console.error("        allow read, write: if true;");
      console.error("      }");
      console.error("    }");
      console.error("  }\n");
    } else if (error.message.includes("not available") || error.message.includes("unavailable")) {
      console.error("- Issue: Firestore service is not enabled or still initializing");
      console.error("- Solution:");
      console.error("  1. Go to Firebase Console (console.firebase.google.com)");
      console.error("  2. Select your project");
      console.error("  3. Click 'Firestore Database' in left menu");
      console.error("  4. If you see 'Create database' button, click it");
      console.error("  5. Wait 2-3 minutes for database to fully initialize");
      console.error("  6. Refresh this page and try again");
    } else if (error.message.includes("apiKey")) {
      console.error("- Issue: Invalid Firebase configuration");
      console.error("- Solution: Check your firebase-config.ts file");
      console.error("- Make sure all values match your Firebase Console settings");
    } else {
      console.error("- Unknown error. Full details:", error);
    }
  }
}

// Run the test
testFirestoreConnection();

export { testFirestoreConnection };
