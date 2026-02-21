const db = require('../src/config/database');

(async () => {
  try {
    await db.raw('SELECT 1');
    console.log('DB connection ok');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
