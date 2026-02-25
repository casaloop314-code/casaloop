// CasaLoop Verification & Trust System
// Protects Pioneers from fraudulent property listings and service providers

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface UserVerification {
  userId: string;
  username: string;
  
  // Pi Network Verification
  piKycVerified: boolean;
  piKycLevel?: 'none' | 'basic' | 'full';
  
  // Contact Verification
  phoneVerified: boolean;
  phoneNumber?: string;
  emailVerified: boolean;
  email?: string;
  
  // Identity Verification
  idVerified: boolean;
  idDocumentUrl?: string;
  idDocumentType?: 'national_id' | 'passport' | 'drivers_license';
  idVerificationDate?: number;
  
  // Property Ownership Verification (for sellers)
  propertyDocumentsVerified: boolean;
  propertyDocuments?: string[]; // URLs to ownership documents
  
  // Business Verification (for service providers)
  businessLicenseVerified: boolean;
  businessLicenseUrl?: string;
  businessRegistrationNumber?: string;
  
  // Trust Score (0-100)
  trustScore: number;
  
  // Transaction History
  completedTransactions: number;
  failedTransactions: number;
  disputedTransactions: number;
  
  // Reviews & Ratings
  averageRating: number;
  totalReviews: number;
  
  // Account Age
  accountCreatedAt: number;
  
  // Verification Status
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: number;
  verifiedBy?: string; // Admin who verified
  
  // Flags & Reports
  flaggedCount: number;
  reportedCount: number;
  isBanned: boolean;
  banReason?: string;
}

export interface PropertyVerification {
  propertyId: string;
  ownerId: string;
  
  // Ownership Verification
  ownershipVerified: boolean;
  ownershipDocuments?: string[];
  ownershipVerificationDate?: number;
  
  // Property Authenticity
  propertyImagesVerified: boolean;
  locationVerified: boolean;
  priceRealistic: boolean;
  
  // Visit Verification (by other users)
  verifiedVisits: number;
  verifiedVisitorsUserIds?: string[];
  
  // Verification Status
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  
  // Flags
  flaggedAsScam: boolean;
  flagReasons?: string[];
  flaggedBy?: string[];
}

// Calculate Trust Score based on multiple factors
export function calculateTrustScore(verification: UserVerification): number {
  let score = 0;
  
  // Pi KYC Verification (30 points)
  if (verification.piKycVerified) {
    if (verification.piKycLevel === 'full') score += 30;
    else if (verification.piKycLevel === 'basic') score += 20;
  }
  
  // Contact Verification (10 points)
  if (verification.phoneVerified) score += 5;
  if (verification.emailVerified) score += 5;
  
  // Identity Verification (20 points)
  if (verification.idVerified) score += 20;
  
  // Document Verification (10 points)
  if (verification.propertyDocumentsVerified) score += 5;
  if (verification.businessLicenseVerified) score += 5;
  
  // Transaction History (15 points)
  const transactionScore = Math.min(
    15,
    (verification.completedTransactions / (verification.completedTransactions + verification.failedTransactions + 1)) * 15
  );
  score += transactionScore;
  
  // Reviews & Ratings (10 points)
  if (verification.totalReviews > 0) {
    score += (verification.averageRating / 5) * 10;
  }
  
  // Account Age (5 points) - 1 point per month, max 5
  const accountAgeMonths = (Date.now() - verification.accountCreatedAt) / (1000 * 60 * 60 * 24 * 30);
  score += Math.min(5, accountAgeMonths);
  
  // Penalties
  score -= verification.flaggedCount * 5;
  score -= verification.reportedCount * 10;
  score -= verification.disputedTransactions * 3;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Get trust level label and color
export function getTrustLevel(score: number): { 
  level: string; 
  color: string; 
  description: string;
  canList: boolean;
} {
  if (score >= 80) {
    return {
      level: 'Highly Trusted',
      color: 'text-green-500',
      description: 'Fully verified and highly trusted seller',
      canList: true
    };
  } else if (score >= 60) {
    return {
      level: 'Trusted',
      color: 'text-blue-500',
      description: 'Verified seller with good reputation',
      canList: true
    };
  } else if (score >= 40) {
    return {
      level: 'New Seller',
      color: 'text-yellow-500',
      description: 'New to CasaLoop, building reputation',
      canList: true
    };
  } else if (score >= 20) {
    return {
      level: 'Unverified',
      color: 'text-orange-500',
      description: 'Limited verification, proceed with caution',
      canList: false
    };
  } else {
    return {
      level: 'High Risk',
      color: 'text-red-500',
      description: 'Multiple flags or reports, not recommended',
      canList: false
    };
  }
}

// Red flags to watch for
export function getRedFlags(verification: UserVerification, property?: PropertyVerification): string[] {
  const flags: string[] = [];
  
  if (!verification.piKycVerified) {
    flags.push('No Pi Network KYC verification');
  }
  
  if (!verification.phoneVerified && !verification.emailVerified) {
    flags.push('No contact information verified');
  }
  
  if (!verification.idVerified) {
    flags.push('No government ID verified');
  }
  
  if (verification.completedTransactions === 0 && verification.accountCreatedAt > Date.now() - 7 * 24 * 60 * 60 * 1000) {
    flags.push('New account with no transaction history');
  }
  
  if (verification.flaggedCount > 2) {
    flags.push(`Account flagged ${verification.flaggedCount} times`);
  }
  
  if (verification.reportedCount > 0) {
    flags.push(`${verification.reportedCount} reports filed against this user`);
  }
  
  if (property && !property.ownershipVerified) {
    flags.push('Property ownership not verified');
  }
  
  if (property && property.flaggedAsScam) {
    flags.push('Property flagged as potential scam');
  }
  
  if (verification.disputedTransactions > 2) {
    flags.push('Multiple disputed transactions');
  }
  
  return flags;
}

// Safety tips for users
export const SAFETY_TIPS = [
  'Always verify property ownership documents before payment',
  'Meet sellers in public places or at the property location',
  'Never send Pi tokens before viewing the property in person',
  'Check the seller\'s trust score and verification badges',
  'Report suspicious listings immediately',
  'Use CasaLoop\'s messaging system for all communications',
  'Request video tours before in-person visits',
  'Verify seller identity matches their Pi Network profile',
  'Look for red flags like urgent pressure to pay immediately',
  'Trust your instincts - if it seems too good to be true, it probably is'
];
