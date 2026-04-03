const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#f59e0b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Book icon
  ctx.fillStyle = 'white';
  const bookWidth = size * 0.5;
  const bookHeight = size * 0.6;
  const bookX = (size - bookWidth) / 2;
  const bookY = (size - bookHeight) / 2;
  
  // Book pages
  ctx.fillRect(bookX, bookY, bookWidth, bookHeight);
  
  // Book spine
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(bookX, bookY, bookWidth * 0.15, bookHeight);
  
  // Book lines
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = size * 0.01;
  for (let i = 1; i <= 4; i++) {
    const y = bookY + (bookHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(bookX + bookWidth * 0.25, y);
    ctx.lineTo(bookX + bookWidth * 0.85, y);
    ctx.stroke();
  }
  
  // Checkmark
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const checkSize = size * 0.15;
  const checkX = bookX + bookWidth * 0.7;
  const checkY = bookY + bookHeight * 0.3;
  
  ctx.beginPath();
  ctx.moveTo(checkX, checkY);
  ctx.lineTo(checkX + checkSize * 0.3, checkY + checkSize * 0.3);
  ctx.lineTo(checkX + checkSize, checkY - checkSize * 0.3);
  ctx.stroke();
  
  return canvas;
}

// Create icons
const icon192 = createIcon(192);
const icon512 = createIcon(512);

// Save to files
const buffer192 = icon192.toBuffer('image/png');
const buffer512 = icon512.toBuffer('image/png');

fs.writeFileSync('public/icon-192.png', buffer192);
fs.writeFileSync('public/icon-512.png', buffer512);

console.log('Icons created successfully!');
