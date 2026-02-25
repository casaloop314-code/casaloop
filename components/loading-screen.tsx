"use client";

import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  error?: string | null;
  onRetry?: () => void;
  message?: string;
  status?: string;
}

export function LoadingScreen({ error, onRetry, message = "Entering CasaLoop...", status }: LoadingScreenProps) {
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Authentication Error</h2>
            {status && (
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Status: {status}
              </div>
            )}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Auth
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
          {/* Pulsing background ring */}
          <div className="absolute inset-0 h-20 w-20 rounded-full bg-primary/20 animate-pulse" />
          <div className="relative h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary">CasaLoop</h2>
          <p className="text-muted-foreground animate-pulse">{message}</p>
          {status && (
            <div className="mt-3 pt-3 border-t border-border animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-semibold text-primary">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
