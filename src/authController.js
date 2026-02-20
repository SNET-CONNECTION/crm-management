const bcrypt = require('bcryptjs');
const db = require('../config/database');

function loginPage(req, res) {
  res.render('auth/login', { error: null });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await db('users').where({ username }).first();
  if (!user) return res.render('auth/login', { error: 'User tidak ditemukan.' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.render('auth/login', { error: 'Password salah.' });

  req.session.user = { id: user.id, username: user.username, role: user.role };
  return res.redirect('/dashboard');
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

module.exports = { loginPage, login, logout };
