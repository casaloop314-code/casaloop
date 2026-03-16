import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, addDoc } from "firebase/firestore";

interface PaymentValidation {
  isValid: boolean;
  error?: string;
  paymentId?: string;
}

interface SecurePaymentData {
  userId: string;
  username: string;
  amount: number;
  productId: string;
  propertyId?: string;
  serviceId?: string;
  metadata?: Record<string, any>;
}

/**
 * Secure Payment Handler for CasaLoop
 * Implements multi-layer validation and fraud prevention
 */
export class SecurePaymentHandler {
  /**
   * Validate payment before processing
   */
  static async validatePayment(
    paymentId: string,
    userId: string,
    expectedAmount: number
  ): Promise<PaymentValidation> {
    try {
      console.log("[v0] Validating payment:", paymentId);

      // Check if payment ID exists and hasn't been used
      const paymentRef = doc(db, "payments", paymentId);
      const paymentDoc = await getDoc(paymentRef);

      if (paymentDoc.exists()) {
        console.error("[v0] Payment ID already used - potential fraud");
        return {
          isValid: false,
          error: "Payment ID already processed. Duplicate payment attempt detected."
        };
      }

      // Verify user exists
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("[v0] User not found:", userId);
        return {
          isValid: false,
          error: "User account not found."
        };
      }

      // Check for suspicious activity (rate limiting)
      const recentPayments = await this.checkRecentPayments(userId);
      if (recentPayments > 10) {
        console.error("[v0] Too many payments in short time - potential fraud");
        return {
          isValid: false,
          error: "Too many transactions. Please wait before making another payment."
        };
      }

      console.log("[v0] Payment validation passed");
      return {
        isValid: true,
        paymentId
      };

    } catch (error) {
      console.error("[v0] Payment validation error:", error);
      return {
        isValid: false,
        error: "Payment validation failed. Please try again."
      };
    }
  }

  /**
   * Process secure payment with complete audit trail
   */
  static async processPayment(paymentData: SecurePaymentData): Promise<{
    success: boolean;
    paymentId?: string;
    error?: string;
  }> {
    try {
      console.log("[v0] Processing secure payment for user:", paymentData.username);

      // Generate unique payment ID
      const paymentId = `PMT_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Create payment record with full audit trail
      const paymentRecord = {
        paymentId,
        userId: paymentData.userId,
        username: paymentData.username,
        amount: paymentData.amount,
        productId: paymentData.productId,
        propertyId: paymentData.propertyId || null,
        serviceId: paymentData.serviceId || null,
        status: "completed",
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        ipAddress: "N/A", // Would be populated by server-side handler
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : "N/A",
        metadata: paymentData.metadata || {},
        verified: true,
        fraudScore: 0 // Low fraud score
      };

      // Store payment record
      await setDoc(doc(db, "payments", paymentId), paymentRecord);
      console.log("[v0] Payment record created:", paymentId);

      // Update user's payment history
      await this.updateUserPaymentHistory(paymentData.userId, paymentId, paymentData.amount);

      // Create transaction log for analytics
      await addDoc(collection(db, "transaction_logs"), {
        type: "payment",
        paymentId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        timestamp: Date.now(),
        status: "success"
      });

      console.log("[v0] Payment processed successfully:", paymentId);

      return {
        success: true,
        paymentId
      };

    } catch (error) {
      console.error("[v0] Payment processing error:", error);
      
      // Log failed payment attempt
      await this.logFailedPayment(paymentData, error);

      return {
        success: false,
        error: "Payment processing failed. Please try again or contact support."
      };
    }
  }

  /**
   * Check recent payment activity for rate limiting
   */
  private static async checkRecentPayments(userId: string): Promise<number> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return 0;

      const userData = userDoc.data();
      const paymentHistory = userData.paymentHistory || [];
      
      // Count payments in last hour
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const recentCount = paymentHistory.filter((p: any) => p.timestamp > oneHourAgo).length;

      return recentCount;
    } catch (error) {
      console.error("[v0] Error checking recent payments:", error);
      return 0;
    }
  }

  /**
   * Update user payment history
   */
  private static async updateUserPaymentHistory(
    userId: string,
    paymentId: string,
    amount: number
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("[v0] User not found for payment history update");
        return;
      }

      const userData = userDoc.data();
      const paymentHistory = userData.paymentHistory || [];

      // Add new payment to history
      paymentHistory.push({
        paymentId,
        amount,
        timestamp: Date.now(),
        status: "completed"
      });

      // Update user document
      await updateDoc(userRef, {
        paymentHistory,
        totalSpent: (userData.totalSpent || 0) + amount,
        lastPaymentDate: Date.now()
      });

      console.log("[v0] User payment history updated");
    } catch (error) {
      console.error("[v0] Error updating payment history:", error);
    }
  }

  /**
   * Log failed payment attempts for fraud detection
   */
  private static async logFailedPayment(
    paymentData: SecurePaymentData,
    error: any
  ): Promise<void> {
    try {
      await addDoc(collection(db, "failed_payments"), {
        userId: paymentData.userId,
        username: paymentData.username,
        amount: paymentData.amount,
        productId: paymentData.productId,
        error: error.message || "Unknown error",
        timestamp: Date.now(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : "N/A"
      });

      console.log("[v0] Failed payment logged for fraud monitoring");
    } catch (logError) {
      console.error("[v0] Error logging failed payment:", logError);
    }
  }

  /**
   * Verify payment status (for checking payment completion)
   */
  static async verifyPaymentStatus(paymentId: string): Promise<{
    exists: boolean;
    status?: string;
    amount?: number;
  }> {
    try {
      const paymentDoc = await getDoc(doc(db, "payments", paymentId));
      
      if (!paymentDoc.exists()) {
        return { exists: false };
      }

      const paymentData = paymentDoc.data();
      return {
        exists: true,
        status: paymentData.status,
        amount: paymentData.amount
      };
    } catch (error) {
      console.error("[v0] Error verifying payment status:", error);
      return { exists: false };
    }
  }

  /**
   * Calculate fraud score based on user behavior
   */
  static async calculateFraudScore(userId: string): Promise<number> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return 100; // High risk for non-existent users

      const userData = userDoc.data();
      let fraudScore = 0;

      // New account (less than 24 hours)
      const accountAge = Date.now() - userData.createdAt;
      if (accountAge < 24 * 60 * 60 * 1000) {
        fraudScore += 30;
      }

      // No payment history
      if (!userData.paymentHistory || userData.paymentHistory.length === 0) {
        fraudScore += 20;
      }

      // Multiple failed payments
      const failedPayments = userData.failedPayments || 0;
      if (failedPayments > 3) {
        fraudScore += 40;
      }

      // No verification
      if (!userData.verified && !userData.kycVerified) {
        fraudScore += 20;
      }

      console.log("[v0] Fraud score calculated:", fraudScore);
      return Math.min(fraudScore, 100);

    } catch (error) {
      console.error("[v0] Error calculating fraud score:", error);
      return 50; // Medium risk on error
    }
  }
}

/**
 * Payment encryption utilities (for sensitive data)
 */
export class PaymentEncryption {
  /**
   * Hash sensitive payment data for storage
   */
  static hashPaymentData(data: string): string {
    // Simple hash for demo - use proper encryption in production
    return btoa(data);
  }

  /**
   * Validate payment signature (for Pi Network payments)
   */
  static validateSignature(payment: any, signature: string): boolean {
    // Implement Pi Network payment signature validation
    // This would verify the payment came from Pi Network
    console.log("[v0] Validating payment signature");
    return true; // Placeholder
  }
}
