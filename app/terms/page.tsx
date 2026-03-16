"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Scale, ShieldCheck, Ban, CheckCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">Last updated: February 2, 2025</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            By using CasaLoop, you agree to these terms. Please read them carefully.
          </p>
        </div>

        {/* Acceptance */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              By accessing or using CasaLoop, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use our platform.
            </p>
            <p>
              CasaLoop is a marketplace platform connecting property buyers, sellers, renters, and home service providers on the Pi Network. We facilitate connections but are not party to transactions between users.
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>To use CasaLoop, you must:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have a valid Pi Network account</li>
              <li>Authenticate through Pi Network's secure login</li>
              <li>Comply with all applicable laws in your jurisdiction</li>
              <li>Not be prohibited from using our services</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>As a CasaLoop user, you agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Accurate Information:</strong> Provide truthful and accurate information in listings</li>
              <li><strong>Property Ownership:</strong> Only list properties you own or have authorization to list</li>
              <li><strong>Respectful Communication:</strong> Treat other users with respect and professionalism</li>
              <li><strong>Legal Compliance:</strong> Follow all local real estate and business laws</li>
              <li><strong>Account Security:</strong> Maintain the security of your Pi Network credentials</li>
              <li><strong>No Fraud:</strong> Not engage in fraudulent, misleading, or deceptive practices</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Posting false, misleading, or fraudulent listings</li>
              <li>Listing properties you do not own or have no right to list</li>
              <li>Using CasaLoop for illegal activities or money laundering</li>
              <li>Harassing, threatening, or abusing other users</li>
              <li>Creating multiple accounts to manipulate ratings or reviews</li>
              <li>Attempting to bypass Pi payment systems</li>
              <li>Scraping data or using automated bots</li>
              <li>Posting inappropriate, offensive, or discriminatory content</li>
              <li>Infringing on intellectual property rights</li>
            </ul>
          </CardContent>
        </Card>

        {/* Listings */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Property and Service Listings</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p><strong>Property Listings:</strong> You represent that you have the legal right to list and transact the property. CasaLoop does not verify property ownership or legal status.</p>
            <p><strong>Service Listings:</strong> Service providers must have appropriate licenses, qualifications, and insurance as required by law.</p>
            <p><strong>Pricing:</strong> All prices are in Pi tokens. You are responsible for setting accurate prices and honoring agreed-upon transactions.</p>
            <p><strong>Images:</strong> You must own or have rights to all images uploaded. Copyrighted or stolen images are prohibited.</p>
          </CardContent>
        </Card>

        {/* Payments and Transactions */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Payments and Transactions</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-2">Payment Processing</p>
              <p>All payments are processed through Pi Network's official payment infrastructure. CasaLoop never stores your Pi wallet credentials or private keys.</p>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Transaction Fees</p>
              <p>CasaLoop may charge service fees on transactions. All fees will be clearly displayed before you confirm any payment. Fees are non-refundable even if the underlying transaction is refunded.</p>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Payment Finality</p>
              <p className="text-destructive font-semibold">IMPORTANT: All Pi Network payments are final and non-reversible once confirmed on the blockchain.</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Verify all transaction details before confirming</li>
                <li>Ensure you are sending Pi to the correct user</li>
                <li>Confirm the payment amount is correct</li>
                <li>CasaLoop cannot reverse completed blockchain transactions</li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Payment Verification</p>
              <p>Each payment undergoes security checks including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Payment ID verification through Pi Network API</li>
                <li>Duplicate transaction prevention</li>
                <li>Fraud detection algorithms</li>
                <li>Rate limiting to prevent abuse</li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Failed Payments</p>
              <p>If a payment fails, you will be notified immediately. Common reasons include:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Insufficient Pi balance</li>
                <li>Payment cancelled by user</li>
                <li>Network connectivity issues</li>
                <li>Fraudulent activity detected</li>
              </ul>
            </div>
            
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Refund Policy</p>
              <p>CasaLoop is a marketplace platform, not a merchant. Refunds are determined by sellers and service providers according to their individual policies.</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Property Reservations:</strong> Refundability depends on seller's cancellation policy</li>
                <li><strong>Service Bookings:</strong> Service providers set their own refund terms</li>
                <li><strong>Disputes:</strong> Users must resolve refund disputes directly with transaction counterparties</li>
                <li><strong>Platform Fees:</strong> CasaLoop service fees are non-refundable</li>
              </ul>
              <p className="mt-3 font-semibold text-destructive">Always confirm refund policies with sellers before making payments.</p>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Dispute Resolution</p>
              <p>If a payment dispute arises:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Contact the other party directly through CasaLoop messaging</li>
                <li>Attempt good-faith negotiation to resolve the issue</li>
                <li>If unresolved, contact CasaLoop support for mediation assistance</li>
                <li>Provide transaction evidence (payment IDs, screenshots, communications)</li>
              </ol>
              <p className="mt-2"><strong>Note:</strong> CasaLoop provides mediation assistance but cannot force refunds or reverse blockchain transactions.</p>
            </div>
            
            <div>
              <p className="font-semibold text-foreground mb-2">Fraudulent Transactions</p>
              <p>If you suspect fraud or unauthorized transactions:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Report immediately through in-app support</li>
                <li>Provide all relevant transaction details</li>
                <li>We will investigate and may suspend accounts involved</li>
                <li>Fraudulent users will be permanently banned</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Verification and Trust */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Verification and Trust System</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>CasaLoop provides verification badges based on:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Pi Network KYC status</li>
              <li>Transaction history and completion rate</li>
              <li>User reviews and ratings</li>
              <li>Account age and activity</li>
            </ul>
            <p className="mt-3">
              Verification badges do not guarantee trustworthiness. Users must conduct their own due diligence before transactions.
            </p>
          </CardContent>
        </Card>

        {/* Liability Disclaimer */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">CasaLoop is a marketplace platform only. We are not:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>A real estate agency or broker</li>
              <li>A party to any transaction between users</li>
              <li>Responsible for verifying property ownership or legal status</li>
              <li>Liable for fraudulent listings or user misconduct</li>
              <li>Guaranteeing property condition, value, or seller honesty</li>
              <li>Responsible for disputes between buyers and sellers</li>
            </ul>
            
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
              <p className="font-semibold text-foreground mb-2">Financial Liability Disclaimer</p>
              <p className="mb-2">CasaLoop is NOT responsible for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Lost, stolen, or misdirected Pi tokens</li>
                <li>Payment errors due to user mistakes</li>
                <li>Refunds for completed transactions</li>
                <li>Financial losses from fraudulent sellers</li>
                <li>Market value fluctuations of Pi tokens</li>
                <li>Blockchain network fees or delays</li>
                <li>Technical issues with Pi Network payment system</li>
              </ul>
              <p className="mt-3 font-semibold text-destructive">
                Maximum liability is limited to platform service fees paid, not the transaction amount.
              </p>
            </div>
            
            <p className="mt-4 font-semibold text-foreground">
              Users transact at their own risk. Conduct proper due diligence before any transaction. Verify seller identity, property details, and payment amounts before confirming.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>CasaLoop's name, logo, design, and features are protected by intellectual property laws. You may not copy, modify, or redistribute our platform without permission.</p>
            <p>By posting content, you grant CasaLoop a non-exclusive license to display and distribute your content on our platform.</p>
          </CardContent>
        </Card>

        {/* Account Termination */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>CasaLoop reserves the right to suspend or terminate accounts that:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Receive multiple valid user complaints</li>
              <li>Pose security or legal risks to the platform</li>
            </ul>
            <p className="mt-3">You may delete your account at any time through the app or by contacting support.</p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may update these Terms of Service periodically. Changes will be posted with an updated date. Continued use after changes constitutes acceptance of the updated terms.</p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>These Terms are governed by international e-commerce laws and the laws of the jurisdiction where disputes arise. Disputes will be resolved through arbitration or mediation where possible.</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>For questions about these Terms, contact us through:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Email: legal@casaloop.pi</li>
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
