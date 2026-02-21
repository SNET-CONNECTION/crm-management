const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  const [exists] = await db('users').where({ username: 'admin' }).select('id');
  if (!exists) {
    await db('users').insert({ username: 'admin', password_hash: hash, role: 'admin' });
  }
  console.log('Seed selesai. user admin/admin123 tersedia.');
  process.exit(0);
})();
