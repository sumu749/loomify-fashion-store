# Loomify

Loomify is a full-stack fashion e-commerce application built with Next.js. It provides a responsive storefront for browsing clothing, footwear, and accessories, together with authenticated customer accounts and an admin workspace for managing the catalog and orders.

## Features

### Storefront

- Browse published products and categories
- Product detail pages with images, variants, sizes, colors, and stock
- Product search, filtering, sorting, and pagination
- Cart and wishlist management
- Checkout with saved delivery addresses
- Cash on delivery order creation and order tracking
- Customer profiles, addresses, order history, and reviews
- Help, FAQ, contact, shipping, returns, privacy, and terms pages

### Administration

- Dashboard for store activity
- Product and product variant management
- Category management
- Order management and status updates
- Coupon management
- User management

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router
- React 19 and TypeScript
- PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- [Better Auth](https://www.better-auth.com/) for authentication
- TanStack React Query for server state
- Redux Toolkit and React Redux for client state
- Tailwind CSS v4
- Framer Motion for animations
- Lucide React and React Icons
- Zod for validation

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database

## Getting Started

From the `loomify-v2` directory, install dependencies:

```bash
npm install
```

Create a `.env` file in this directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Apply the Prisma migrations and generate the client:

```bash
npx prisma migrate dev
npx prisma generate
```

Seed the database with sample categories, products, variants, and images:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                      | Description                             |
| ---------------------------- | --------------------------------------- |
| `npm run dev`                | Start the Next.js development server    |
| `npm run build`              | Create a production build               |
| `npm run start`              | Start the production server             |
| `npm run lint`               | Run ESLint                              |
| `npx prisma migrate dev`     | Apply and create development migrations |
| `npx prisma db seed`         | Populate the database with sample data  |
| `npm run add-product-images` | Import product image assets             |

## Project Structure

```text
loomify-v2/
├── prisma/                 # Prisma schema, migrations, and seed data
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router pages, API routes, and admin pages
│   ├── components/         # Reusable UI components
│   ├── features/           # Cart and wishlist feature logic
│   ├── hooks/              # React Query and product hooks
│   ├── lib/                # Auth, Prisma, and mapping utilities
│   ├── services/           # Product and admin service functions
│   ├── store/              # Redux store and typed hooks
│   └── types/              # Shared TypeScript types
└── scripts/                # Maintenance and data-import scripts
```

## Database and Authentication

The application uses PostgreSQL through Prisma. The schema includes users, Better Auth sessions and accounts, categories, products, variants, carts, wishlists, orders, reviews, coupons, and addresses.

Authentication routes are available at `/login` and `/register`. Administrative pages are under `/admin` and require an authenticated user with the `ADMIN` role. The seed data creates the initial catalog; configure administrator access through the application's user data before using the admin workspace.

## Production Build

Set production environment variables, apply migrations, and build the application:

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
npm run start
```

The Next.js image configuration currently allows images hosted on `images.unsplash.com`.
