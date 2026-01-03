#!/bin/bash

# 🇲🇾 Improved Food Search - Quick Deployment Script
# This script helps deploy the improved food search feature

set -e  # Exit on error

echo "🇲🇾 Boleh Makan - Improved Food Search Deployment"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo "Step 1: Database Migrations"
echo "============================"
echo ""
echo -e "${YELLOW}⚠️  Manual step required:${NC}"
echo ""
echo "Please apply the following SQL migrations in your Supabase Dashboard:"
echo ""
echo "1. Go to: Supabase Dashboard → SQL Editor"
echo "2. Open and run: supabase/migrations/20260103_improved_food_search.sql"
echo "3. Open and run: supabase/migrations/20260103_add_food_aliases.sql"
echo ""
read -p "Press Enter when migrations are complete..."

echo ""
echo "Step 2: Verify Migrations"
echo "========================="
echo ""
echo "Testing search function with sample query..."
echo ""
echo -e "${YELLOW}Run this in Supabase SQL Editor to verify:${NC}"
echo ""
echo "SELECT name_en, name_bm FROM search_malaysian_foods('nasi lemak rendang', 5);"
echo ""
read -p "Did you see results? (y/n): " verify_migration

if [ "$verify_migration" != "y" ]; then
    echo -e "${RED}❌ Migration verification failed. Please check migrations and try again.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Database migrations verified!${NC}"

echo ""
echo "Step 3: Build Frontend"
echo "======================"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

echo ""
echo "Step 4: Test Locally (Optional)"
echo "================================"
echo ""
read -p "Do you want to test locally before deploying? (y/n): " test_local

if [ "$test_local" = "y" ]; then
    echo ""
    echo "Starting local server..."
    echo "Visit http://localhost:3000 and test the search functionality"
    echo ""
    echo "Test these searches:"
    echo "  - nasi lemak rendang"
    echo "  - ckt"
    echo "  - roti chanai"
    echo "  - ayam goreng"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C when done testing${NC}"
    npm run start
fi

echo ""
echo "Step 5: Deploy to Production"
echo "============================="
echo ""
read -p "Ready to deploy to production? (y/n): " deploy_prod

if [ "$deploy_prod" = "y" ]; then
    echo ""
    echo "Deploying to production..."
    
    # Check if Vercel is installed
    if command -v vercel &> /dev/null; then
        vercel deploy --prod
        echo -e "${GREEN}✅ Deployed to Vercel!${NC}"
    else
        echo -e "${YELLOW}⚠️  Vercel CLI not found.${NC}"
        echo "Please deploy manually:"
        echo "  - Push to main branch (for automatic deployment)"
        echo "  - Or run: vercel deploy --prod"
    fi
else
    echo "Deployment skipped. Run 'vercel deploy --prod' when ready."
fi

echo ""
echo "Step 6: Post-Deployment Verification"
echo "====================================="
echo ""
echo "After deployment, please test these searches:"
echo ""
echo "✅ Compound dishes:"
echo "   - nasi lemak rendang"
echo "   - ayam goreng berempah"
echo ""
echo "✅ Partial words:"
echo "   - goreng (should find all fried dishes)"
echo "   - lemak (should find all nasi lemak)"
echo ""
echo "✅ Aliases:"
echo "   - ckt (Char Kuey Teow)"
echo "   - bkt (Bak Kut Teh)"
echo ""
echo "✅ Misspellings:"
echo "   - roti chanai (should find Roti Canai)"
echo "   - nasik lemak (should work)"
echo ""
echo "✅ Suggestions:"
echo "   - Type 'nasi' and check suggestions appear"
echo "   - Empty search should show popular foods"
echo ""
echo -e "${GREEN}=================================================="
echo "🎉 Deployment Complete!"
echo "==================================================${NC}"
echo ""
echo "📚 Documentation:"
echo "   - Testing Guide: FOOD_SEARCH_TESTING_GUIDE.md"
echo "   - Technical Details: IMPROVED_FOOD_SEARCH.md"
echo ""
echo "🔍 Monitor these metrics:"
echo "   - Search success rate"
echo "   - Zero-result rate (should decrease)"
echo "   - Average search time (< 300ms)"
echo "   - Suggestion click-through rate"
echo ""
echo "Need help? Check the documentation or review the testing guide."
echo ""

