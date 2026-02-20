const app = require('./app');
const env = require('./config/env');
const { startBackupScheduler } = require('./services/backupService');

app.listen(env.port, () => {
  console.log(`Inventory app berjalan di http://localhost:${env.port}`);
});

startBackupScheduler();
