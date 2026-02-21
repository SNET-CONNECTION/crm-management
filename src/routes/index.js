const express = require('express');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const inventoryController = require('../controllers/inventoryController');
const productionController = require('../controllers/productionController');
const reportController = require('../controllers/reportController');
const materialController = require('../controllers/materialController');
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/', requireAuth, (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', requireAuth, dashboardController.page);

router.get('/inventory', requireAuth, inventoryController.page);
router.post('/inventory/categories', requireAuth, inventoryController.createCategory);
router.post('/inventory/products', requireAuth, inventoryController.createProduct);
router.post('/inventory/customers', requireAuth, inventoryController.createCustomer);
router.post('/inventory/invoices', requireAuth, inventoryController.createInvoice);
router.post('/inventory/installments', requireAuth, inventoryController.payInstallment);

router.get('/production', requireAuth, requireRole('admin', 'owner', 'produksi'), productionController.page);
router.post('/production/employees', requireAuth, requireRole('admin', 'owner'), productionController.createEmployee);
router.post('/production/entries', requireAuth, requireRole('admin', 'owner', 'produksi'), productionController.recordProduction);
router.post('/production/transactions', requireAuth, requireRole('admin', 'owner'), productionController.employeeTransaction);

router.get('/reports', requireAuth, requireRole('admin', 'owner', 'kasir'), reportController.page);
router.get('/reports/export/excel', requireAuth, reportController.exportExcel);
router.get('/reports/export/pdf', requireAuth, reportController.exportPdf);

router.get('/materials', requireAuth, materialController.page);
router.post('/materials', requireAuth, materialController.createMaterial);
router.post('/materials/recipes', requireAuth, materialController.createRecipe);

router.get('/users', requireAuth, requireRole('owner', 'admin'), userController.page);
router.post('/users', requireAuth, requireRole('owner', 'admin'), userController.create);

module.exports = router;
