'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Don't crash the app for Firestore errors - let it recover
    const isFirestoreError = 
      error.message?.toLowerCase().includes('firestore') ||
      error.message?.toLowerCase().includes('service') ||
      error.message?.toLowerCase().includes('firebase') ||
      error.message?.toLowerCase().includes('unavailable');
    
    if (isFirestoreError) {
      console.warn('[CasaLoop] Firestore error caught - recovering:', error.message);
      return { hasError: false, error: null, errorInfo: null };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isFirestoreError = 
      error.message?.toLowerCase().includes('firestore') ||
      error.message?.toLowerCase().includes('service') ||
      error.message?.toLowerCase().includes('firebase') ||
      error.message?.toLowerCase().includes('unavailable');

    if (!isFirestoreError) {
      console.error('[CasaLoop] Error caught by boundary:', error, errorInfo);
      this.setState({ error, errorInfo });
    } else {
      console.warn('[CasaLoop] Firestore error suppressed:', error.message);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {this.state.error && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="w-full gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
