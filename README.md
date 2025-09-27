This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

First, set up your environment variables:

```bash
# Copy the environment template
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for details).

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

- `NEXT_PUBLIC_API_BASE_URL`: `https://beyuvana.com/api`
- `NEXT_PUBLIC_PROXY_URL`: `/api/proxy`

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Production Features

This project includes production-ready optimizations:

- ✅ Environment-based configuration
- ✅ Request timeout handling (15s)
- ✅ Optimized logging (development vs production)
- ✅ CORS handling via proxy
- ✅ Comprehensive error handling
- ✅ TypeScript support
