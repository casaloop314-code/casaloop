import { db } from './firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

/**
 * Test Firebase connection
 * Returns true if connection is working, false otherwise
 */
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('[v0] Testing Firebase connection...');
    
    // Try to read from a collection (any collection will work)
    const testQuery = query(collection(db, 'users'), limit(1));
    await getDocs(testQuery);
    
    console.log('[v0] Firebase connection successful');
    return true;
  } catch (error) {
    console.error('[v0] Firebase connection failed:', error);
    
    if (error instanceof Error) {
      // Check for common Firebase errors
      if (error.message.includes('not available')) {
        console.error('[v0] Firestore service is not available - check Firebase config');
      } else if (error.message.includes('permission')) {
        console.error('[v0] Permission denied - check Firestore security rules');
      } else if (error.message.includes('network')) {
        console.error('[v0] Network error - check internet connection');
      }
    }
    
    return false;
  }
}

/**
 * Get user-friendly error message for Firebase errors
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unknown error occurred';
  }

  const message = error.message.toLowerCase();

  if (message.includes('not available')) {
    return 'Database service is not available. Please check your internet connection and try again.';
  }
  
  if (message.includes('permission') || message.includes('denied')) {
    return 'Access denied. Please contact support if this persists.';
  }
  
  if (message.includes('network') || message.includes('failed to fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (message.includes('quota')) {
    return 'Service temporarily unavailable. Please try again later.';
  }

  return 'Unable to connect to database. Please try again.';
}
