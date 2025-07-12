import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting custom build process...');

// Set environment variables to handle sharp
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';

// Try to install sharp for the correct platform
console.log('Installing sharp for Linux x64...');
try {
  execSync('npm install --platform=linux --arch=x64 sharp', { 
    stdio: 'inherit',
    env: { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
  });
} catch (error) {
  console.log('Failed to install sharp for Linux x64, trying alternative...');
  try {
    execSync('npm install --include=optional sharp', { 
      stdio: 'inherit',
      env: { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
    });
  } catch (error2) {
    console.log('Sharp installation failed, continuing without it...');
  }
}

// Patch PayloadCMS UI to avoid sharp dependency
console.log('Patching PayloadCMS UI to avoid sharp dependency...');
const payloadUIPath = path.join(__dirname, 'node_modules', '@payloadcms', 'ui', 'dist', 'assets', 'index.js');
if (fs.existsSync(payloadUIPath)) {
  try {
    let content = fs.readFileSync(payloadUIPath, 'utf8');
    // Replace sharp-dependent image imports with empty objects
    content = content.replace(/require\(['"]sharp['"]\)/g, 'null');
    content = content.replace(/import.*sharp.*from.*['"]sharp['"]/g, 'const sharp = null');
    fs.writeFileSync(payloadUIPath, content);
    console.log('PayloadCMS UI patched successfully');
  } catch (error) {
    console.log('Failed to patch PayloadCMS UI:', error.message);
  }
}

// Run the actual build
console.log('Running Next.js build...');
execSync('next build', { 
  stdio: 'inherit',
  env: { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' }
});

console.log('Build completed successfully!'); 