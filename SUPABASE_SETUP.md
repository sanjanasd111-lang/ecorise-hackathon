# 🛠️ EcoRise 2.0 – Supabase Setup Guide

This guide explains how to connect EcoRise 2.0 to your Supabase cloud backend in minutes.

> **Offline / Demo Fallback**: If you do not have Supabase credentials yet, EcoRise 2.0 automatically boots in a resilient local multi-user demonstration mode so you and presentation judges can evaluate all authentication flows, real-time recalculations, Eco Habit DNA, and mascot evolutions immediately!

---

## 📋 Step-by-Step Configuration

### 1. Create a Free Supabase Project
1. Navigate to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose an organization, and name your project (e.g. `EcoRise-Platform`).
3. Set a strong database password and select the region closest to your users.

### 2. Copy API Keys
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Locate:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys** → `anon` `public` key.
3. In your project root, create a file named `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

### 3. Run Database Schema & Seed Data
1. In the Supabase Dashboard, click the **SQL Editor** tab on the left sidebar.
2. Click **New Query**, then open and paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Click **Run** (or `Ctrl + Enter`). This creates:
   - `profiles`, `challenges`, `activity_completions`, `achievements`, `user_achievements`, `user_streaks`, `weekly_stats`.
   - All Row Level Security (RLS) policies.
   - High-performance indexes.
   - The user creation trigger.
4. Next, create another query and paste the contents of [`supabase/seed.sql`](supabase/seed.sql), then click **Run**. This populates the challenge catalog and achievements.

### 4. Configure Authentication Providers
1. In Supabase Dashboard, navigate to **Authentication** → **Providers**.
2. **Email Provider**:
   - Ensure **Email** is enabled.
   - (Optional for development): Turn off *Confirm email* under *Email Auth* if you wish users to sign in immediately upon registration without email verification.
3. **Google OAuth (Optional)**:
   - Expand the **Google** provider.
   - Follow the Supabase instructions to create a Google Cloud OAuth Client ID and Secret.
   - Enter your Client ID and Client Secret, then click **Save**.

### 5. URL Configuration
1. Navigate to **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```
   http://localhost:3000
   ```
3. Add `http://localhost:3000/**` to **Redirect URLs**.

### 6. Start EcoRise 2.0
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to experience EcoRise 2.0 with live cloud database persistence!
