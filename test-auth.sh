#!/bin/bash

# Authentication System Testing Script
# Tests all auth flows: signup, login, OAuth, password reset

echo "🔐 L2H Authentication System Test Suite"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
LOCAL_URL="http://localhost:3000"
PROD_URL="https://higueronlomas2.com"
TEST_EMAIL="test@example.com"
TEST_PASSWORD="TestPassword123!"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
log_pass() {
  echo -e "${GREEN}✓ PASS:${NC} $1"
  ((TESTS_PASSED++))
}

log_fail() {
  echo -e "${RED}✗ FAIL:${NC} $1"
  ((TESTS_FAILED++))
}

log_test() {
  echo -e "${YELLOW}→${NC} Testing: $1"
}

log_info() {
  echo "  ℹ  $1"
}

# Test 1: Check if server is running
test_server_running() {
  log_test "Server is running"
  
  if curl -s "$LOCAL_URL" > /dev/null 2>&1; then
    log_pass "Server responding on $LOCAL_URL"
  else
    log_fail "Server not responding on $LOCAL_URL"
    exit 1
  fi
}

# Test 2: Check if Supabase is configured
test_supabase_config() {
  log_test "Supabase environment variables"
  
  if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    log_fail "NEXT_PUBLIC_SUPABASE_URL not set"
  else
    log_pass "NEXT_PUBLIC_SUPABASE_URL is set"
  fi
  
  if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    log_fail "NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
  else
    log_pass "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
  fi
}

# Test 3: Check if pages exist
test_pages_exist() {
  log_test "Authentication pages exist"
  
  pages=("/login" "/register" "/forgot-password" "/onboarding" "/profile")
  
  for page in "${pages[@]}"; do
    if curl -s "$LOCAL_URL$page" | grep -q "<!DOCTYPE html>"; then
      log_pass "Page $page is accessible"
    else
      log_fail "Page $page is not accessible"
    fi
  done
}

# Test 4: Check API routes
test_api_routes() {
  log_test "API routes are accessible"
  
  # Test callback route
  if curl -s -I "$LOCAL_URL/api/auth/callback" > /dev/null 2>&1; then
    log_pass "Auth callback route exists"
  else
    log_fail "Auth callback route not found"
  fi
}

# Test 5: Database connection
test_database_connection() {
  log_test "Database connection"
  
  log_info "Note: This test requires Supabase CLI installed"
  log_info "Run: supabase db list"
  log_info "Expected: Your project should be listed"
}

# Test 6: Email configuration
test_email_config() {
  log_test "Email configuration"
  
  log_info "To verify email is configured:"
  log_info "1. Go to Supabase Console"
  log_info "2. Navigate to Authentication → Email Templates"
  log_info "3. Verify templates are set up (Confirmation, Recovery, etc.)"
  log_info "4. Check SMTP settings are configured"
}

# Test 7: OAuth configuration
test_oauth_config() {
  log_test "OAuth configuration"
  
  log_info "⚠️  OAuth is no longer supported"
  log_info "Use Email/Password authentication instead"
}

# Test 8: Manual signup flow
manual_test_signup() {
  log_test "Manual signup flow"
  
  log_info "1. Open $LOCAL_URL/register in browser"
  log_info "2. Fill in:"
  log_info "   Email: test-$RANDOM@example.com"
  log_info "   Password: $TEST_PASSWORD"
  log_info "   Full Name: Test User"
  log_info "3. Click 'Create Account'"
  log_info "4. Check email for verification link"
  log_info "5. Click link and verify email is confirmed"
  log_info "6. Should redirect to /onboarding"
}

# Test 9: Manual login flow
manual_test_login() {
  log_test "Manual login flow"
  
  log_info "1. Open $LOCAL_URL/login in browser"
  log_info "2. Fill in verified account credentials"
  log_info "3. Click 'Sign in'"
  log_info "4. Should redirect to / (home page)"
  log_info "5. Verify user menu shows account info"
}

# Test 9: Manual OAuth flow
manual_test_oauth() {
  log_test "OAuth - DEPRECATED"
  
  log_info "⚠️  OAuth is no longer supported"
  log_info "Use Email/Password authentication for all users"
}

# Test 11: Manual password reset flow
manual_test_password_reset() {
  log_test "Manual password reset flow"
  
  log_info "1. Open $LOCAL_URL/forgot-password in browser"
  log_info "2. Enter verified email address"
  log_info "3. Check email for password reset link"
  log_info "4. Click link (should redirect to /reset-password)"
  log_info "5. Enter new password twice"
  log_info "6. Click 'Update Password'"
  log_info "7. Should auto-logout and redirect to /login"
  log_info "8. Try logging in with new password"
}

# Test 12: Error handling
test_error_handling() {
  log_test "Error handling"
  
  log_info "Error page should be accessible at /auth/error"
  
  if curl -s "$LOCAL_URL/auth/error?error=test" | grep -q "Authentication Error"; then
    log_pass "Error page displays error messages"
  else
    log_fail "Error page not displaying correctly"
  fi
}

# Test 13: Session management
test_session_management() {
  log_test "Session management"
  
  log_info "To verify sessions are working:"
  log_info "1. Log in to account"
  log_info "2. Open DevTools → Application → Cookies"
  log_info "3. Should see 'sb-*-auth-token' cookie (httpOnly)"
  log_info "4. Refresh page - session should persist"
  log_info "5. Clear cookies and refresh - should logout"
}

# Main execution
main() {
  echo ""
  echo "=== AUTOMATED TESTS ==="
  echo ""
  
  test_server_running
  echo ""
  
  test_supabase_config
  echo ""
  
  test_pages_exist
  echo ""
  
  test_api_routes
  echo ""
  
  test_error_handling
  echo ""
  
  echo "=== CONFIGURATION VERIFICATION ==="
  echo ""
  
  test_database_connection
  echo ""
  
  test_email_config
  echo ""
  
  test_oauth_config
  echo ""
  
  echo "=== MANUAL TESTS (Required) ==="
  echo ""
  
  manual_test_signup
  echo ""
  
  manual_test_login
  echo ""
  
  manual_test_oauth
  echo ""
  
  manual_test_password_reset
  echo ""
  
  test_session_management
  echo ""
  
  echo "=== TEST SUMMARY ==="
  echo ""
  echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
  echo -e "${RED}Failed:${NC} $TESTS_FAILED"
  echo ""
  
  if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All automated tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run manual tests in order"
    echo "2. Check browser console for errors"
    echo "3. Verify Supabase logs for any issues"
    echo "4. Test on staging environment before production deploy"
  else
    echo -e "${RED}✗ Some tests failed. Please review above.${NC}"
  fi
  
  echo ""
  echo "📚 For more details, see:"
  echo "   - AUTHENTICATION_GUIDE.md"
  echo "   - AUTH_SETUP_CHECKLIST.md"
  echo ""
}

# Run tests
main
