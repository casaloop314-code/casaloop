"use client";

import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price_in_pi: number;
}

export interface PaymentCallbacks {
  onComplete?: (payment: any) => void;
  onError?: (error: any) => void;
}

export interface PaymentParams extends PaymentCallbacks {
  amount: number;
  memo: string;
  metadata: {
    productId: string;
    [key: string]: any;
  };
}

declare global {
  interface Window {
    pay?: (params: PaymentParams) => void;
  }
}

// Mock products data - in a real app, this would come from an API
const PRODUCTS: Product[] = [
  {
    id: "69775a665c9cf7437b8113c9",
    name: "Property reservation",
    description: "Secure your priority interest in this property. Paying this reservation fee alerts the agent immediately and holds your spot for the next available viewing slot. This ensures you are first in line for your dream home",
    price_in_pi: 0.01
  }
];

export function usePiAuth() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate loading products (in production, fetch from API)
    setProducts(PRODUCTS);
    setIsReady(true);

    // Initialize window.pay function if not already available
    if (typeof window !== "undefined" && !window.pay) {
      window.pay = (params: PaymentParams) => {
        console.log("[v0] Payment initiated:", params);
        
        // In sandbox mode, simulate a successful payment after a short delay
        setTimeout(() => {
          console.log("[v0] Payment completed (simulated)");
          if (params.onComplete) {
            params.onComplete({
              identifier: `payment_${Date.now()}`,
              amount: params.amount,
              memo: params.memo,
              metadata: params.metadata
            });
          }
        }, 1500);
      };
    }
  }, []);

  return {
    products,
    isReady
  };
}
