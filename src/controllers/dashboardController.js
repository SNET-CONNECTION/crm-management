const db = require('../config/database');

async function page(req, res) {
  const [products, customers, invoices, unpaid, employees, lowMaterials] = await Promise.all([
    db('products').count('* as total').first(),
    db('customers').count('* as total').first(),
    db('invoices').count('* as total').first(),
    db('invoices').where({ status: 'unpaid' }).count('* as total').first(),
    db('employees').count('* as total').first(),
    db('raw_materials').whereRaw('stock <= min_stock').count('* as total').first(),
  ]);
  res.render('dashboard/index', {
    user: req.session.user,
    stats: {
      products: products.total || 0,
      customers: customers.total || 0,
      invoices: invoices.total || 0,
      unpaid: unpaid.total || 0,
      employees: employees.total || 0,
      lowMaterials: lowMaterials.total || 0,
    },
  });
}

module.exports = { page };
