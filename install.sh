#!/bin/bash

echo "===================================================="
echo "  INSTALLASI AUTOMATIS NATURAL TRANSLATOR TERMUX"
echo "===================================================="

# Cek Node.js & npm
if ! command -v node &> /dev/null; then
    echo "[!] Node.js belum terpasang. Menginstal nodejs-lts..."
    pkg update -y && pkg install nodejs-lts git nano -y
else
    echo "[✔] Node.js sudah terpasang: $(node -v)"
fi

# Cek struktur project
if [ ! -f "package.json" ]; then
    echo "[!] package.json tidak ditemukan!"
    exit 1
fi

echo "[*] Menginstal dependencies..."
npm install

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "[✔] File .env berhasil dibuat dari .env.example"
    echo "[!] Harap isi DATABASE_URL Neon PostgreSQL kamu di dalam file .env"
fi

echo "===================================================="
echo "  INSTALLASI SELESAI!"
echo "  Jalankan perintah berikut untuk mulai development:"
echo "  npm run dev"
echo "===================================================="
