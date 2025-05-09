const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Set the port for Next.js
process.env.PORT = 5000;

console.log('Setting up the database and application...');
console.log('Current directory:', process.cwd());
console.log('Files in pages directory:');
try {
  const files = fs.readdirSync('./pages');
  console.log(files);
} catch (err) {
  console.error('Error listing pages directory:', err);
}

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push the database schema
  console.log('Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed the database
  console.log('Seeding the database...');
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  
  console.log('Database setup complete. Starting Next.js app...');
  
  // Start Next.js with the spawn method to better handle errors
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], { 
    stdio: 'inherit',
    env: { ...process.env } 
  });
  
  nextProcess.on('error', (err) => {
    console.error('Failed to start Next.js process:', err);
    process.exit(1);
  });
  
  nextProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Next.js process exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('Stopping Next.js server...');
    nextProcess.kill('SIGINT');
  });
  
} catch (error) {
  console.error('Error setting up the application:', error);
  process.exit(1);
}