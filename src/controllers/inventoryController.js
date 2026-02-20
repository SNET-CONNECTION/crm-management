const db = require('../config/database');
const inventoryModel = require('../models/inventoryModel');
const invoiceModel = require('../models/invoiceModel');

async function page(req, res) {
  const [categories, products, customers, invoices] = await Promise.all([
    inventoryModel.listCategories(),
    inventoryModel.listProducts(),
    inventoryModel.listCustomers(),
    db('invoices').orderBy('created_at', 'desc').limit(20),
  ]);

  res.render('inventory/index', { user: req.session.user, categories, products, customers, invoices });
}

async function createCategory(req, res) {
  await inventoryModel.createCategory(req.body.name);
  res.redirect('/inventory');
}

async function createProduct(req, res) {
  await inventoryModel.createProduct(req.body);
  res.redirect('/inventory');
}

async function createCustomer(req, res) {
  await inventoryModel.createCustomer(req.body);
  res.redirect('/inventory');
}

async function createInvoice(req, res) {
  const type = req.body.type;
  const qty = Number(req.body.qty);
  const unitPrice = Number(req.body.unit_price);
  const total = qty * unitPrice;
  const invoiceNo = `INV-${Date.now()}`;
  const paid = type === 'cash' ? total : Number(req.body.paid_amount || 0);

  const invoice = {
    invoice_no: invoiceNo,
    customer_id: Number(req.body.customer_id),
    type,
    total_amount: total,
    paid_amount: paid,
    due_date: type === 'debt' ? req.body.due_date : null,
    status: paid >= total ? 'paid' : 'unpaid',
  };

  await invoiceModel.createInvoiceWithItems(invoice, [{
    product_id: Number(req.body.product_id), qty, unit_price: unitPrice, subtotal: total,
  }]);

  res.redirect('/inventory');
}

async function payInstallment(req, res) {
  await invoiceModel.payInstallment(Number(req.body.invoice_id), Number(req.body.amount), req.body.note);
  res.redirect('/inventory');
}

module.exports = { page, createCategory, createProduct, createCustomer, createInvoice, payInstallment };
