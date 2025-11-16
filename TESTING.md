# Frontend Error Handling & User Experience Test Plan

## Summary
This document outlines all scenarios that the frontend should handle after the new security improvements.

---

## 1. LOGIN FLOW (`/login`)

### Scenario 1.1: Successful Login
- **Steps**: Enter valid email and password
- **Expected**: 
  - Toast: ✅ Success message
  - Redirect to home page
  - User logged in

### Scenario 1.2: Invalid Credentials (Wrong Password)
- **Steps**: Enter valid email but wrong password
- **Expected**: 
  - Toast: ❌ "Invalid email or password"
  - Stay on login page
  - Form remains active

### Scenario 1.3: Non-existent Email
- **Steps**: Enter email that doesn't exist
- **Expected**: 
  - Toast: ❌ "Invalid email or password" (generic message, no user enumeration)
  - Stay on login page

### Scenario 1.4: Rate Limit Exceeded (5 attempts per 15 min)
- **Steps**: Try logging in 6+ times with same email in 15 minutes
- **Expected**: 
  - Toast: ⚠️ "Too many login attempts. Please try again later."
  - HTTP Status: 429
  - Stay on login page
  - Loading button blocked

### Scenario 1.5: Invalid Email Format
- **Steps**: Enter "notanemail"
- **Expected**: 
  - Zod validation error on form
  - Cannot submit

### Scenario 1.6: Empty Fields
- **Steps**: Leave email or password empty
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 1.7: Network Error
- **Steps**: Simulate network failure (dev tools)
- **Expected**: 
  - Toast: ❌ "An unexpected error occurred"
  - Stay on login page

---

## 2. FORGOT PASSWORD FLOW (`/forgot-password`)

### Scenario 2.1: Valid Email (Account Exists)
- **Steps**: Enter email associated with account
- **Expected**: 
  - Toast: ✅ "If an account exists with this email, you will receive a password reset link."
  - Form resets
  - Email sent to user with reset link
  - Button shows "Enviando..." during request

### Scenario 2.2: Valid Email (Account Doesn't Exist)
- **Steps**: Enter email NOT in database
- **Expected**: 
  - Toast: ✅ Same generic message (no user enumeration)
  - Form resets
  - No email sent
  - User cannot distinguish if account exists

### Scenario 2.3: Rate Limit Exceeded (3 requests per hour)
- **Steps**: Submit 4+ times in 1 hour
- **Expected**: 
  - Toast: ⚠️ "Too many password reset requests. Please try again later."
  - HTTP Status: 429
  - Form still accessible

### Scenario 2.4: Invalid Email Format
- **Steps**: Enter "invalid"
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 2.5: Empty Email
- **Steps**: Leave email blank
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 2.6: Network Error
- **Expected**: 
  - Toast: ❌ "Error al enviar email"

---

## 3. RESET PASSWORD FLOW (`/reset-password`)

### Scenario 3.1: Valid Token + Matching Passwords
- **Steps**: 
  1. Click password reset link from email
  2. Enter new password and confirmation
  3. Submit
- **Expected**: 
  - Toast: ✅ "Password updated successfully!"
  - Redirect to login after 1.5s
  - Session cleared (logged out)

### Scenario 3.2: Invalid Token (Expired Link)
- **Steps**: 
  1. Wait for link to expire (Supabase default: 1 hour)
  2. Try to access `/reset-password`
- **Expected**: 
  - Toast: ⚠️ "Your reset link has expired. Please request a new one."
  - Redirect to `/forgot-password` after 1.5s
  - HTTP Status: 401

### Scenario 3.3: No Session
- **Steps**: Access `/reset-password` without valid token
- **Expected**: 
  - Show: "Validating your reset link..."
  - Detect no token
  - Toast: ⚠️ "Invalid or expired reset link"
  - Redirect to `/login` after 2s

### Scenario 3.4: Passwords Don't Match
- **Steps**: 
  1. Enter password: "Password123"
  2. Enter confirm: "Password456"
  3. Try submit
- **Expected**: 
  - Zod validation error on form
  - Cannot submit

### Scenario 3.5: Password Too Short (< 8 chars)
- **Steps**: Enter "Pass12"
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 3.6: Valid Form + Server Validation Error
- **Steps**: 
  1. Form validates (passwords match, 8+ chars)
  2. Server rejects due to password policy
- **Expected**: 
  - Toast: ❌ Server error message
  - Stay on form
  - Button shows "Updating..." during request

### Scenario 3.7: Session Expired During Reset
- **Steps**: 
  1. Token is still valid (< 1 hour)
  2. But session in cookies expired
- **Expected**: 
  - Toast: ⚠️ "Your reset link has expired. Please request a new one."
  - HTTP Status: 401
  - Redirect to `/forgot-password`

---

## 4. REGISTER FLOW (`/register`)

