# Environment Setup Guide

This guide explains how to set up environment variables for the Beyuvana project in both development and production environments.

## Environment Variables

The application uses the following environment variables:

### Required Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for your API (default: `https://beyuvana.com/api`)
- `NEXT_PUBLIC_PROXY_URL`: The proxy URL for browser requests (default: `/api/proxy`)

### Optional Variables

- `NODE_ENV`: Environment mode (`development`, `production`, `test`)

## Development Setup

### 1. Create Environment File

Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Environment File Content

Create `.env.local` with the following content:

```env
# Development Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://beyuvana.com/api
NEXT_PUBLIC_PROXY_URL=/api/proxy
NODE_ENV=development
```

### 3. Restart Development Server

After creating the environment file, restart your development server:

```bash
npm run dev
```

## Production Deployment

### Vercel Deployment

1. **Via Vercel Dashboard:**

   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_API_BASE_URL`: `https://beyuvana.com/api`
     - `NEXT_PUBLIC_PROXY_URL`: `/api/proxy`

2. **Via Vercel CLI:**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL
   vercel env add NEXT_PUBLIC_PROXY_URL
   ```

### Other Platforms

#### Netlify

- Go to Site Settings → Environment Variables
- Add the required variables

#### AWS Amplify

- Go to App Settings → Environment Variables
- Add the required variables

#### Docker

Create a `.env.production` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://beyuvana.com/api
NEXT_PUBLIC_PROXY_URL=/api/proxy
NODE_ENV=production
```

## Environment File Template

Create `.env.example` in your project root:

```env
# Environment Variables Template
# Copy this file to .env.local for development

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://beyuvana.com/api
NEXT_PUBLIC_PROXY_URL=/api/proxy

# Environment
NODE_ENV=development

# Optional: Add any other environment-specific variables here
# NEXT_PUBLIC_APP_VERSION=1.0.0
# NEXT_PUBLIC_DEBUG_MODE=true
```

## Features Implemented

### 1. Environment-Based Configuration

- API URLs are configurable via environment variables
- Fallback values ensure the app works without environment setup

### 2. Environment-Based Logging

- Detailed logging in development mode
- Minimal logging in production for better performance

### 3. Request Timeout Handling

- 15-second timeout for all API requests
- Proper error handling for timeout scenarios

### 4. Production Optimizations

- Reduced console logging in production
- Optimized error handling
- Better performance monitoring

## Troubleshooting

### Common Issues

1. **API calls failing in production:**

   - Check that environment variables are set correctly
   - Verify the API base URL is accessible from your deployment platform

2. **CORS errors:**

   - The proxy setup should handle CORS automatically
   - Ensure the proxy URL is correctly configured

3. **Timeout errors:**
   - Check network connectivity
   - Verify API server is responding within 15 seconds

### Debug Mode

To enable debug logging in production (temporarily), set:

```env
NODE_ENV=development
```

**Note:** Only use this for debugging and revert to `production` afterward.

## Security Notes

- Never commit `.env.local` or `.env.production` files to version control
- Use environment variables for sensitive configuration
- The `.env.example` file is safe to commit as it contains no sensitive data
