// Vercel build entry point
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Starting Vercel build...');
  
  // Ensure the api directory exists
  if (!fs.existsSync('api')) {
    fs.mkdirSync('api', { recursive: true });
  }
  
  // Build the client
  console.log('Building client...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Build the server
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api', 
    { stdio: 'inherit' });
  
  // Create a simple api/index.js if it doesn't exist
  const apiIndexPath = path.join('api', 'index.js');
  if (!fs.existsSync(apiIndexPath)) {
    console.log('Creating API entry point...');
    fs.writeFileSync(apiIndexPath, `
      import express from 'express';
      import { join } from 'path';
      import fs from 'fs';
      
      const app = express();
      
      app.use(express.json());
      app.use(express.static('dist/public'));
      
      // API routes
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });
      
      // Fallback to SPA
      app.get('*', (req, res) => {
        res.sendFile(join(process.cwd(), 'dist/public/index.html'));
      });
      
      export default app;
    `);
  }
  
  console.log('Vercel build completed successfully!');
} catch (error) {
  console.error('Vercel build failed:', error);
  process.exit(1);
} 