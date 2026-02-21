CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','kasir','produksi','owner') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name VARCHAR(150) NOT NULL,
  sale_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  production_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_finished DECIMAL(12,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  customer_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_no VARCHAR(100) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  type ENUM('cash','debt') NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date DATE,
  status ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  product_id INT NOT NULL,
  qty DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS installments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  ratio_owner INT NOT NULL DEFAULT 4,
  ratio_employee INT NOT NULL DEFAULT 1,
  debt_balance DECIMAL(12,2) NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS production_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  product_id INT NOT NULL,
  qty_pattern VARCHAR(255) NOT NULL,
  total_pcs INT NOT NULL,
  salary_gross DECIMAL(12,2) NOT NULL,
  debt_deduction DECIMAL(12,2) NOT NULL DEFAULT 0,
  salary_net DECIMAL(12,2) NOT NULL,
  produced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS employee_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  type ENUM('cash_advance','goods_advance','debt_payment') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
CREATE TABLE IF NOT EXISTS raw_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL UNIQUE,
  stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL DEFAULT 'pcs'
);
CREATE TABLE IF NOT EXISTS product_recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  raw_material_id INT NOT NULL,
  usage_per_pcs DECIMAL(12,4) NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);
