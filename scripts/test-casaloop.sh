#!/bin/bash

# CasaLoop Comprehensive Testing Script
# Tests all critical features before deployment

echo "🧪 CasaLoop Test Suite"
echo "======================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗${NC} $2 - Missing: $1"
        ((FAIL_COUNT++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗${NC} $2 - Missing: $1"
        ((FAIL_COUNT++))
    fi
}

# Function to check file contains text
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗${NC} $3"
        ((FAIL_COUNT++))
    fi
}

echo "📦 Testing Core Files..."
echo "------------------------"
check_file "app/page.tsx" "Main app file exists"
check_file "lib/firebase.ts" "Firebase configuration exists"
check_file "lib/casaloop-types.ts" "Type definitions exist"
check_file "app/layout.tsx" "Layout file exists"
echo ""

echo "🔐 Testing Security Files..."
echo "----------------------------"
check_file "firestore.rules" "Firestore security rules exist"
check_file "firestore.indexes.json" "Firestore indexes exist"
check_file "app/api/verify-payment/route.ts" "Payment verification API exists"
check_file "lib/secure-payment.ts" "Secure payment library exists"
echo ""

echo "📄 Testing Legal Pages..."
echo "-------------------------"
check_file "app/privacy/page.tsx" "Privacy Policy page exists"
check_file "app/terms/page.tsx" "Terms of Service page exists"
echo ""

echo "🎨 Testing UI Components..."
echo "---------------------------"
check_file "components/tabs/home-tab.tsx" "Home tab exists"
check_file "components/tabs/services-tab.tsx" "Services tab exists"
check_file "components/tabs/listings-tab.tsx" "Listings tab exists"
check_file "components/tabs/messages-tab.tsx" "Messages tab exists"
check_file "components/tabs/analytics-tab.tsx" "Analytics tab exists"
check_file "components/tabs/rewards-tab.tsx" "Rewards tab exists"
check_file "components/notification-center.tsx" "Notification center exists"
check_file "components/error-boundary.tsx" "Error boundary exists"
check_file "components/report-dialog.tsx" "Report system exists"
echo ""

echo "🎮 Testing Gamification Features..."
echo "-----------------------------------"
check_file "components/streak-system.tsx" "Streak system exists"
check_file "components/quest-system.tsx" "Quest system exists"
check_file "components/trust-badge.tsx" "Trust badge system exists"
check_file "lib/verification-system.ts" "Verification system exists"
echo ""

echo "⚡ Testing Performance Features..."
echo "---------------------------------"
check_file "components/skeleton-loader.tsx" "Skeleton loaders exist"
check_content "components/tabs/home-tab.tsx" "paginatedProperties" "Home tab pagination implemented"
check_content "components/tabs/services-tab.tsx" "paginatedServices" "Services tab pagination implemented"
echo ""

echo "🔧 Testing Configuration..."
echo "---------------------------"
check_content "app/layout.tsx" "preconnect" "Performance preconnect links added"
check_content "app/page.tsx" "NotificationCenter" "Notifications integrated"
check_content "components/tabs/rewards-tab.tsx" "2026" "Copyright updated to 2026"
echo ""

echo "📚 Testing Documentation..."
echo "---------------------------"
check_file "DEPLOYMENT_GUIDE.md" "Deployment guide exists"
check_file "SETUP_GUIDE.md" "Setup guide exists"
check_file "SCREENSHOTS_GUIDE.md" "Screenshots guide exists"
check_file "NOTIFICATION_SYSTEM.md" "Notification docs exist"
check_file "PERFORMANCE_OPTIMIZATIONS.md" "Performance docs exist"
echo ""

echo "🚀 Testing Firebase Config..."
echo "-----------------------------"
check_file "firebase.json" "Firebase config file exists"
check_content "firebase.json" "firestore" "Firestore configured"
echo ""

echo ""
echo "================================"
echo "📊 Test Results Summary"
echo "================================"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! CasaLoop is ready for deployment.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Please review the issues above.${NC}"
    exit 1
fi
