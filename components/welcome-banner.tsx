"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeBannerProps {
  username: string;
  isNewUser: boolean;
  onDismiss: () => void;
}

export function WelcomeBanner({ username, isNewUser, onDismiss }: WelcomeBannerProps) {
  const [show, setShow] = useState(isNewUser);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(onDismiss, 300);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
      >
        <Card className="relative overflow-hidden border-2 border-primary bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    Welcome to CasaLoop!
                  </h3>
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Hey <span className="text-primary font-semibold">@{username}</span>! 
                  You've received <span className="text-primary font-bold">10 $CASA</span> welcome bonus!
                </p>
                
                <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                  <p>✨ Claim 3.4 $CASA daily</p>
                  <p>🎡 Spin the wheel for bonus rewards</p>
                  <p>🏆 Complete quests to earn more</p>
                </div>
                
                <Button
                  onClick={handleDismiss}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  Start Exploring
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
