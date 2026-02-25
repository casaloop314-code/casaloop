"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Zap, Gift, Star, Coins } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface StreakSystemProps {
  user: { uid: string; username: string };
}

interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: number;
  totalCheckIns: number;
  spinAvailable: boolean;
  lastSpinDate: number;
}

const SPIN_REWARDS = [
  { label: '1 $CASA', value: 1, color: 'bg-gray-500', probability: 30 },
  { label: '3 $CASA', value: 3, color: 'bg-blue-500', probability: 25 },
  { label: '5 $CASA', value: 5, color: 'bg-green-500', probability: 20 },
  { label: '10 $CASA', value: 10, color: 'bg-yellow-500', probability: 15 },
  { label: '20 $CASA', value: 20, color: 'bg-orange-500', probability: 7 },
  { label: '50 $CASA', value: 50, color: 'bg-red-500', probability: 2 },
  { label: '100 $CASA', value: 100, color: 'bg-purple-500', probability: 1 },
];

export function StreakSystem({ user }: StreakSystemProps) {
  const [streakData, setStreakData] = useState<UserStreak | null>(null);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<typeof SPIN_REWARDS[0] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStreakData();
  }, [user.uid]);

  const loadStreakData = async () => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      setStreakData({
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        lastCheckIn: data.lastCheckIn || 0,
        totalCheckIns: data.totalCheckIns || 0,
        spinAvailable: data.spinAvailable !== false,
        lastSpinDate: data.lastSpinDate || 0
      });
    }
  };

  const checkIn = async () => {
    if (!streakData) return;

    const now = Date.now();
    const lastCheckIn = streakData.lastCheckIn;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceLastCheckIn = now - lastCheckIn;

    // Check if already checked in today
    if (timeSinceLastCheckIn < oneDayMs) {
      toast({
        title: "Already Checked In",
        description: "Come back tomorrow for your next check-in!",
      });
      return;
    }

    // Calculate new streak
    let newStreak = streakData.currentStreak;
    if (timeSinceLastCheckIn < 2 * oneDayMs) {
      // Within grace period, continue streak
      newStreak += 1;
    } else {
      // Streak broken, start over
      newStreak = 1;
    }

    const longestStreak = Math.max(streakData.longestStreak, newStreak);

    // Update Firestore
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      currentStreak: newStreak,
      longestStreak: longestStreak,
      lastCheckIn: now,
      totalCheckIns: streakData.totalCheckIns + 1,
      spinAvailable: true
    });

    // Calculate bonus
    const baseReward = 3.4;
    let multiplier = 1;
    if (newStreak >= 30) multiplier = 3;
    else if (newStreak >= 7) multiplier = 2;

    const reward = baseReward * multiplier;

    // Add bonus to casa points
    const casaPoints = (await getDoc(userRef)).data()?.casaPoints || 0;
    await updateDoc(userRef, {
      casaPoints: casaPoints + reward
    });

    setStreakData({
      ...streakData,
      currentStreak: newStreak,
      longestStreak: longestStreak,
      lastCheckIn: now,
      totalCheckIns: streakData.totalCheckIns + 1,
      spinAvailable: true
    });

    toast({
      title: `${newStreak} Day Streak! 🔥`,
      description: `You earned ${reward} $CASA (${multiplier}x multiplier)`,
    });
  };

  const spinWheel = async () => {
    if (!streakData?.spinAvailable) {
      toast({
        title: "Spin Not Available",
        description: "Check in daily to earn a spin!",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setShowSpinWheel(true);

    // Weighted random selection
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedReward = SPIN_REWARDS[0];

    for (const reward of SPIN_REWARDS) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        selectedReward = reward;
        break;
      }
    }

    // Simulate spinning animation
    setTimeout(async () => {
      setIsSpinning(false);
      setSpinResult(selectedReward);

      // Update user rewards
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const casaPoints = userDoc.data()?.casaPoints || 0;

      await updateDoc(userRef, {
        casaPoints: casaPoints + selectedReward.value,
        spinAvailable: false,
        lastSpinDate: Date.now()
      });

      setStreakData({
        ...streakData!,
        spinAvailable: false,
        lastSpinDate: Date.now()
      });

      toast({
        title: "Congratulations! 🎉",
        description: `You won ${selectedReward.value} $CASA!`,
      });
    }, 3000);
  };

  if (!streakData) return null;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🏆";
    if (streak >= 14) return "💎";
    if (streak >= 7) return "⭐";
    if (streak >= 3) return "🔥";
    return "✨";
  };

  const getMultiplier = (streak: number) => {
    if (streak >= 30) return 3;
    if (streak >= 7) return 2;
    return 1;
  };

  const multiplier = getMultiplier(streakData.currentStreak);

  return (
    <>
      <div className="space-y-3">
        {/* Streak Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-4">
            <div className="space-y-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Flame className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-4xl font-bold text-foreground flex items-center gap-2">
                      {streakData.currentStreak} <span className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Multiplier Info */}
            {multiplier > 1 && (
              <div className="p-2 rounded-lg bg-primary/10 text-center">
                <p className="text-sm font-semibold text-primary">
                  {multiplier}x Multiplier Active! 🎯
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep your streak going to earn more rewards
                </p>
              </div>
            )}

            {/* Progress to next multiplier */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to next reward</span>
                <span>{streakData.currentStreak}/7</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(100, (streakData.currentStreak / 7) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spin Wheel Card */}
        <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-background">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Gift className="h-7 w-7 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Daily Spin</p>
                  <p className="text-xs text-muted-foreground">
                    {streakData.spinAvailable ? "Spin available!" : "Check in to unlock"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={spinWheel}
                disabled={!streakData.spinAvailable}
                className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Star className="h-4 w-4" />
                Spin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{streakData.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{streakData.totalCheckIns}</p>
              <p className="text-xs text-muted-foreground">Total Check-ins</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spin Wheel Dialog */}
      <Dialog open={showSpinWheel} onOpenChange={setShowSpinWheel}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Daily Spin Wheel 🎰</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {isSpinning ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-8 border-primary/20 animate-spin">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                  </div>
                  <Coins className="absolute inset-0 m-auto h-12 w-12 text-white animate-pulse" />
                </div>
                <p className="text-center font-semibold text-foreground">Spinning...</p>
              </div>
            ) : spinResult ? (
              <div className="flex flex-col items-center gap-4">
                <div className={`h-32 w-32 rounded-full ${spinResult.color} flex items-center justify-center`}>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{spinResult.value}</p>
                    <p className="text-sm text-white">$CASA</p>
                  </div>
                </div>
                <p className="text-center font-semibold text-foreground text-xl">
                  You Won! 🎉
                </p>
                <Button onClick={() => setShowSpinWheel(false)} className="w-full">
                  Collect Reward
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
