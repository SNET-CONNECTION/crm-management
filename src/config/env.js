const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  env: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT || 3000),
  sessionSecret: process.env.SESSION_SECRET || 'please-change-this',
  sessionMaxAgeHours: Number(process.env.SESSION_MAX_AGE_HOURS || 24),
  backupCron: process.env.BACKUP_CRON || '0 2 * * *',
  backupDir: path.resolve(process.env.BACKUP_DIR || './backups'),
  db: {
    client: process.env.DB_CLIENT || (isProduction ? 'mysql2' : 'sqlite3'),
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'inventory_db',
    filename: path.resolve(process.env.DB_FILENAME || './data/inventory.sqlite3'),
  },
};
