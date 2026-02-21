const fs = require('fs');
const path = require('path');
const env = require('../src/config/env');

const source = process.argv[2];
if (!source) {
  console.error('Pakai: npm run restore -- ./backups/file.sqlite3');
  process.exit(1);
}

const restorePath = path.resolve(source);
if (!fs.existsSync(restorePath)) {
  console.error('File backup tidak ditemukan');
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const merged = `${env.db.filename}.${stamp}.restored`;
fs.copyFileSync(restorePath, merged);
console.log(`Restore aman selesai. Database existing tetap ada. File hasil restore: ${merged}`);
