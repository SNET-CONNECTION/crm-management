const cron = require('node-cron');
const { execFile } = require('child_process');
const path = require('path');
const env = require('../config/env');

function startBackupScheduler() {
  cron.schedule(env.backupCron, () => {
    execFile('node', [path.resolve(__dirname, '../../scripts/backup.js')], (error) => {
      if (error) {
        console.error('Backup otomatis gagal:', error.message);
      }
    });
  });
}

module.exports = { startBackupScheduler };
