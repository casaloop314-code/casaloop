"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Coins } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface MiningSystemProps {
  user: { uid: string; username: string };
}

export function MiningSystem({ user }: MiningSystemProps) {
  const [casaBalance, setCasaBalance] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [miningSessionEnd, setMiningSessionEnd] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  const MINING_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  const MINING_RATE = 3.14; // $CASA per session

  useEffect(() => {
    loadMiningData();
  }, [user.uid]);

  // Timer countdown
  useEffect(() => {
    if (isMining && miningSessionEnd > Date.now()) {
      const interval = setInterval(() => {
        const remaining = miningSessionEnd - Date.now();
        if (remaining <= 0) {
          setTimeRemaining(0);
          setIsMining(false);
          claimMiningReward();
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMining, miningSessionEnd]);

  const loadMiningData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setCasaBalance(data.casaPoints || 0);
        
        if (data.miningSessionEnd && data.miningSessionEnd > Date.now()) {
          setIsMining(true);
          setMiningSessionEnd(data.miningSessionEnd);
          setTimeRemaining(data.miningSessionEnd - Date.now());
        }
      }
    } catch (error) {
      console.error("[v0] Error loading mining data:", error);
    }
  };

  const startMining = async () => {
    try {
      const sessionEnd = Date.now() + MINING_DURATION;
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        miningSessionEnd: sessionEnd,
        lastMiningStart: Date.now()
      });

      setIsMining(true);
      setMiningSessionEnd(sessionEnd);
      setTimeRemaining(MINING_DURATION);

      toast({
        title: "Mining Started!",
        description: `You're now mining ${MINING_RATE} $CASA. Come back in 24 hours!`
      });
    } catch (error) {
      console.error("[v0] Error starting mining:", error);
      toast({
        title: "Error",
        description: "Failed to start mining session",
        variant: "destructive"
      });
    }
  };

  const claimMiningReward = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const newBalance = casaBalance + MINING_RATE;

      await updateDoc(userRef, {
        casaPoints: newBalance,
        miningSessionEnd: 0,
        lastMiningClaim: Date.now()
      });

      setCasaBalance(newBalance);
      
      toast({
        title: "Mining Complete!",
        description: `You earned ${MINING_RATE} $CASA! Start a new session.`
      });
    } catch (error) {
      console.error("[v0] Error claiming reward:", error);
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="border-border bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        {/* Balance Display - Pi Network Style */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
          </div>
          <div className="text-5xl font-bold text-foreground mb-1">
            {casaBalance.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">$CASA</p>
        </div>

        {/* Mining Button - Pi Network Style */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
          
          <button
            onClick={isMining ? undefined : startMining}
            disabled={isMining}
            className={`relative mx-auto block h-48 w-48 rounded-full transition-all duration-500 ${
              isMining 
                ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
                : 'bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/50 hover:scale-105 active:scale-95'
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
            
            <div className="relative h-full w-full flex flex-col items-center justify-center text-primary-foreground">
              {isMining ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-3 animate-pulse">
                    <Zap className="h-8 w-8" fill="currentColor" />
                  </div>
                  <p className="text-lg font-bold">Mining...</p>
                  <p className="text-sm opacity-90 mt-1">{formatTime(timeRemaining)}</p>
                  <p className="text-xs opacity-75 mt-1">{MINING_RATE} $CASA</p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <Zap className="h-8 w-8" />
                  </div>
                  <p className="text-2xl font-bold">Start Mining</p>
                  <p className="text-sm opacity-90 mt-2">Tap to mine</p>
                  <p className="text-xs opacity-75 mt-1">{MINING_RATE} $CASA / 24h</p>
                </>
              )}
            </div>

            {/* Pulse Effect when active */}
            {!isMining && (
              <>
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Mining Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          {isMining ? (
            <p>Mining session active. Check back when timer reaches zero!</p>
          ) : (
            <p>Start a mining session to earn $CASA tokens</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
