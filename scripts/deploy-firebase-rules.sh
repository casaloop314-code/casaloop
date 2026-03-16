#!/bin/bash

# CasaLoop Firebase Security Rules Deployment Script
# This script helps you deploy Firestore security rules

echo "🔥 CasaLoop Firebase Setup Script"
echo "=================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI is ready"
echo ""

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

echo ""
echo "📋 Available commands:"
echo "1. Deploy Firestore Rules"
echo "2. View current rules"
echo "3. Test rules locally"
echo ""

read -p "Select option (1-3): " option

case $option in
  1)
    echo "🚀 Deploying Firestore security rules..."
    firebase deploy --only firestore:rules
    echo "✅ Rules deployed successfully!"
    ;;
  2)
    echo "📖 Fetching current rules..."
    firebase firestore:rules get
    ;;
  3)
    echo "🧪 Starting local Firebase emulator..."
    firebase emulators:start --only firestore
    ;;
  *)
    echo "❌ Invalid option"
    ;;
esac
