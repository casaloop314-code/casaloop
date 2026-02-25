"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Gift, TrendingUp, Sparkles, MapPin, Calendar, User as UserIcon, PlusCircle, BarChart3, FileText, Shield, Info } from "lucide-react";
import { doc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { User, Reservation } from "@/lib/casaloop-types";
import { StreakSystem } from "@/components/streak-system";
import { QuestSystem } from "@/components/quest-system";
import { MiningSystem } from "@/components/mining-system";

interface RewardsTabProps {
  user: { uid: string; username: string };
  onNavigate?: (tab: 'listings' | 'analytics') => void;
}

export function RewardsTab({ user, onNavigate }: RewardsTabProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const { toast } = useToast();

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as User;
        setUserData(data);
        checkClaimEligibility(data.lastClaimDate);
      }
    } catch (error) {
      console.error("[CasaLoop] Error loading user data:", error);
    }
  };

  const loadReservations = async () => {
    try {
      const reservationsCollection = collection(db, "reservations");
      const q = query(reservationsCollection, where("userId", "==", user.uid), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reservationsData: Reservation[] = [];
        querySnapshot.forEach((doc) => {
          reservationsData.push(doc.data() as Reservation);
        });
        setReservations(reservationsData);
        setLoadingReservations(false);
      }, (error) => {
        console.error("[CasaLoop] Error in reservations snapshot:", error);
        setLoadingReservations(false);
      });
    } catch (error) {
      console.error("[CasaLoop] Error loading reservations:", error);
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    loadUserData();
    loadReservations();
  }, [user.uid]);

  const checkClaimEligibility = (lastClaimDate?: number) => {
    if (!lastClaimDate) {
      setCanClaim(true);
      return;
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceClaim = now - lastClaimDate;
    
    setCanClaim(timeSinceClaim >= oneDayMs);
  };

  const handleClaim = async () => {
    if (!canClaim || loading) return;

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const newPoints = (userData?.casaPoints || 0) + 3.4;

      await updateDoc(userRef, {
        casaPoints: newPoints,
        lastClaimDate: Date.now()
      });

      setUserData({
        ...userData!,
        casaPoints: newPoints,
        lastClaimDate: Date.now()
      });

      setCanClaim(false);

      toast({
        title: "Reward Claimed!",
        description: "You earned 3.4 $CASA points",
      });
    } catch (error) {
      console.error("[CasaLoop] Error claiming reward:", error);
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilNextClaim = () => {
    if (!userData?.lastClaimDate) return "";

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceClaim = now - userData.lastClaimDate;
    const timeUntilNext = oneDayMs - timeSinceClaim;

    if (timeUntilNext <= 0) return "Available now!";

    const hours = Math.floor(timeUntilNext / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNext % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Profile Header - Modern Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-4 ring-primary/20">
            <UserIcon className="h-9 w-9 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            <p className="text-lg font-semibold text-primary">@{user.username}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Pi Network Pioneer
            </p>
          </div>
        </div>
      </div>

      {/* Mining System - Pi Network Style */}
      <MiningSystem user={user} />

      {/* Quick Navigation - Streamlined */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate?.('listings')}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-sm">My Listings</p>
              <p className="text-xs text-muted-foreground">Manage</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('analytics')}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card border-2 border-border hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
          >
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-sm">Analytics</p>
              <p className="text-xs text-muted-foreground">Insights</p>
            </div>
          </button>
        </div>
      </div>

      {/* Streak System */}
      <StreakSystem user={user} />

      {/* Quest System */}
      <QuestSystem user={user} />



      {/* Info Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">List Properties</p>
              <p className="text-sm text-muted-foreground">
                Earn points for every property you list
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Daily Login</p>
              <p className="text-sm text-muted-foreground">
                Claim your daily reward every 24 hours
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Stay Active</p>
              <p className="text-sm text-muted-foreground">
                Engage with the community to earn bonus points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Reservations Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            My Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingReservations ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/30 mb-3">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No reservations yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Reserve a property to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate mb-1">
                        {reservation.propertyTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{reservation.propertyLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{formatDate(reservation.reservationDate)}</span>
                      </div>
                    </div>
                    <Badge 
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex-shrink-0"
                    >
                      Reserved
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-foreground">
                      π {reservation.propertyPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal & Policy Links */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <a
              href="/privacy"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Privacy Policy</p>
                <p className="text-xs text-muted-foreground">How we protect your data</p>
              </div>
            </a>

            <a
              href="/terms"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Terms of Service</p>
                <p className="text-xs text-muted-foreground">Rules and guidelines</p>
              </div>
            </a>

            <a
              href="/about"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Info className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">About Us</p>
                <p className="text-xs text-muted-foreground">Our vision and mission</p>
              </div>
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              CasaLoop v1.0 - Built on Pi Network
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2026 CasaLoop. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
