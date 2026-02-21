const fs = require('fs');
const path = require('path');
const env = require('../src/config/env');

(async () => {
  fs.mkdirSync(env.backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(env.backupDir, `backup-${stamp}.sqlite3`);
  fs.copyFileSync(env.db.filename, target);
  console.log(`Backup sukses: ${target}`);
})();
