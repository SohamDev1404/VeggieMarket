const { execSync } = require('child_process');
const fs = require('fs');

// This script handles automatic database migrations and seeding during Vercel deployment
console.log('Running Vercel deployment configuration...');

try {
  // Make sure Prisma client is generated
  console.log('Generating Prisma client for production...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Only run migrations in production environment to avoid conflicts
  if (process.env.NODE_ENV === 'production') {
    console.log('Running database migrations for production...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Check if database should be seeded (via environment variable)
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Seeding production database...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
    }
  }
  
  console.log('Vercel deployment configuration completed successfully.');
} catch (error) {
  console.error('Error in Vercel deployment configuration:', error);
  process.exit(1);
}