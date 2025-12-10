This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

First, set up your environment variables:

```bash
# Copy the environment template
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

**📖 Quick Setup Guide:**

**Easiest Method:**

1. **For Local Development:**

   ```bash
   # Copy the template file
   cp env.local.template .env.local
   # Usually no changes needed - defaults work fine!
   ```

2. **For Production:**
   ```bash
   # Copy the template file
   cp env.production.template .env.production
   # Then edit .env.production and update values marked with "CHANGE THIS"
   ```

**What to Change in Production:**

- ✅ `NEXT_PUBLIC_SITE_URL` → Your production domain (e.g., `https://www.beyuvana.com`)
- ✅ `NEXT_PUBLIC_PREPAID_PROMO_CODE` → Your production promo code
- ✅ `NODE_ENV` → Set to `production`

See **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** for detailed instructions.

**Available Environment Variables:**

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the API backend (default: `https://beyuvana.com/api`)
- `NEXT_PUBLIC_PROXY_URL` - Proxy URL for API requests (default: `/api/proxy`)
- `NEXT_PUBLIC_SITE_URL` - Base URL of the website (default: `http://localhost:3000`)
- `NEXT_PUBLIC_PREPAID_PROMO_CODE` - Promo code for prepaid orders (default: `TEST150`)
- `NEXT_PUBLIC_AUTO_APPLY_PROMO` - Auto-apply promo code (default: `true`)
- `NEXT_PUBLIC_BUILD_ID` - Build ID for cache busting (optional)
- `NODE_ENV` - Node environment (usually set automatically)

**Note:** Environment variables are automatically validated at startup. See `src/lib/env-validation.ts` for validation rules.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Environment Variables

Before deploying, make sure to set up your environment variables. See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_API_BASE_URL` - Your API base URL
- `NEXT_PUBLIC_SITE_URL` - Your production site URL
- `NEXT_PUBLIC_PREPAID_PROMO_CODE` - Promo code for prepaid orders (if different from default)
- `NEXT_PUBLIC_AUTO_APPLY_PROMO` - Set to `true` or `false`
- `NODE_ENV` - Set to `production`

You can also use `.env.production` file for production-specific values. See `.env.example` for all available variables.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Documentation

- **[PROJECT_FLOW.md](./PROJECT_FLOW.md)** - Complete application flow and architecture documentation
- **[PROJECT_FEEDBACK.md](./PROJECT_FEEDBACK.md)** - Code review and improvement recommendations

### Production Features

This project includes production-ready optimizations:

- ✅ Environment-based configuration
- ✅ Request timeout handling (15s)
- ✅ Optimized logging (development vs production)
- ✅ CORS handling via proxy
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ Security headers and input sanitization
- ✅ API caching and request deduplication
- ✅ Bundle optimization and code splitting
