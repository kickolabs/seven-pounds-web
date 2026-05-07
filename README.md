# The Seven Pounds

**EMI relief. Real results.**

A full-stack marketing and lead-generation website for **The Seven Pounds Financial Relief Firm** — an Indian financial advisory firm specialising in EMI restructuring, debt management, and personalised financial planning.

---

## What It Does

- **Landing page** — Multi-section marketing site showcasing services, plans, and value propositions
- **Consultation booking** — Razorpay-powered paid consultation flow (₹499 fee)
- **Contact form** — Lead capture with Supabase storage
- **Admin dashboard** — Protected portal for viewing consultation bookings and contact submissions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion + Lenis (smooth scroll) |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Razorpay |

---

## Project Structure

```
app/
  page.tsx                   # Homepage
  layout.tsx                 # Root layout
  admin/
    login/                   # Admin login
    leads/                   # Consultation bookings dashboard
    contacts/                # Contact submissions dashboard
  api/
    contact/                 # Contact form API
    consultation/
      create-order/          # Razorpay order creation
      verify-payment/        # Razorpay signature verification

components/
  sections/                  # Page sections (Hero, Services, Plans, etc.)
  shared/                    # Reusable components (ConsultationModal, ContactForm, etc.)
  ui/                        # shadcn/ui primitives

lib/
  constants.ts               # Business data, plans, and copy
  env.ts                     # Environment variable validation
  animations.ts              # Framer Motion presets
  razorpay.ts                # Razorpay client setup
  supabase/                  # Supabase client and server instances

supabase/
  schema.sql                 # Database schema
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Razorpay](https://razorpay.com) account (test or live)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=https://thesevenpounds.in
```

### 3. Set up the database

Run the SQL in `supabase/schema.sql` in your Supabase project's SQL editor. This creates:

- `consultations` — tracks bookings and Razorpay payment status
- `contacts` — stores contact form submissions
- Row-level security (RLS) policies
- Indexes on `created_at` and `payment_status`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Dashboard

The admin portal lives at `/admin`. Access requires an authenticated Supabase user (email/password).

To create an admin account, invite a user from your Supabase project's Authentication dashboard, then navigate to `/admin/login`.

---

## Consultation Flow

1. User clicks a CTA or plan card
2. `ConsultationModal` opens — user fills in name, phone, email, and optionally selects a plan
3. The modal calls `POST /api/consultation/create-order` → Razorpay order is created
4. Razorpay checkout opens in the browser
5. On success, `POST /api/consultation/verify-payment` verifies the HMAC signature and stores the lead in Supabase

**Consultation fee:** ₹499

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

The site is designed to deploy on **Vercel**. Set all environment variables in the Vercel project settings. The `NEXT_PUBLIC_SITE_URL` should match your production domain.
