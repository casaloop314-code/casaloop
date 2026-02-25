"use client";

import { Button } from "@/components/ui/button";
import { Building2, Lock, Coins } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  sdkStatus: string;
  sdkReady: boolean;
}

export function LoginScreen({ onLogin, sdkStatus, sdkReady }: LoginScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              CasaLoop
            </h1>
            <p className="text-muted-foreground text-lg">
              Real Estate on Pi Network
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Premium Properties
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse and list properties worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Secure Transactions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pay securely with Pi cryptocurrency
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Earn Rewards
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get daily $CASA points for engagement
                </p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="space-y-3">
            <Button
              onClick={onLogin}
              size="lg"
              disabled={!sdkReady}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login with Pi Network
            </Button>

            {/* System Status */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                System Status: <span className={sdkReady ? "text-primary" : "text-yellow-500"}>{sdkStatus}</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to CasaLoop's Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
