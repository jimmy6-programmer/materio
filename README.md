# Ecommerce Platform Monorepo

This monorepo contains two Next.js applications: a storefront and an admin dashboard.

## Apps

- **storefront** (`apps/storefront/`): Client-facing e-commerce application
- **admin-dashboard** (`apps/admin-dashboard/`): Admin dashboard for managing the platform

## Running Both Apps

To run both apps in development mode:

```bash
pnpm dev
```

This will start both the storefront and admin dashboard in parallel.

## Running Individual Apps

To run only the storefront:

```bash
cd apps/storefront
pnpm dev
```

To run only the admin dashboard:

```bash
cd apps/admin-dashboard
pnpm dev
```

## Building

To build both apps:

```bash
pnpm build