### Scenario 4.1: Successful Registration
- **Steps**: 
  1. Enter new email and password (8+ chars)
  2. Confirm password matches
  3. Submit
- **Expected**: 
  - Toast: ✅ "Verification email sent. Check your mail."
  - Redirect to `/confirm-signup`
  - Email verification link sent

### Scenario 4.2: Email Already Exists
- **Steps**: Try registering with existing email
- **Expected**: 
  - Toast: ❌ "Este correo ya está registrado. Por favor inicia sesión o usa otro correo." (or language equivalent)
  - Stay on form
  - Button shows "Registering..." during request
  - t.register.userExists translation used

### Scenario 4.3: Weak Password (< 8 chars)
- **Steps**: Enter "Pass12"
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 4.4: Passwords Don't Match
- **Steps**: 
  1. Password: "Password123"
  2. Confirm: "Password456"
- **Expected**: 
  - Zod validation error: "Passwords don't match"
  - Cannot submit

### Scenario 4.5: Invalid Email Format
- **Steps**: Enter "notanemail"
- **Expected**: 
  - Zod validation error
  - Cannot submit

### Scenario 4.6: Rate Limit (if implemented)
- **Steps**: Try registering 5+ times quickly
- **Expected**: 
  - Toast: ⚠️ "Too many registration attempts. Please try again later."
  - HTTP Status: 429

### Scenario 4.7: Empty Fields
- **Expected**: 
  - Zod validation errors
  - Cannot submit

### Scenario 4.8: Network Error
- **Expected**: 
  - Toast: ❌ "An unexpected error occurred during registration"
  - Stay on form

---

## 5. STATE MANAGEMENT

### Loading States
- ✅ Login button disabled + "Logging in..." during request
- ✅ Register button disabled + "Registering..." during request
- ✅ Forgot password button disabled + "Enviando..." during request
- ✅ Reset password button disabled + "Updating..." during request

### Error Display
- ✅ All errors shown as toast notifications
- ✅ Generic errors for security (no user enumeration)
- ✅ Specific errors for password/format validation
- ✅ Rate limit errors clearly communicated

### Success Flow
- ✅ Success toast shown
- ✅ Appropriate redirects
- ✅ Form reset on success (forgot password)
- ✅ Session managed correctly

---

## 6. TRANSLATIONS

### Required Translation Keys
- ✅ `t.login.loginSuccess` - "Login successful"
- ✅ `t.register.userExists` - "Email already registered"
- ✅ `t.register.verificationSent` - "Verification email sent"
- ✅ `t.register.confirmPassword` - "Confirm Password"

All keys are defined in `/src/config/translations.ts` for all 11 languages:
- es (Spanish)
- en (English)
- de (German)
- it (Italian)
- fr (French)
- pt (Portuguese)
- hu (Hungarian)
- sv (Swedish)
- da (Danish)
- ru (Russian)
- ro (Romanian)

---

## 7. HTTP STATUS CODES HANDLED

| Status | Scenario | Frontend Handling |
|--------|----------|------------------|
| 200 | Success | Show success toast + redirect |
| 400 | Invalid input | Show specific error |
| 401 | Auth failed / Session expired | Show error + redirect to appropriate page |
| 429 | Rate limit | Show rate limit warning |
| 500 | Server error | Show generic error message |

---

## 8. Security Features

- ✅ Generic error messages (no user enumeration)
- ✅ Rate limiting server-side
- ✅ Password validation client-side (Zod)
- ✅ Session validation server-side
- ✅ Token expiration handling
- ✅ HTTPS enforced (production)
- ✅ Passwords never logged
- ✅ No sensitive data in URLs
- ✅ Token in cookies (HttpOnly, Secure)

---

## 9. MANUAL TESTING CHECKLIST

### Login Page
- [ ] Enter valid credentials → logs in
- [ ] Enter wrong password → error
- [ ] Try 6 times → rate limit
- [ ] Check loading state on button
- [ ] Check toast messages

### Register Page
- [ ] Valid new account → success
- [ ] Existing email → proper error
- [ ] Password mismatch → validation error
- [ ] Short password → validation error
- [ ] Check loading state
- [ ] Check t.register.userExists translation

### Forgot Password
- [ ] Valid email → success message
- [ ] Invalid email → validation
- [ ] Try 4 times in 1 hour → rate limit
- [ ] Check loading state

### Reset Password
- [ ] Valid link → success
- [ ] Expired link → error + redirect
- [ ] No token → validation
- [ ] Password mismatch → validation
- [ ] Check loading state

---

## 10. EDGE CASES

- [ ] User closes browser during request
- [ ] Network interruption mid-request
- [ ] Browser back button after success
- [ ] Multiple tabs submitting simultaneously
- [ ] Expired token in middle of form
- [ ] Language switching during request
- [ ] Very slow network (3G)
