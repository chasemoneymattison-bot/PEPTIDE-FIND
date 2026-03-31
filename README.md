# PeptideFind - Peptide Aggregator & Comparison Platform

PeptideFind is a full-stack web application that aggregates peptide products from multiple vendors into a single searchable directory with advanced filtering, price comparison, vendor ratings, and user reviews. Think of it as "Kayak for peptides."

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** NextAuth.js (Email magic link + Google OAuth)
- **Validation:** Zod
- **Deployment:** Vercel-ready

## Prerequisites

- **Node.js 18+** (v20+ recommended)
- **PostgreSQL** database (local or hosted like Supabase, Neon, Railway)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone and Install

```bash
cd peptidefind
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

**Required variables:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - `http://localhost:3000` for development

**Optional (for full features):**
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - For Google OAuth sign-in
- `EMAIL_SERVER_*` - For magic link email authentication (Resend recommended)
- `STRIPE_*` - For vendor subscription billing
- `RESEND_API_KEY` - For transactional emails and price alerts

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. View Database (Optional)

```bash
npx prisma studio
```

Opens a browser-based database viewer at [http://localhost:5555](http://localhost:5555).

## Project Structure

```
peptidefind/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── search/            # Search & filter page
│   │   ├── peptide/[slug]/    # Peptide detail page
│   │   ├── vendor/[slug]/     # Vendor profile page
│   │   ├── vendors/           # Vendor directory
│   │   ├── compare/           # Side-by-side comparison
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── SearchBar.tsx      # Search input component
│   │   ├── FilterSidebar.tsx  # Search filters
│   │   ├── ProductCard.tsx    # Product listing card
│   │   ├── VendorCard.tsx     # Vendor directory card
│   │   ├── PriceComparisonTable.tsx
│   │   ├── RatingStars.tsx    # Star rating display
│   │   ├── ReviewCard.tsx     # Review display
│   │   ├── ReviewForm.tsx     # Review submission form
│   │   ├── Navbar.tsx         # Top navigation
│   │   └── Footer.tsx         # Site footer
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── utils.ts           # Utility functions
│   │   └── types.ts           # TypeScript types
│   └── styles/
│       └── globals.css        # Global styles & CSS variables
├── .env.example               # Environment variable template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Key Features

### Search & Filtering
- Full-text search across peptides, vendors, and categories
- Filter by: category, price range, purity, vendor rating, form type, stock status, US-based, lab testing
- URL-synced filters (shareable/bookmarkable search results)
- Sort by: price, rating, newest

### Peptide Pages
- Detailed peptide information with CAS numbers and aliases
- Price comparison table across all vendors
- Price statistics (lowest, average)
- Related peptides

### Vendor Profiles
- Vendor information with verification badges
- Rating breakdown histogram
- All products listed
- User reviews with verified purchase badges

### API Routes
- RESTful API for all data
- Admin endpoints for managing vendors, products, and reviews
- Affiliate redirect tracking with click logging

## Adding New Vendors

Use the admin API or Prisma Studio:

```bash
# Via API (requires admin authentication)
curl -X POST http://localhost:3000/api/admin/vendors \
  -H "Content-Type: application/json" \
  -d '{"name": "New Vendor", "website": "https://example.com", "isUSBased": true}'

# Or use Prisma Studio for a visual interface
npx prisma studio
```

## Adding New Products

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"vendorId": "...", "peptideId": "...", "price": 49.99, "quantity": 10, "unit": "mg", "purity": 99.1}'
```

Bulk import is supported by passing an array of products.

## Configuring Affiliate Links

Each product and vendor can have an `affiliateUrl` field. When users click "View Deal", they are routed through `/api/redirect/[productId]` which:

1. Logs the click (userId, timestamp, productId, vendorId)
2. Redirects to the affiliate URL (falls back to product URL, then vendor website)

Set affiliate URLs via the admin API or Prisma Studio.

## Seed Data

The seed script (`prisma/seed.ts`) includes:
- **10 vendors** (mix of US and international, varying ratings and tiers)
- **25 peptides** (BPC-157, TB-500, Sermorelin, CJC-1295, and 21 more with descriptions, CAS numbers, and aliases)
- **75-125 products** (3-5 listings per peptide across vendors)
- **40 reviews** with realistic content
- **3 users** (admin, vendor_admin, regular user)

## Deployment

The project is Vercel-ready. Connect your GitHub repo to Vercel and set environment variables in the Vercel dashboard.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
