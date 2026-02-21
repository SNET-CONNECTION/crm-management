const db = require('../config/database');

async function createInvoiceWithItems(invoice, items) {
  return db.transaction(async (trx) => {
    const [invoiceId] = await trx('invoices').insert(invoice);
    for (const item of items) {
      await trx('invoice_items').insert({ ...item, invoice_id: invoiceId });
      await trx('products').where({ id: item.product_id }).decrement('stock_finished', item.qty);
    }
    return invoiceId;
  });
}

async function payInstallment(invoiceId, amount, note = '') {
  return db.transaction(async (trx) => {
    await trx('installments').insert({ invoice_id: invoiceId, amount, note });
    const invoice = await trx('invoices').where({ id: invoiceId }).first();
    const paidAmount = Number(invoice.paid_amount) + Number(amount);
    const status = paidAmount >= Number(invoice.total_amount) ? 'paid' : 'unpaid';

    await trx('invoices').where({ id: invoiceId }).update({ paid_amount: paidAmount, status });
    const overpay = paidAmount - Number(invoice.total_amount);
    if (overpay > 0) {
      await trx('customers').where({ id: invoice.customer_id }).increment('customer_balance', overpay);
    }
  });
}

module.exports = { createInvoiceWithItems, payInstallment };
