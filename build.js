const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all static files into dist directory
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'bhu-building.webp'), path.join(distDir, 'bhu-building.webp'));

if (fs.existsSync(path.join(__dirname, '.nojekyll'))) {
  fs.copyFileSync(path.join(__dirname, '.nojekyll'), path.join(distDir, '.nojekyll'));
}

fs.cpSync(path.join(__dirname, 'css'), path.join(distDir, 'css'), { recursive: true });
fs.cpSync(path.join(__dirname, 'js'), path.join(distDir, 'js'), { recursive: true });

console.log('✓ Successfully compiled static bundle into dist/');
