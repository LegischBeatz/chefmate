
# SaaS Application Shell Specification

## Overview
This document outlines the functional requirements for the "SaaS Shell" architecture. This shell serves as the foundational template for a subscription-based web application. It handles user identity, commerce, configuration, and compliance, allowing "Core Business Modules" (e.g., Meal Planning, AI Generation) to be plugged in with minimal friction.

---

## 1. Global Navigation & Layout System

### 1.1. Navigation Bar (`Navbar`)
*   **State Awareness:** The navigation must dynamically render based on the user's authentication state (`Guest` vs. `Authenticated`).
*   **Guest View:**
    *   Must display links to public marketing pages: "Inspire" (Landing), "Pricing", "About", "Contact".
    *   Must display primary actions: "Log in" and "Sign up".
*   **Authenticated View:**
    *   Must display links to core application features.
    *   **User Dropdown:** Must provide access to user-centric features:
        *   Profile/Settings.
        *   Subscription Management.
        *   Logout action.
    *   **User Avatar:** Display user's profile image or initials.
*   **Mobile Responsiveness:**
    *   Must collapse into a hamburger menu on viewport widths < 768px.
    *   Mobile menu must contain all links available in the desktop view.

### 1.2. Footer
*   **Content:** Must contain links to legal pages (Privacy, Terms, Impressum), public pages (About, Pricing), and Contact.
*   **Copyright:** Dynamic year display.

### 1.3. Global Feedback System
*   **Toast Notifications:** A centralized system to display transient success/error messages (e.g., "Settings Saved", "Login Failed") triggered by any component in the app.

---

## 2. Authentication & Identity Management

### 2.1. Sign Up
*   **Inputs:** Name, Email, Password.
*   **Validation:** Email format validation, required fields check.
*   **Behavior:**
    *   On success: Create account (via Supabase or Mock), auto-login, and redirect to the specific "Landing" view for authenticated users.
    *   On failure: Display inline error messages.
*   **Welcome Flow:** Trigger a transactional "Welcome Email" upon successful registration.

### 2.2. Log In
*   **Inputs:** Email, Password.
*   **Social Login:** UI placeholders for Google/Apple login (functionality adaptable to provider).
*   **Behavior:**
    *   On success: Update global `UserContext` and redirect to the App Dashboard.
    *   On failure: Clear sensitive fields and show error alert.

### 2.3. Log Out
*   **Action:** Securely clear local session data/tokens.
*   **Redirection:** Immediate redirect to the public Landing page.

---

## 3. Account Settings & Configuration (`Settings`)

The settings module functions as a centralized dashboard with persistent state.

### 3.1. Navigation & State
*   **Tabs:** Sidebar navigation for Profile, Subscription, Notifications, and Security.
*   **Persistence:** The application must remember the last active Settings tab (via `localStorage`) to prevent context loss on page refresh.
*   **Deep Linking:** External links (e.g., from the Navbar) must be able to open specific tabs directly via event dispatching.

### 3.2. Profile Management
*   **Avatar:** UI for uploading/removing profile pictures.
*   **Personal Details:** Editable fields for Display Name and Email.
*   **Verification:** Visual indicator if the email address is unverified.

### 3.3. Notification Preferences
*   **Granularity:** Toggles for distinct channels:
    *   Product Updates (Email).
    *   Marketing/Tips (Email).
    *   Push Notifications (Browser).
*   **Persistence:** Save preferences to user profile.

### 3.4. Security Center
*   **Password Management:** Form to update password (requires Current, New, Confirm inputs).
*   **Session Management:**
    *   List active devices/sessions (Device type, Location, IP, Last Active).
    *   Ability to revoke specific sessions (simulated).
*   **Danger Zone:**
    *   "Delete Account" functionality requiring explicit confirmation to prevent accidental data loss.

---

## 4. Subscription & Billing Engine

### 4.1. Pricing Page (`Pricing`)
*   **Tier Display:** Comparative grid of available plans (e.g., Free, Plus, Pro).
*   **Feature Gating Logic:** Visual distinction between current plan and upgrade options.
*   **Toggle:** (Optional) Monthly vs. Yearly billing toggle.

### 4.2. Subscription Management (Inside `Settings`)
*   **Status Card:** High-visibility display of:
    *   Current Tier.
    *   Renewal Date.
    *   Payment Amount.
    *   Visual "Active" badge.
*   **Usage Visualization:** Progress bar showing usage of limited resources (e.g., "2/5 Generations used") vs. "Unlimited" for Pro users.
*   **Upgrade Flow:** Integration point for Stripe Checkout (or mock equivalent).
*   **Cancellation Flow:** multi-step cancellation process ("Are you sure?") to reduce churn.
*   **Invoice History:** List of past payments with download links for PDFs.

---

## 5. Marketing & Public Pages

### 5.1. Landing Page (`Landing`)
*   **Hero Section:** High-conversion area with primary Value Proposition and CTA.
*   **Feature Highlights:** Bento-grid or feature strip styling to explain the product.
*   **Interactive Demo:** (Optional) A "Trial Wizard" or limited version of the core feature to capture leads.
*   **Social Proof:** Metrics or testimonials section.

### 5.2. Contact Page (`Contact`)
*   **Form:** Name, Email, Subject dropdown, Message body.
*   **Integration:** Connection to transactional email service (e.g., Resend) to forward inquiries to support.
*   **Feedback:** Success state animation upon submission.

### 5.3. About Page (`About`)
*   **Mission Statement:** Static content describing the company goal.
*   **Team/Stats:** Trust-building metrics.

---

## 6. Legal & Compliance Module

### 6.1. Documents
*   **Impressum:** Legal company details (required in DACH regions).
*   **Privacy Policy:** Data collection, processor listing (Supabase, Stripe, etc.), and user rights.
*   **Terms of Service:** Liability disclaimers (specifically regarding AI usage), subscription terms, and termination clauses.

### 6.2. AI Disclaimer
*   Global requirement to display disclaimers regarding AI accuracy, specifically in contexts involving health/nutrition (or finance/legal in other adaptations).

---

## 7. Technical Foundation (The Template Interface)

To ensure this shell serves as a generic template, it provides the following interfaces to the "Core Feature":

*   **`UserContext`:** Exposes `user.tier`, `usage.limit`, and `usage.used` to allow the core feature to enforce gating logic (e.g., "Upgrade to use this feature").
*   **`Layout Wrapper`:** A consistent container ensuring the Navbar and Footer surround the core feature.
*   **`Design System`:**
    *   **Typography:** Inter font family.
    *   **Colors:** Semantic naming (`chef-green`, `chef-surface`) that can be re-themed via Tailwind config.
    *   **Components:** Reusable `Button`, `Input`, and `Modal` components used across both the Shell and the Core.
