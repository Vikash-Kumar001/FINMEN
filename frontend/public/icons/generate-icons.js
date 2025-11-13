/**
 * PWA Icon Generator Script for Wise Student
 * 
 * This script generates PWA icons (192x192, 512x512, 180x180) from an SVG source.
 * 
 * Requirements:
 * - Node.js (v14+)
 * - sharp package (npm install sharp --save-dev)
 * 
 * Usage:
 *   node generate-icons.js
 * 
 * Note: This script requires the 'sharp' package. If you don't want to install it,
 * use the browser-based generator (generate-icons.html) instead.
 */

const fs = require('fs');
const path = require('path');

// Exact match to icon.svg - Your provided design
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e2d9f7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd89b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffb3ba;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="wGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7dd3fc;stop-opacity:0.95"/>
      <stop offset="30%" style="stop-color:#60a5fa;stop-opacity:0.95"/>
      <stop offset="70%" style="stop-color:#3b82f6;stop-opacity:0.95"/>
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.95"/>
    </linearGradient>
    <linearGradient id="sGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#84cc16;stop-opacity:0.95"/>
      <stop offset="25%" style="stop-color:#a3e635;stop-opacity:0.95"/>
      <stop offset="40%" style="stop-color:#ec4899;stop-opacity:0.95"/>
      <stop offset="60%" style="stop-color:#d946ef;stop-opacity:0.95"/>
      <stop offset="80%" style="stop-color:#c026d3;stop-opacity:0.95"/>
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0.95"/>
    </linearGradient>
    <filter id="ribbonShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feOffset in="coloredBlur" dx="2" dy="3" result="offsetBlur"/>
      <feComponentTransfer in="offsetBlur" result="darkenedBlur">
        <feFuncA type="discrete" tableValues="0.2 0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="darkenedBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGradient)"/>
  <g transform="translate(256, 256)">
    <path d="M -160,50 L -140,10 L -120,50 L -100,10 L -80,50 L -80,90 L -88,90 L -100,60 L -120,90 L -140,60 L -152,90 L -160,90 L -160,50 Z" 
          fill="url(#wGradient)" filter="url(#ribbonShadow)" opacity="0.92" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M 0,10 C 0,-10 22,-10 22,10 L 22,28 C 22,38 32,38 38,38 L 102,38 C 112,38 112,28 102,28 L 42,28 C 37,28 32,28 32,33 L 32,42 C 32,47 37,47 42,47 L 107,47 C 117,47 117,57 107,57 L 42,57 C 37,57 32,57 32,62 L 32,72 C 32,82 42,82 42,82 L 102,82 C 112,82 112,92 102,92 L 22,92 C 12,92 12,82 22,82 L 82,82 C 92,82 92,72 82,72 L 37,72 C 32,72 27,72 27,67 L 27,57 C 27,52 32,52 37,52 L 102,52 C 112,52 112,42 102,42 L 37,42 C 32,42 27,42 27,37 L 27,22 C 27,12 32,12 37,12 L 97,12 C 107,12 107,2 97,2 L 17,2 C 7,2 2,7 2,12 L 2,10 Z" 
          fill="url(#sGradient)" filter="url(#ribbonShadow)" opacity="0.92" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
</svg>`;

// Icon sizes to generate
const iconSizes = [
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' },
  { size: 180, filename: 'apple-touch-icon-180x180.png' }
];

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Error: sharp package is not installed.');
  console.log('\n📦 To install sharp, run:');
  console.log('   npm install sharp --save-dev');
  console.log('\n🌐 Alternatively, use the browser-based generator:');
  console.log('   Open generate-icons.html in your browser');
  process.exit(1);
}

// Generate icons
async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');
  
  const iconsDir = path.join(__dirname);
  
  try {
    for (const { size, filename } of iconSizes) {
      const outputPath = path.join(iconsDir, filename);
      
      console.log(`📐 Generating ${size}x${size}...`);
      
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: ${filename}\n`);
    }
    
    console.log('🎉 All icons generated successfully!');
    console.log('\n📁 Icons location:');
    console.log(`   ${iconsDir}`);
    console.log('\n✨ Your PWA is ready to use these icons!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateIcons();

