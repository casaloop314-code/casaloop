"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Target, Rocket, Users, Mail, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/">
            <div>
              <h1 className="text-xl font-bold text-primary">CasaLoop</h1>
              <p className="text-xs text-muted-foreground">Powered by Pi Network</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6 pb-20">
        {/* Hero Section */}
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">About CasaLoop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building the future of real estate on Pi Network
          </p>
        </div>

        {/* Vision Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-primary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-foreground">
              To become the #1 utilities app in the Pi ecosystem
            </p>
            <p className="text-muted-foreground leading-relaxed">
              CasaLoop is on a mission to revolutionize how Pioneers buy, sell, and rent properties using Pi cryptocurrency. 
              We envision a future where real estate transactions are seamless, secure, and accessible to everyone in the 
              Pi Network community, making property ownership a reality for millions worldwide.
            </p>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              We are building a comprehensive real estate marketplace that empowers Pioneers to transact safely and 
              efficiently using Pi tokens. CasaLoop combines cutting-edge blockchain technology with user-friendly 
              design to create the ultimate property platform.
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Secure Transactions</p>
                  <p className="text-sm">Multi-layer verification and fraud protection</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Community First</p>
                  <p className="text-sm">Built by Pioneers, for Pioneers</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Global Access</p>
                  <p className="text-sm">Connect buyers and sellers worldwide</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Rocket className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Innovation</p>
                  <p className="text-sm">Continuous improvement and new features</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Pi Network */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Why Pi Network?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              Pi Network represents the future of accessible cryptocurrency. With millions of Pioneers worldwide, 
              it provides the perfect foundation for a decentralized real estate marketplace. We believe in Pi's 
              vision of creating an inclusive digital economy where everyone can participate.
            </p>
            <p className="leading-relaxed">
              By building on Pi Network, we're making property transactions more affordable, transparent, and 
              accessible to people who may not have access to traditional banking systems or real estate platforms.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Property Marketplace</h4>
                <p className="text-sm text-muted-foreground">
                  Browse and list properties for sale or rent with detailed information, photos, and verified ownership
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Service Providers</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with trusted professionals for home repairs, maintenance, and improvement services
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">
                  All transactions powered by Pi Network with advanced fraud detection and buyer protection
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Community Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Earn CASA points through daily activities, referrals, and successful transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-border bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Get In Touch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Have questions, feedback, or need support? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:casaloop314@gmail.com"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                casaloop314@gmail.com
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Our team typically responds within 24-48 hours. For urgent issues, please mark your email as "Urgent".
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Join Our Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              CasaLoop is more than just an app—it's a movement to democratize real estate for the Pi Network community. 
              Every Pioneer who joins us brings us closer to our goal of becoming the leading utilities platform in the ecosystem.
            </p>
            <p className="leading-relaxed font-semibold text-foreground">
              Together, we're building something revolutionary. Welcome to the future of real estate.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8 pb-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            CasaLoop v1.0 - Built on Pi Network
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 CasaLoop. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/privacy" className="text-xs text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
