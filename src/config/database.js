const fs = require('fs');
const path = require('path');
const knex = require('knex');
const env = require('./env');

if (env.db.client === 'sqlite3') {
  fs.mkdirSync(path.dirname(env.db.filename), { recursive: true });
}

const config = env.db.client === 'sqlite3'
  ? {
      client: 'sqlite3',
      connection: { filename: env.db.filename },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn, done) => {
          conn.run('PRAGMA journal_mode = WAL;', (err) => {
            conn.run('PRAGMA foreign_keys = ON;', () => done(err, conn));
          });
        },
      },
    }
  : {
      client: 'mysql2',
      connection: {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.name,
      },
      pool: { min: 1, max: 6 },
    };

module.exports = knex(config);
