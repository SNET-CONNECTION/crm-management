const path = require('path');
const express = require('express');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');
const db = require('./config/database');
const env = require('./config/env');
const routes = require('./routes');

const app = express();
const KnexSessionStore = connectSessionKnex(session);

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.resolve(__dirname, '../public')));

app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: env.sessionMaxAgeHours * 60 * 60 * 1000,
    httpOnly: true,
  },
  store: new KnexSessionStore({ knex: db, tablename: 'sessions', createtable: true, clearInterval: 3600000 }),
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use(routes);

module.exports = app;
