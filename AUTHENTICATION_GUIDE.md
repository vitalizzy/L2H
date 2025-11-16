# 🔐 Authentication System Guide

Complete guide for L2H authentication system with Email/Password, Magic Links, and Password Recovery.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [User Flows](#user-flows)
4. [File Structure](#file-structure)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)
7. [Testing](#testing)

---

## System Overview

### Authentication Methods
- **Email/Password** - Traditional signup with magic link verification
- **Password Recovery** - Reset forgotten password via email link
- **Magic Links** - Email-based authentication and verification

### Database
- **Auth** - Managed by Supabase (`auth.users` table)
- **Profiles** - User data stored in `public.profiles` table
- **Triggers** - Postgres trigger auto-creates profiles on signup
- **RLS** - Row Level Security policies protect user data

---

## Architecture

### Core Components

```
src/app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── login-form.tsx
│   ├── register/
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── register-form.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── confirm-signup/
│   │   └── page.tsx
│   ├── email-verify/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   ├── error/
│   │   └── page.tsx
│   └── layout.tsx
├── (main)/
│   ├── (home)/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   └── layout.tsx
├── api/
│   └── auth/
│       └── callback/
│           └── route.ts
└── layout.tsx

src/utils/supabase/
├── client.ts       # Client-side Supabase instance
├── server.ts       # Server-side Supabase instance
└── middleware.ts   # Auth middleware for routing

src/middleware.ts   # Next.js middleware for auth checks
```

### Key Files

| File | Purpose |
|------|---------|
| `login-form.tsx` | Email/password login form |
| `register-form.tsx` | Email/password signup with magic link |
| `forgot-password/page.tsx` | Password recovery request page |
| `reset-password/page.tsx` | New password form after reset link |
| `onboarding/page.tsx` | Profile completion after email verification |
| `profile/page.tsx` | Display and edit user profile |
| `callback/route.ts` | Magic link callback handler |
| `error/page.tsx` | Error display page with troubleshooting |

---

## User Flows

### 1️⃣ Email/Password Signup Flow

```
User visits /register
    ↓
Enters email + password + full name
    ↓
register-form.tsx validates input
    ↓
supabase.auth.signUpWithPassword() called
    ↓
Magic link sent to email (confirmation_sent_at is set)
    ↓
User clicks link in email
    ↓
Redirects to /api/auth/callback?token_hash=...&type=signup
    ↓
callback/route.ts verifies token (supabase.auth.verifyOtp)
    ↓
Redirects to /onboarding
    ↓
User completes onboarding (optional profile info)
    ↓
Profile auto-created via Postgres trigger
    ↓
User redirected to /profile
    ↓
✅ Signup complete!
```

### 2️⃣ Email/Password Login Flow

```
User visits /login
    ↓
Enters email + password
    ↓
login-form.tsx validates input
    ↓
supabase.auth.signInWithPassword() called
    ↓
✅ Session created (valid)
    ↓
Redirects to /
    ↓
User logged in!
```

### 3️⃣ Password Recovery Flow

```
User visits /forgot-password
    ↓
Enters email
    ↓
Supabase checks if user exists
    ↓
If OAuth user detected → Error: "Use Google login"
    ↓
If email user → Recovery email sent
    ↓
User clicks link in email
    ↓
Redirects to /api/auth/callback?token_hash=...&type=recovery
    ↓
callback/route.ts verifies token
    ↓
Redirects to /reset-password
    ↓
User enters new password + confirmation
    ↓
reset-password/page.tsx validates matching passwords
    ↓
supabase.auth.updateUser({ password }) called
    ↓
User auto-logged out
    ↓
Redirects to /login
    ↓
✅ Password reset complete!
```

---

## File Structure Explained

### Authentication Pages

#### `/login` - Login Form
- Email/password login
- Register link
- Forgot password link

#### `/register` - Signup Form
- Email/password signup (magic link verification)
- No OAuth option

#### `/forgot-password` - Password Recovery
- Email input field
- Detects OAuth users and shows error
- Sends recovery email

#### `/reset-password` - New Password Form
- Password input with confirmation
- Validates token from URL hash
- Updates password and auto-logs out

#### `/onboarding` - Profile Setup
- Post-email-verification profile completion
- Optional: upload avatar, complete profile
- Auto-creates empty profile via trigger

#### `/profile` - User Profile
- Display user data
- Edit profile information
- Logout button

#### `/error` - Error Display
- Shows authentication errors
- Troubleshooting suggestions
- Links to login/home

### API Routes

#### `POST /api/auth/callback`
- Handles magic link token verification
- Routes users to correct page based on auth type

---

## Configuration

### Required Supabase Setup

#### 1. Execute SUPABASE_SETUP.sql
Run this SQL in Supabase SQL Editor:
- Creates `public.profiles` table
- Sets up Postgres trigger for auto-profile creation
- Configures RLS policies

#### 2. Enable Auth Providers

**Email Provider:**
- Go to Authentication → Providers
- Enable "Email"
- Configure SMTP settings or use Supabase emails

#### 3. Configure URLs

In Supabase Project Settings → Authentication:

**Site URL:**
```
https://higueronlomas2.com
```

**Redirect URLs:**
```
http://localhost:3000/**
http://localhost:3000/api/auth/callback
https://higueronlomas2.com/**
https://higueronlomas2.com/api/auth/callback
```

### Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Troubleshooting

### Common Issues

#### ❌ "Invalid email address"
**Cause:** User not confirmed email\
**Solution:** Check email, click confirmation link

#### ❌ "Invalid login credentials"
**Cause:** Wrong password or user doesn't exist\
**Solution:** Check email/password, use Google OAuth if registered that way

#### ❌ "User already registered"
**Cause:** Account exists with this email\
**Solution:** Use login page or password recovery

#### ❌ "OAuth error"
**Cause:** Google OAuth configuration missing\
**Solution:** Check Supabase Google OAuth settings and credentials

#### ❌ "Session not found"
**Cause:** Session expired or invalid\
**Solution:** Log in again

#### ❌ "Profile not found"
**Cause:** Postgres trigger didn't create profile\
**Solution:** Check database trigger, verify RLS policies

#### ❌ "Invalid callback"
**Cause:** Callback URL or parameters invalid\
**Solution:** Check URL formatting, verify token in request

#### ❌ "Email not configured"
**Cause:** SMTP not set up in Supabase\
**Solution:** Configure email provider in Supabase

---

## Testing

### Manual Testing Checklist

#### Email/Password Signup
- [ ] Visit `/register`
- [ ] Enter email, password, full name
- [ ] Click "Create Account"
- [ ] Check email for magic link
- [ ] Click link in email
- [ ] Redirected to `/onboarding`
- [ ] Complete onboarding (optional)
- [ ] Check profile page shows user data
- [ ] Logout and verify session cleared

#### Email/Password Login
- [ ] Visit `/login`
- [ ] Enter registered email and password
- [ ] Redirected to `/`
- [ ] Check user menu shows name/email
- [ ] Profile page shows correct user data

#### Password Recovery
- [ ] Visit `/forgot-password`
- [ ] Enter email of registered user
- [ ] Check email for reset link
- [ ] Click link in email
- [ ] Redirected to `/reset-password`
- [ ] Enter new password twice
- [ ] Click "Update Password"
- [ ] Auto-logged out
- [ ] Login with new password works

#### Error Handling
- [ ] Visit `/api/auth/callback?error=invalid`
- [ ] Error page displays with troubleshooting
- [ ] "Back to Login" button works
- [ ] "Back to Home" button works

---

## Database Schema

### profiles Table
```sql
create table public.profiles (
  id uuid not null primary key references auth.users(id),
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);
```

### Postgres Trigger
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, created_at, updated_at)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', now(), now());
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### RLS Policies
- Users can read own profile
- Users can update own profile
- Service role can read all profiles

---

## Performance Notes

### Optimizations
- Session stored in cookies (secure, httpOnly)
- Profiles pre-fetched on middleware check
- OAuth state managed by Supabase
- Magic links expire after 24 hours
- Password reset tokens valid for 1 hour

### Security
- Passwords hashed with bcrypt
- Sessions signed and verified
- CORS restricted to registered domains
- RLS enforced on all database queries
- HTML sanitization on user inputs

---

## Deployment

### Vercel
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy branch automatically
4. Configure custom domain
5. Verify HTTPS certificate

### Supabase Webhooks (Optional)
- Monitor auth events
- Send notifications
- Sync external services

---

## Support

For detailed setup instructions, see: **AUTH_SETUP_CHECKLIST.md**

For authentication API docs, see: **Supabase Auth Documentation**
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/auth/auth-email

