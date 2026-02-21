const db = require('../config/database');

async function listEmployees() {
  return db('employees').select('*').orderBy('name');
}

async function createEmployee(payload) {
  return db('employees').insert(payload);
}

async function recordProduction(payload) {
  return db.transaction(async (trx) => {
    const [id] = await trx('production_entries').insert(payload);
    await trx('products').where({ id: payload.product_id }).increment('stock_finished', payload.total_pcs);
    if (payload.debt_deduction > 0) {
      await trx('employees').where({ id: payload.employee_id }).decrement('debt_balance', payload.debt_deduction);
    }
    return id;
  });
}

module.exports = { listEmployees, createEmployee, recordProduction };
