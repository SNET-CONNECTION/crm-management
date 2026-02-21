const db = require('../config/database');
const productionModel = require('../models/productionModel');
const { normalizePattern, calculateTotalPcs, calculateSalary } = require('../services/payrollService');

async function page(req, res) {
  const [employees, products, entries] = await Promise.all([
    productionModel.listEmployees(),
    db('products').select('*').orderBy('name'),
    db('production_entries').orderBy('produced_at', 'desc').limit(20),
  ]);
  res.render('production/index', { user: req.session.user, employees, products, entries });
}

async function createEmployee(req, res) {
  await productionModel.createEmployee(req.body);
  res.redirect('/production');
}

async function recordProduction(req, res) {
  const employee = await db('employees').where({ id: Number(req.body.employee_id) }).first();
  const product = await db('products').where({ id: Number(req.body.product_id) }).first();
  const qtyPattern = normalizePattern(req.body.qty_pattern);
  const totalPcs = calculateTotalPcs(qtyPattern);
  const salaryGross = calculateSalary({
    totalPcs,
    productPrice: Number(product.production_price),
    ownerRatio: Number(employee.ratio_owner),
    employeeRatio: Number(employee.ratio_employee),
  });

  const debtDeduction = Math.min(Number(employee.debt_balance), salaryGross);
  const salaryNet = salaryGross - debtDeduction;

  await productionModel.recordProduction({
    employee_id: employee.id,
    product_id: product.id,
    qty_pattern: qtyPattern,
    total_pcs: totalPcs,
    salary_gross: salaryGross,
    debt_deduction: debtDeduction,
    salary_net: salaryNet,
  });

  res.redirect('/production');
}

async function employeeTransaction(req, res) {
  const { employee_id, type, amount, note } = req.body;
  await db('employee_transactions').insert({ employee_id, type, amount, note });
  if (type === 'cash_advance' || type === 'goods_advance') {
    await db('employees').where({ id: employee_id }).increment('debt_balance', amount);
  }
  if (type === 'debt_payment') {
    await db('employees').where({ id: employee_id }).decrement('debt_balance', amount);
  }
  res.redirect('/production');
}

module.exports = { page, createEmployee, recordProduction, employeeTransaction };
