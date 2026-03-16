"use client";

import React from "react"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, XCircle, Phone, Mail, CreditCard, FileText, Star } from "lucide-react";
import type { UserVerification } from "@/lib/verification-system";
import { calculateTrustScore, getTrustLevel, getRedFlags } from "@/lib/verification-system";

interface TrustBadgeProps {
  verification: UserVerification;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function TrustBadge({ verification, size = 'md', showDetails = false }: TrustBadgeProps) {
  const trustScore = calculateTrustScore(verification);
  const trustLevel = getTrustLevel(trustScore);
  const redFlags = getRedFlags(verification);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  if (!showDetails) {
    return (
      <Badge 
        variant="outline" 
        className={`gap-1.5 ${sizeClasses[size]} border-2 ${
          trustScore >= 80 ? 'border-green-500 bg-green-50 text-green-700' :
          trustScore >= 60 ? 'border-blue-500 bg-blue-50 text-blue-700' :
          trustScore >= 40 ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
          trustScore >= 20 ? 'border-orange-500 bg-orange-50 text-orange-700' :
          'border-red-500 bg-red-50 text-red-700'
        }`}
      >
        <Shield className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} />
        {trustLevel.level} ({trustScore})
      </Badge>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Trust & Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trust Score */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <div>
            <p className="text-sm text-muted-foreground">Trust Score</p>
            <p className={`text-2xl font-bold ${trustLevel.color}`}>{trustScore}/100</p>
            <p className="text-xs text-muted-foreground">{trustLevel.description}</p>
          </div>
          <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
            trustScore >= 80 ? 'bg-green-100' :
            trustScore >= 60 ? 'bg-blue-100' :
            trustScore >= 40 ? 'bg-yellow-100' :
            trustScore >= 20 ? 'bg-orange-100' :
            'bg-red-100'
          }`}>
            <Shield className={`h-8 w-8 ${trustLevel.color}`} />
          </div>
        </div>

        {/* Verification Badges */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Verifications</p>
          <div className="grid grid-cols-2 gap-2">
            <VerificationItem
              icon={<CheckCircle className="h-4 w-4" />}
              label="Pi KYC"
              verified={verification.piKycVerified}
              level={verification.piKycLevel}
            />
            <VerificationItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              verified={verification.phoneVerified}
            />
            <VerificationItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              verified={verification.emailVerified}
            />
            <VerificationItem
              icon={<CreditCard className="h-4 w-4" />}
              label="ID"
              verified={verification.idVerified}
            />
            <VerificationItem
              icon={<FileText className="h-4 w-4" />}
              label="Documents"
              verified={verification.propertyDocumentsVerified || verification.businessLicenseVerified}
            />
            <VerificationItem
              icon={<Star className="h-4 w-4" />}
              label="Reviews"
              verified={verification.totalReviews > 0}
              extra={verification.totalReviews > 0 ? `${verification.averageRating.toFixed(1)}★` : undefined}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{verification.completedTransactions}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{verification.totalReviews}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {Math.floor((Date.now() - verification.accountCreatedAt) / (1000 * 60 * 60 * 24))}d
            </p>
            <p className="text-xs text-muted-foreground">Member</p>
          </div>
        </div>

        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700 mb-1">Warning Signs</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {redFlags.map((flag, idx) => (
                    <li key={idx}>• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tip */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Safety Tip:</strong> Always verify ownership documents and meet at the property location before making any payments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationItem({ 
  icon, 
  label, 
  verified, 
  level,
  extra 
}: { 
  icon: React.ReactNode; 
  label: string; 
  verified: boolean;
  level?: string;
  extra?: string;
}) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${
      verified ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className={verified ? 'text-green-600' : 'text-gray-400'}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium ${verified ? 'text-green-700' : 'text-gray-500'}`}>
          {label}
        </p>
        {level && verified && (
          <p className="text-xs text-green-600">{level}</p>
        )}
        {extra && (
          <p className="text-xs text-green-600">{extra}</p>
        )}
      </div>
      {verified ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );
}
