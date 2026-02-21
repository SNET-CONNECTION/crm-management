const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function page(req, res) {
  const users = await db('users').select('id', 'username', 'role', 'created_at').orderBy('id', 'desc');
  res.render('users/index', { user: req.session.user, users });
}

async function create(req, res) {
  const hash = await bcrypt.hash(req.body.password, 10);
  await db('users').insert({ username: req.body.username, password_hash: hash, role: req.body.role });
  res.redirect('/users');
}

module.exports = { page, create };
