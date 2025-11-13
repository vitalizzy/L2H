# Email Verification Setup Guide

## Overview
This document explains how email verification is configured in the L2H application for both email/password and Google OAuth registrations.

## Implementation

### 1. Email/Password Registration Flow
When users register with email and password:
- **Step 1**: User submits registration form in `/register` page
- **Step 2**: Supabase sends verification email with clickable link
- **Step 3**: User clicks link in email → redirected to `/auth/callback?token_hash=...&type=signup`
- **Step 4**: Callback route verifies the token and creates session
- **Step 5**: User is logged in and redirected to homepage

**Key Files:**
- `src/app/(auth)/register/_components/register-form.tsx` - Handles signup with email redirect URL
- `src/app/auth/callback/route.ts` - Verifies email token and exchanges for session

### 2. Google OAuth Registration Flow
When users register with Google:
- **Step 1**: User clicks "Sign up with Google" button
- **Step 2**: Redirected to Google login → user authenticates
- **Step 3**: Google redirects to `/auth/callback?code=...`
- **Step 4**: Callback route exchanges code for session
- **Step 5**: **Email is automatically verified** (Google provides pre-verified emails)
- **Step 6**: User is logged in and redirected to homepage

**Key Files:**
- `src/app/(auth)/register/_components/register-form.tsx` - Initiates OAuth flow
- `src/app/auth/callback/route.ts` - Handles OAuth code exchange

## Important: Supabase Configuration

### To Enable Email Verification Requirement

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → Providers → Email

2. **Enable Email Verification**
   - Check: "Confirm email"
   - This requires users to verify their email before they can use the app

3. **Configure Email Templates** (Optional)
   - Customize the email template sent to users
   - Ensure the link format is correct for your production URL

4. **For Production Domain** (`next.higueronlomas2.com`)
   - Add redirect URLs in Supabase:
     - `https://next.higueronlomas2.com/auth/callback`
     - `https://next.higueronlomas2.com/confirm-signup`

### Google OAuth Already Verified
- Google OAuth emails are pre-verified by Google
- No additional verification step needed for Google users
- They can use the app immediately after login

## User Experience

### Email/Password Registration
1. User fills form and clicks "Register"
2. See message: "Verification email sent. Check your mail."
3. Redirected to `/confirm-signup` page with:
   - Instruction to check email
   - "Open Email" button
   - "Didn't receive email?" link to try again
4. User clicks email link
5. Automatically logged in and redirected to homepage

### Google Registration
1. User clicks "Sign up with Google"
2. Authenticates with Google account
3. **Automatically verified** (no email check needed)
4. Immediately logged in and redirected to homepage

## Email Translations

All confirmation messages are available in 13 languages:
- Spanish (es)
- English (en)
- German (de)
- Swedish (sv)
- Danish (da)
- French (fr)
- Russian (ru)
- Hungarian (hu)
- Portuguese (pt)
- Italian (it)
- Romanian (ro)

**Relevant Translation Keys:**
- `register.verificationSent` - Message after submitting registration
- `confirmSignup.title` - "Check Your Email"
- `confirmSignup.description` - Instructions to verify email
- `confirmSignup.didntReceive` - For users who didn't receive email

## Files Modified

1. **register-form.tsx**
   - Changed redirect: `/api/auth/callback` → `/auth/callback`
   - Changed post-signup redirect: `/email-verify` → `/confirm-signup`
   - Fixed URL handling for production domain

2. **auth/callback/route.ts**
   - Handles email verification (token_hash)
   - Handles OAuth code exchange (code parameter)
   - Automatically verifies Google OAuth users

3. **translations.ts**
   - Already contains all needed strings for 13 languages

## Testing Email Verification

### Local Testing
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/register`
3. Register with test email
4. Check email and click verification link
5. Should be logged in

### Production Testing (next.higueronlomas2.com)
1. Register with real email
2. Check email inbox
3. Click verification link
4. Should be logged in

### Google OAuth Testing
1. Click "Sign up with Google"
2. Authenticate with Google
3. Should be immediately logged in (no email verification needed)

## Troubleshooting

### "Email not verified" error
- **Check**: Supabase has "Confirm email" enabled
- **Check**: User clicked verification link in email

### Verification link not working
- **Check**: Email contains correct callback URL
- **Check**: For production, verify Supabase has correct redirect URLs
- **Check**: Callback route exists at `/auth/callback`

### Google users not auto-verified
- This is expected behavior - you can configure this in Supabase
- Currently setup: Users are auto-created when Google provides verified email

## Next Steps

1. **Test the flows** - Verify both email and Google signup work
2. **Check Supabase logs** - Monitor auth events
3. **Customize email template** - Add branding to verification emails
4. **Deploy to production** - Ensure environment variables are set
