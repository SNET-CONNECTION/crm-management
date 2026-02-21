const db = require('../config/database');

async function listCategories() {
  return db('categories').select('*').orderBy('name');
}

async function createCategory(name) {
  return db('categories').insert({ name });
}

async function listProducts() {
  return db('products as p')
    .leftJoin('categories as c', 'p.category_id', 'c.id')
    .select('p.*', 'c.name as category_name')
    .orderBy('p.name');
}

async function createProduct(payload) {
  return db('products').insert(payload);
}

async function listCustomers() {
  return db('customers').select('*').orderBy('name');
}

async function createCustomer(payload) {
  return db('customers').insert(payload);
}

module.exports = {
  listCategories,
  createCategory,
  listProducts,
  createProduct,
  listCustomers,
  createCustomer,
};
