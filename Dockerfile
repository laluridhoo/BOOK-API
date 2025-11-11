# 1. Gunakan base image resmi Node.js
FROM node:18-alpine

# 2. Set direktori kerja di dalam container
WORKDIR /RakBukuKu-Backend-Api

# 3. Salin file package.json dan package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Salin sisa kode aplikasi Anda ke dalam container
COPY . .

# 6. (PENTING) Beri tahu Cloud Run port mana yang didengarkan aplikasi Anda
# Aplikasi Anda HARUS mendengarkan port yang disediakan oleh variabel $PORT
ENV PORT 3000

# 7. Perintah untuk menjalankan aplikasi Anda
CMD [ "npm", "run", "start" ]