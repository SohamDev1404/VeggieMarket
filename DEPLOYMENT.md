# Deploying Harvest Hub to Vercel

This document provides step-by-step instructions for deploying Harvest Hub to Vercel.

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A PostgreSQL database (we recommend using Neon.tech for serverless PostgreSQL)
3. Git repository with your complete Harvest Hub codebase

## Step 1: Set Up Your Database

1. Create a PostgreSQL database instance on Neon.tech or any other PostgreSQL provider
2. Copy your database connection string which should look like: `postgresql://user:password@host:5432/dbname`

## Step 2: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Log in to your Vercel dashboard
2. Click "New Project"
3. Import your Git repository containing Harvest Hub
4. Configure the project with the following settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string for session encryption
   - `NEXTAUTH_URL`: Your Vercel deployment URL (will be automatically set by Vercel)
   - `SEED_DATABASE`: Set to `true` for initial deployment, then change to `false`
   - `NODE_ENV`: `production`

6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel from your terminal:
   ```
   vercel login
   ```

3. Navigate to your project directory and run:
   ```
   vercel
   ```

4. Follow the prompts to configure your project

## Step 3: Verify Deployment

1. Once deployment is complete, Vercel will provide you with a deployment URL
2. Visit your deployed application to verify it's working correctly
3. Test all functionality including:
   - User registration and login
   - Product browsing and filtering
   - Adding items to cart
   - Checkout process
   - Order tracking

## Step 4: Set Up Custom Domain (Optional)

1. In your Vercel project settings, navigate to "Domains"
2. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting

If you encounter issues during deployment:

1. **Database Connection Issues**: Verify your DATABASE_URL is correct and the database is accessible from Vercel
2. **Build Failures**: Check Vercel deployment logs for specific error messages
3. **Missing Environment Variables**: Ensure all required environment variables are configured

## Maintenance

For ongoing maintenance:

1. Set `SEED_DATABASE` to `false` after initial deployment
2. Use Vercel's preview deployments feature for testing changes before production
3. Set up monitoring for your application and database