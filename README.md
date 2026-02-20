# Inventory App (Express + EJS)

Aplikasi inventory ringan untuk perangkat terbatas (contoh STB B860H RAM 1GB) dengan:
- **SQLite** untuk development
- **MySQL** untuk production
- Session login **24 jam**
- Backup otomatis harian + restore manual aman

---

## 1) Fitur Utama

- Inventory: kategori, produk, pelanggan, nota kontan/hutang, cicilan, jatuh tempo, status lunas/belum lunas.
- Kelebihan pembayaran otomatis jadi saldo pelanggan.
- Produksi & gaji: rasio bagi hasil per karyawan, input pola `150|300|420`, potong hutang otomatis.
- Bahan baku: stok terpisah dari barang jadi, resep produksi, notifikasi stok menipis.
- Laporan harian: penjualan, produksi, gaji, hutang, laba-rugi + export Excel/PDF.
- User management role: `admin`, `kasir`, `produksi`, `owner`.

---

## 2) Struktur Folder

```text
src/
  app.js
  server.js
  config/
    env.js
    database.js
  controllers/
  middleware/
  models/
  routes/
  services/
  views/
public/js/
sql/
  001_init.sqlite.sql
  001_init_mysql.sql
scripts/
  runMigrations.js
  seed.js
  backup.js
  restore.js
  smokeTest.js
.env.example
```

---

## 3) Persiapan Sebelum Instalasi

### Kebutuhan minimum
- Node.js **18+**
- npm
- Untuk production: MySQL Server

### Penting: Keamanan data existing
Jika Anda sudah punya data lama:
1. **Wajib backup dulu** sebelum menjalankan migration/update.
2. Jangan hapus file database lama.
3. Migration di proyek ini menggunakan `CREATE TABLE IF NOT EXISTS`, jadi aman untuk tabel yang sudah ada.

---

## 4) Instalasi Cepat (Development - SQLite)

> Cocok untuk uji coba lokal / development.

### Langkah 1 — Clone dan masuk folder project
```bash
git clone <repo-url>
cd scinesia
```

### Langkah 2 — Buat file environment
```bash
cp .env.example .env
```

Lalu cek nilai penting di `.env`:
```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=ganti_dengan_secret_aman
SESSION_MAX_AGE_HOURS=24
DB_CLIENT=sqlite3
DB_FILENAME=./data/inventory.sqlite3
BACKUP_CRON=0 2 * * *
BACKUP_DIR=./backups
```

### Langkah 3 — Install dependency
```bash
npm install
```

### Langkah 4 — Jalankan migration
```bash
npm run migrate
```

### Langkah 5 — Buat user awal (seed)
```bash
npm run seed
```
Default login:
- username: `admin`
- password: `admin123`

### Langkah 6 — Jalankan aplikasi
```bash
npm run dev
```
Akses:
- `http://localhost:3000`

---

## 5) Instalasi Production (MySQL)

### Langkah 1 — Siapkan database MySQL
Buat database kosong, contoh:
```sql
CREATE DATABASE inventory_db;
```

### Langkah 2 — Atur `.env`
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=ganti_dengan_secret_aman
SESSION_MAX_AGE_HOURS=24

DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secret
DB_NAME=inventory_db

BACKUP_CRON=0 2 * * *
BACKUP_DIR=./backups
```

### Langkah 3 — Install dependency production
```bash
npm ci --omit=dev
```

### Langkah 4 — Migration + seed
```bash
npm run migrate
npm run seed
```

### Langkah 5 — Jalankan service
```bash
npm run start
```

Disarankan pakai process manager (PM2/systemd) agar auto-restart saat crash/reboot.

---

## 6) Prosedur Update TANPA Menghilangkan Data

Saat update aplikasi, lakukan urutan ini:

1. **Backup dulu**
   ```bash
   npm run backup
   ```
2. Jalankan migration update
   ```bash
   npm run migrate
   ```
3. Jalankan pengecekan
   ```bash
   npm run test
   ```
4. Restart service

### Catatan penting agar data aman
- Jangan gunakan `DROP TABLE` untuk update.
- Jangan hapus kolom existing.
- Jika tambah kolom baru, beri default value.
- Pastikan relasi foreign key tidak diubah sembarangan.

Contoh migration aman:
```sql
ALTER TABLE customers ADD COLUMN address TEXT NOT NULL DEFAULT '';
```

---

## 7) Cara Rollback Jika Error

Rollback aman (tanpa menimpa file DB aktif secara langsung):

```bash
npm run restore -- ./backups/backup-xxx.sqlite3
```

Script restore membuat file hasil restore baru (`*.restored`), sehingga data aktif tidak langsung tertimpa.

---

## 8) Backup & Restore

### Backup manual
```bash
npm run backup
```

### Backup otomatis
Backup otomatis berjalan berdasarkan `BACKUP_CRON` saat server aktif.

### Restore manual
```bash
npm run restore -- <path_file_backup>
```

---

## 9) Build & Operasional Ringan (RAM 1GB)

- Gunakan SQLite WAL saat development.
- Batasi query list (sudah ada `limit` di beberapa endpoint).
- Pool MySQL kecil (`max: 6`).
- Session disimpan di database, bukan memory process.
- Frontend sederhana: EJS + Bootstrap + vanilla JS.

---

## 10) Troubleshooting Singkat

### `npm install` gagal karena akses registry
- Cek koneksi internet/server policy internal.
- Cek konfigurasi proxy npm.

### Tidak bisa login
- Pastikan sudah `npm run seed`.
- Cek tabel `users` terisi.

### Migration gagal
- Cek konfigurasi `.env` DB.
- Cek hak akses user DB.
- Jalankan backup sebelum mencoba ulang.

---

## 11) Ringkasan Perintah Harian

```bash
npm run migrate   # buat/update struktur tabel
npm run seed      # isi user awal
npm run dev       # jalankan mode development
npm run start     # jalankan mode production
npm run backup    # backup database
npm run restore -- ./backups/<file>
npm run test      # smoke test koneksi DB
```
