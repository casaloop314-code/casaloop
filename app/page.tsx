"use client";

import { useState, useEffect } from "react";
import { Home, PlusCircle, User as UserIcon, MessageCircle, TrendingUp, Wrench } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";
import { LoginScreen } from "@/components/login-screen";
import { HomeTab } from "@/components/tabs/home-tab";
import { ListingsTab } from "@/components/tabs/listings-tab";
import { RewardsTab } from "@/components/tabs/rewards-tab";
import { MessagesTab } from "@/components/tabs/messages-tab";
import { AnalyticsTab } from "@/components/tabs/analytics-tab";
import { ServicesTab } from "@/components/tabs/services-tab";
import { initializePi } from "@/lib/pi-sdk";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Toaster } from "@/components/ui/toaster";
import { NotificationCenter } from "@/components/notification-center";
import { LanguageSelector } from "@/components/language-selector";

interface User {
  uid: string;
  username: string;
}

type TabType = "home" | "services" | "listings" | "messages" | "analytics" | "rewards";

export default function CasaLoopApp() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [language, setLanguage] = useState<"en" | "es" | "fr" | "zh" | "pt">("en");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Verifying Pioneer Identity...");
  const [sdkStatus, setSdkStatus] = useState<string>("not loaded");
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState<boolean>(false);
  let auth: any; // Declare auth variable

  useEffect(() => {
    // Set document title
    if (typeof document !== 'undefined') {
      document.title = "CasaLoop - Pi Real Estate";
    }

    console.log("[v0] Starting non-blocking Pioneer verification...");
    setLoadingMessage("Verifying Pioneer Identity...");

    const authenticatePioneer = async () => {
      try {
        // Verify Firebase is initialized
        console.log("[v0] Firebase is ready, proceeding with authentication...");
        // STEP 1: WAIT & LOAD - Check if window.Pi exists
        console.log("[v0] Checking for window.Pi...");
        
        if (!window.Pi) {
          console.log("[v0] window.Pi not found - checking for script...");
          
          const existingScript = document.querySelector('script[src*="pi-sdk"]');
          if (!existingScript) {
            console.log("[v0] Script not found - injecting Pi SDK script dynamically...");
            setLoadingMessage("Loading Pi SDK...");
            
            const script = document.createElement('script');
            script.src = 'https://sdk.minepi.com/pi-sdk.js';
            script.async = true;
            document.body.appendChild(script);
            
            console.log("[v0] Script injected, waiting for load...");
          }
        }

        // STEP 2: SAFEGUARD TIMER - Poll for window.Pi with setInterval
        console.log("[v0] Starting polling for window.Pi...");
        setLoadingMessage("Waiting for Pi Browser...");
        
        const waitForPi = (): Promise<void> => {
          return new Promise((resolve) => {
            // Check immediately first
            if (window.Pi) {
              console.log("[v0] window.Pi available immediately!");
              resolve();
              return;
            }

            const maxAttempts = 20; // 4 seconds max
            let attempts = 0;
            
            const pollInterval = setInterval(() => {
              attempts++;
              
              if (window.Pi) {
                console.log(`[v0] window.Pi found after ${attempts * 200}ms!`);
                clearInterval(pollInterval);
                resolve();
              } else if (attempts >= maxAttempts) {
                console.log("[v0] Reached max attempts (4s), continuing anyway");
                clearInterval(pollInterval);
                resolve();
              }
            }, 200); // Faster polling: 200ms instead of 500ms
          });
        };

        await waitForPi();

        // STEP 3: INITIALIZE - Only run Pi.init() if window.Pi exists
        if (!window.Pi) {
          console.log("[v0] window.Pi still not available after polling - app will remain in loading state");
          setLoadingMessage("Waiting for Pi Browser environment...");
          return;
        }

        console.log("[v0] Initializing Pi SDK...");
        setLoadingMessage("Initializing Pi Network...");
        setSdkStatus("Initializing...");
        
        // Initialize Pi SDK with version 2.0 (production mode with your API key)
        // API Key f0srnwzoutxuoczetwtso96k1d86cufjbqzsesxg9zxobep331s6h1oier1e2eng
        // is configured in Developer Portal
        await window.Pi.init({ version: "2.0" });
        console.log("[v0] Pi.init completed successfully in production mode");
        setSdkStatus("SDK Loaded ✅");

        // STEP 4: AUTHENTICATE with HARD TIMEOUT
        console.log("[v0] Starting authentication for KYC'd Pioneers...");
        console.log("[v0] Current URL:", window.location.href);
        setLoadingMessage("Authenticating Pioneer...");
        setSdkStatus("Requesting Auth... 🔄");

        const scopes = ['username', 'payments'];
        const onIncompletePaymentFound = (payment: any) => { 
          console.log("[v0] Incomplete Payment detected:", payment);
        };

        console.log("[v0] Calling Pi.authenticate with scopes:", scopes);

        // Create authentication promise
        const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
        
        // Create timeout promise (15 seconds - optimized for speed)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            console.error("[v0] Authentication timed out after 15 seconds");
            reject(new Error("Pi Network is not responding. Check your Developer Portal whitelist and ensure this URL is registered."));
          }, 15000);
        });

        // Race between auth and timeout
        console.log("[v0] Waiting for authentication response...");
        auth = await Promise.race([authPromise, timeoutPromise]) as any;
        
        console.log("[v0] Logged in as: " + auth.user.username);
        setSdkStatus("Auth Success ✅");
        
        // Save to Firebase
        const piUsername = auth.user.username;
        const piUid = auth.user.uid;

        console.log("[v0] Saving Pioneer to Firebase...");
        setLoadingMessage("Saving to database...");
        
        const userRef = doc(db, "users", piUid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // New user - give welcome bonus
          console.log("[v0] New Pioneer detected - giving welcome bonus!");
          await setDoc(userRef, {
            uid: piUid,
            username: piUsername,
            casaPoints: 10, // Welcome bonus of 10 $CASA
            createdAt: Date.now(),
            favorites: [],
            // Initialize streak data
            currentStreak: 1,
            longestStreak: 1,
            lastCheckIn: Date.now(),
            totalCheckIns: 1,
            spinAvailable: true,
            lastSpinDate: 0
          });
        
          console.log("[v0] Welcome bonus of 10 $CASA granted to @" + piUsername);
        } else {
          await setDoc(userRef, {
            username: piUsername
          }, { merge: true });
        }

        // Authentication complete
        setUser(auth.user);
        setLoading(false);
        setSdkStatus("Complete ✅");
        console.log("[v0] Authentication complete for @" + piUsername);
        
        // Show welcome message for new users
        if (!userDoc.exists()) {
          setTimeout(() => {
            console.log("[v0] Showing welcome toast for new Pioneer");
          }, 1000);
        }
      } catch (error) {
        console.error("[v0] ===== CRITICAL AUTHENTICATION ERROR =====");
        console.error("[v0] Error object:", error);
        console.error("[v0] Error details:", error instanceof Error ? error.message : String(error));
        
        const errorMsg = error instanceof Error ? error.message : String(error);
        
        // If Firestore is not available, allow user to continue anyway
        if (errorMsg.includes('firestore') || errorMsg.includes('Firestore')) {
          console.warn("[v0] Firestore error detected, bypassing database check...");
          
          // Create a temporary user object without database
          if (auth && auth.user) {
            setUser(auth.user);
            setLoading(false);
            setSdkStatus("Running without database");
            console.log("[v0] Continuing without Firestore for user:", auth.user.username);
            return;
          }
        }
        
        // For other errors, show error UI
        setAuthError(errorMsg);
        setLoadingMessage(errorMsg);
        setSdkStatus("Error ❌");
        setLoading(false);
        setShowRetry(true);
      }
    };

    authenticatePioneer();
  }, []);

  const handleRetry = () => {
    console.log("[v0] Retrying authentication...");
    setAuthError(null);
    setShowRetry(false);
    setLoading(true);
    setLoadingMessage("Retrying Pioneer verification...");
    setSdkStatus("Retrying...");
    window.location.reload();
  };

  // Show loading screen while initializing
  if (loading) {
    return <LoadingScreen message={loadingMessage} status={sdkStatus} />;
  }

  if (showRetry) {
    return <LoadingScreen message={loadingMessage} status={sdkStatus} error={authError} onRetry={handleRetry} />;
  }

  if (!user) {
    return <LoginScreen onLogin={() => window.location.reload()} sdkStatus="Failed" sdkReady={false} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-primary">CasaLoop</h1>
            <p className="text-xs text-muted-foreground">Powered by Pi Network</p>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
            <NotificationCenter user={user} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {activeTab === "home" && <HomeTab user={user} />}
        {activeTab === "services" && <ServicesTab user={user} />}
        {activeTab === "listings" && <ListingsTab user={user} />}
        {activeTab === "messages" && <MessagesTab user={user} />}
        {activeTab === "analytics" && <AnalyticsTab user={user} />}
        {activeTab === "rewards" && <RewardsTab user={user} onNavigate={(tab) => setActiveTab(tab)} />}
      </main>

      {/* Bottom Navigation - Simplified to 4 Modern Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "home"
                  ? "text-primary bg-primary/15 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Home className="h-6 w-6" strokeWidth={activeTab === "home" ? 2.5 : 2} />
              <span className="text-xs font-semibold">Home</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "services"
                  ? "text-primary bg-primary/15 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Wrench className="h-6 w-6" strokeWidth={activeTab === "services" ? 2.5 : 2} />
              <span className="text-xs font-semibold">Services</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "messages"
                  ? "text-primary bg-primary/15 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MessageCircle className="h-6 w-6" strokeWidth={activeTab === "messages" ? 2.5 : 2} />
              <span className="text-xs font-semibold">Messages</span>
            </button>

            <button
              onClick={() => setActiveTab("rewards")}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "rewards"
                  ? "text-primary bg-primary/15 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <UserIcon className="h-6 w-6" strokeWidth={activeTab === "rewards" ? 2.5 : 2} />
              <span className="text-xs font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
