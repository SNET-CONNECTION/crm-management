const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../config/database');

async function page(req, res) {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const productId = req.query.product_id;
  const categoryId = req.query.category_id;

  let salesQuery = db('invoice_items as ii')
    .join('invoices as i', 'ii.invoice_id', 'i.id')
    .join('products as p', 'ii.product_id', 'p.id')
    .leftJoin('categories as c', 'p.category_id', 'c.id')
    .whereRaw('date(i.created_at)=?', [date])
    .select('p.name as product', 'c.name as category', db.raw('SUM(ii.subtotal) as total'))
    .groupBy('p.name', 'c.name');

  if (productId) salesQuery = salesQuery.where('p.id', productId);
  if (categoryId) salesQuery = salesQuery.where('c.id', categoryId);

  const [sales, productions, salaries, debts] = await Promise.all([
    salesQuery,
    db('production_entries').whereRaw('date(produced_at)=?', [date]),
    db('production_entries').whereRaw('date(produced_at)=?', [date]).sum('salary_net as total').first(),
    db('employees').sum('debt_balance as total').first(),
  ]);

  const income = sales.reduce((a, b) => a + Number(b.total || 0), 0);
  const salaryCost = Number(salaries.total || 0);
  const profitLoss = income - salaryCost;

  const products = await db('products').select('id', 'name').orderBy('name');
  const categories = await db('categories').select('id', 'name').orderBy('name');

  res.render('reports/index', { user: req.session.user, date, sales, productions, salaryCost, debts: debts.total || 0, profitLoss, products, categories });
}

async function exportExcel(req, res) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Laporan');
  const rows = await db('invoices').select('invoice_no', 'type', 'total_amount', 'paid_amount', 'status', 'created_at').orderBy('created_at', 'desc');
  ws.columns = [
    { header: 'Nota', key: 'invoice_no' },
    { header: 'Tipe', key: 'type' },
    { header: 'Total', key: 'total_amount' },
    { header: 'Bayar', key: 'paid_amount' },
    { header: 'Status', key: 'status' },
    { header: 'Tanggal', key: 'created_at' },
  ];
  ws.addRows(rows);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="laporan.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
}

async function exportPdf(req, res) {
  const rows = await db('invoices').select('invoice_no', 'type', 'total_amount', 'paid_amount', 'status').orderBy('created_at', 'desc');
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="laporan.pdf"');
  doc.pipe(res);
  doc.fontSize(14).text('Laporan Inventory', { underline: true });
  doc.moveDown();
  rows.forEach((row) => {
    doc.fontSize(10).text(`${row.invoice_no} | ${row.type} | total ${row.total_amount} | bayar ${row.paid_amount} | ${row.status}`);
  });
  doc.end();
}

module.exports = { page, exportExcel, exportPdf };
