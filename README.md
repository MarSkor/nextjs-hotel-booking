![Logo](/public/assets/logo/logo.png)

# Holidaze - Accommodation Booking Platform

A full-stack accommodation booking platform designed with a dual-sided interface for both users and admins built with Next.js. The platform features real-time booking management, secure payments and a automated serverless workflow for reservation life cycles.

## Demo

### Authentication process

⏳...

### Admin side

⏳...

## Technologies

- Framework: [Next.js (App Router)](https://nextjs.org/)
- Database: [Neon (Serverless Postgres)](https://neon.com/)
- ORM: [Drizzle ORM](https://orm.drizzle.team/)
- Authentication: [Auth.js (NextAuth v5)](https://authjs.dev/) with `bcryptjs`
- Background jobs: [Upstash Workflow & Qstash](https://upstash.com/)
- Styling: [SASS (SCSS)](https://sass-lang.com/)
- UI Library: [Mantine UI](https://mantine.dev/)
- Payments: [Stripe API](https://docs.stripe.com/)
- Form handling: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation.
- Image Management: [ImageKit](https://imagekit.io/)

## User Features

- Browse & Search: filter accommodations by type, price and dates.
- Booking System: secure checkout flow via stripe.
- Booking-History: account page to track reservation status (Pending, Confirmed, Cancelled)
- Automated Notifications: receive emails powered by Upstash Workflows.
- Profile Management: update personal information.

## Admin Features

- Property Management: Create, Read, Update and Delete accommodation listings.
- Image Uploads: image uploads integrated with ImageKit
- User Management: administrative control over user roles and accounts.
- Dashboard Analytics: overview of revenue and occupancy rates.
- Audit Logs: every critical action (cancellations, moderation, account deletions) is tracked in a system-wide log.

## Project Structure

```
src/
├── actions/              # Server Actions handling all CRUD operations
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── (admin)/          # Protected Admin dashboard & management routes
│   ├── (auth)/           # Authentication routes (Login, Register)
│   ├── (root)/           # Public-facing pages and User-specific routes
│   └── api/              # Route Handlers (Stripe webhooks, ImageKit auth, Workflows)
├── components/           # Reusable UI components
│   ├── icons/            # SVG components and Icon library
│   ├── layout/           # Structure components (Navbar, Footer, Sidebar)
│   └── ui/               # Generic UI elements (Buttons, Badges, Modals, Cards)
├── features/             # Domain-specific components grouped by functionality
├── database/             # Database layer
│   ├── schema/           # Drizzle ORM table definitions
│   └── drizzle.js        # Neon DB connection and configuration
├── lib/                  # Third-party SDK initializations (Stripe, ImageKit, Auth.js)
├── utils/                # Helper functions, formatters, and shared constants
└── styles/               # Global SASS/SCSS files and mixins

```

## Run Locally

Clone the project

```bash
  git clone https://github.com/MarSkor/nextjs-hotel-booking
```

Go to the project directory

```bash
  cd nextjs-hotel-booking
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Upstash Workflow is built on top of Upstash QStash.
The QStash CLI provides a local development server that performs QStash functionality locally for development and testing purposes.

To run Upstash Qstash development server

```
npx @upstash/qstash-cli dev
```

Populate the database with dummy data.

```
node src/database/seed.js
```

Stripe webhook listening to the following events

```
- checkout.session.async_payment_failed
- checkout.session.async_payment_succeeded
- checkout.session.completed
- checkout.session.expired
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file.

`NEXT_PUBLIC_API_ENDPOINT` = "your site here . com"

`AUTH_SECRET`

`DATABASE_URL`

`NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`

`IMAGEKIT_PRIVATE_KEY`

`UPSTASH_REDIS_REST_URL`

`UPSTASH_REDIS_REST_TOKEN`

`QSTASH_URL`

`QSTASH_TOKEN`

`RESEND_TOKEN`

`RESEND_FROM_NAME`= for example `Holidaze`, which is the name of the application.

`RESEND_FROM_BASE_EMAIL_ADDRESS`=`@your-resend-domain-here.com`

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

`STRIPE_SECRET`

`STRIPE_WEBHOOK_SECRET`

`CRON_SECRET`= A random string of at least 16 characters. [Securing cron jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs)

## Database Setup

```
npx drizzle-kit push
```

## Workflows & Background Tasks

- Booking Expiry: if a user doesn't complete a stripe payment ~~within 1 hour~~ once a day (hobby accounts are limited to only _daily_ cron jobs.), Qstash triggers a workflow to release the reserved dates back to the database.
- Dynamic Ratings: When a review is approved or deleted by an admin, QStash triggers a background workflow to recalculate the accommodation's average rating and total review count.

## To Implement ⏳

- [ ] Image carousel for accommodation/[slug]/page.
- [ ] More advanced stats for admin overview with charts.
- [ ] Profile Management: name change and avatar upload.
- [ ] Automatically schedule a review invitation _after_ the guest check-out date
- [ ] Password strength on auth form.
- [ ] ...
