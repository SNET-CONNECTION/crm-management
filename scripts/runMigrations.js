const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');
const env = require('../src/config/env');

(async () => {
  try {
    const sqlFile = env.db.client === 'mysql2' ? '001_init_mysql.sql' : '001_init.sqlite.sql';
    const sqlPath = path.resolve(__dirname, `../sql/${sqlFile}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const statements = sql.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await db.raw(stmt);
    }
    console.log(`Migration selesai (${sqlFile}).`);
    process.exit(0);
  } catch (error) {
    console.error('Migration gagal:', error);
    process.exit(1);
  }
})();
