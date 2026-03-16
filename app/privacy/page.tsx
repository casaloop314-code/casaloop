"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: February 2, 2025</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            CasaLoop is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>

        {/* Information We Collect */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Pi Network Information</h3>
              <p>When you authenticate with Pi Network, we collect your Pi username and unique identifier (UID) to create and manage your CasaLoop account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Property Listings</h3>
              <p>When you create property or service listings, we collect information including title, description, location, pricing, images, and contact preferences.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Payment and Transaction Data</h3>
              <p>We collect and securely store payment information including:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Pi payment transaction IDs and amounts</li>
                <li>Payment timestamps and completion status</li>
                <li>Reservation and booking details</li>
                <li>Payment history and transaction logs</li>
                <li>Refund requests and dispute records</li>
                <li>Wallet addresses involved in transactions (encrypted)</li>
              </ul>
              <p className="mt-2">All payment data is processed through Pi Network's secure payment infrastructure and encrypted at rest.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
              <p>We collect analytics including property views, favorites, search queries, and engagement metrics to improve our service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Communications</h3>
              <p>Messages sent through our platform are stored to facilitate communication between buyers, sellers, and service providers.</p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain CasaLoop services</li>
              <li>To facilitate property transactions and service bookings</li>
              <li>To process Pi token payments securely</li>
              <li>To send notifications about messages, bookings, and updates</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To improve user experience through analytics</li>
              <li>To enforce our Terms of Service</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Encrypted data transmission using HTTPS/SSL</li>
              <li>Secure Firebase Firestore database with access controls</li>
              <li>Pi Network authentication for identity verification</li>
              <li>Server-side payment validation and verification</li>
              <li>Regular security audits and updates</li>
            </ul>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Payment Security Measures</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Payment deduplication to prevent double-charging</li>
                <li>Transaction rate limiting to detect fraud</li>
                <li>Fraud score calculation based on user behavior</li>
                <li>Complete audit trails with timestamps and IP logging</li>
                <li>Payment ID verification through Pi Network API</li>
                <li>Automated suspicious activity detection</li>
              </ul>
            </div>
            
            <p className="mt-4">
              While we use reasonable security measures, no system is completely secure. Users are responsible for maintaining the security of their Pi Network accounts and verifying transaction details before confirming payments.
            </p>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Information Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>We do not sell your personal information. We may share information only in these circumstances:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>With Other Users:</strong> Your username and listings are visible to other CasaLoop users</li>
              <li><strong>Pi Network:</strong> Authentication data is processed through Pi Network's secure systems</li>
              <li><strong>Service Providers:</strong> Firebase for data storage, Vercel for hosting</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal data stored in CasaLoop</li>
              <li>Update or correct your information</li>
              <li>Delete your listings at any time</li>
              <li>Request account deletion (contact support)</li>
              <li>Opt out of non-essential communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>We retain your data as long as your account is active or as needed to provide services.</p>
            
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Retention Periods:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Account Data:</strong> Retained while account is active</li>
                <li><strong>Transaction Records:</strong> Kept for 7 years for legal, tax, and accounting purposes</li>
                <li><strong>Payment Logs:</strong> Stored for 7 years for dispute resolution and compliance</li>
                <li><strong>Messages:</strong> Retained for 2 years or until account deletion</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized after 1 year</li>
              </ul>
            </div>
            
            <p className="mt-3">
              You may request data deletion by contacting support. Note that payment records required by law cannot be deleted during the retention period.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>CasaLoop is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe a child has provided information, please contact us immediately.</p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. Continued use of CasaLoop after changes constitutes acceptance of the updated policy.</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>For privacy concerns or questions, please contact us through:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Email: privacy@casaloop.pi</li>
              <li>In-app support messaging</li>
            </ul>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to CasaLoop
          </Button>
        </div>
      </div>
    </div>
  );
}
