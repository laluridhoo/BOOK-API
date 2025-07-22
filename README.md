# 📚 Book API - MongoDB + JWT Auth

Sebuah RESTful API sederhana untuk mengelola koleksi buku, dengan dukungan autentikasi pengguna (JWT), pagination, filtering, sorting, dan manajemen akun.

---

## 🚀 Fitur Utama

### 📘 Book Management

- `GET /api/books`  
  Dapatkan daftar semua buku dengan opsi:

  - Pagination: `?page=1&limit=10`
  - Filtering: `?author=Nama` / `?genre=Fiksi`
  - Sorting: `?sortBy=title:asc` atau `?sortBy=createdAt:desc`

- `GET /api/books/:id`  
  Dapatkan detail buku berdasarkan ID

- `POST /api/books`  
  Tambah buku baru (wajib login)

- `PUT /api/books/:id`  
  Update data buku milik user (wajib login & pemilik)

- `DELETE /api/books/:id`  
  Hapus buku milik user (wajib login & pemilik)

- `GET /api/my-books`  
  Ambil semua buku yang dibuat oleh user login

---

### 👤 User Authentication & Management

- `POST /api/users/register`  
  Daftar akun baru (`name`, `email`, `password`)

- `POST /api/users/login`  
  Login dan dapatkan token JWT

- `POST /api/users/logout`  
  Logout user (hanya untuk notifikasi; token tetap dikelola client)

- `GET /api/users/profile`  
  Dapatkan data user yang sedang login

- `PUT /api/users/profile`  
  Perbarui `name` atau `email`

- `PUT /api/users/password`  
  Ganti password (wajib login dan password lama benar)

- `DELETE /api/users`  
  Hapus akun dan semua buku milik user

- `POST /api/users/forgot-password`
  Kirim email berisi link reset password ke pengguna yang terdaftar.

- `POST /api/users/reset-password/:token`
  Setel ulang password menggunakan token yang dikirim ke email.

---

## 🧪 Testing Endpoint (Postman Collection)

> Belum tersedia. Akan segera ditambahkan.

---

## 🛠 Teknologi yang Digunakan

- Node.js & Express
- MongoDB & Mongoose
- JSON Web Token (JWT)
- BcryptJS (Hashing password)
- dotenv (Konfigurasi variabel environment)
- Validator (optional untuk validasi email/password)

---

## 🔐 Authorization

Gunakan token JWT untuk semua endpoint yang dilindungi.

**Header format:**

```http
Authorization: Bearer <your_token_here>
```
