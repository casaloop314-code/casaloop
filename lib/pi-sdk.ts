export interface PiUser {
  uid: string;
  username: string;
}

export interface PiSDK {
  init: (config: { version: string; sandbox: boolean }) => Promise<void>;
  authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => void) => Promise<PiUser>;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}

export const initializePi = async (): Promise<PiSDK | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  console.log('[v0] Starting Pi SDK polling...');
  
  // Poll for window.Pi with a maximum of 10 attempts (5 seconds)
  const maxAttempts = 10;
  const pollInterval = 500; // milliseconds
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[v0] Polling attempt ${attempt}/${maxAttempts} - checking for window.Pi...`);
    
    if (window.Pi) {
      console.log('[v0] Pi SDK found! Initializing...');
      try {
        await window.Pi.init({ version: "2.0", sandbox: true });
        console.log('[v0] Pi SDK initialized successfully in sandbox mode');
        return window.Pi;
      } catch (error) {
        console.error('[v0] Pi SDK initialization error:', error);
        return null;
      }
    }
    
    // If not found and not the last attempt, wait before next check
    if (attempt < maxAttempts) {
      console.log(`[v0] Pi SDK not found yet, waiting ${pollInterval}ms...`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  
  // All attempts exhausted
  console.error('[v0] Pi SDK not found after 10 attempts (5 seconds)');
  return null;
};
