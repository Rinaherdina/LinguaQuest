// server.js

// Import library Express dan path (untuk mengelola jalur file)
const express = require('express'); 
const path = require('path'); // Diperlukan untuk serving file statis

// Membuat instance aplikasi Express
const app = express(); 

// Mendefinisikan port
const PORT = 3000; 
const APP_NAME = "LinguaQuest Server"; 

// Middleware untuk mem-parsing body request (khususnya JSON)
app.use(express.json());

// =======================================================
// === 1. MIDDLEWARE UNTUK SERVING FILE STATIS (Frontend) ===
// =======================================================
// Mengizinkan Express menyajikan file-file dari direktori root ('')
// Ini melayani index.html, styles/, scripts/, assets/
app.use(express.static(path.join(__dirname, '')));

// =======================================================
// === 2. MOCK DATA (API) ===
// =======================================================
// Catatan: Data ini seharusnya untuk Bahasa Inggris (seperti di data.js), 
// tetapi kita pertahankan Spanyol sesuai request Anda sebagai contoh API.
const lessonsData = [
    {
        id: 1,
        title: "Perkenalan Dasar",
        language: "Spanyol",
        level: "A1",
        description: "Pelajari salam, perkenalan diri, dan frasa penting sehari-hari.",
        durationMinutes: 15
    },
    {
        id: 2,
        title: "Kata Benda & Kata Sifat",
        language: "Spanyol",
        level: "A1",
        description: "Memahami penggunaan kata benda umum dan cara mengubahnya dengan kata sifat.",
        durationMinutes: 20
    },
    {
        id: 3,
        title: "Waktu & Tanggal",
        language: "Spanyol",
        level: "A2",
        description: "Cara menyatakan waktu, tanggal, dan jadwal dalam bahasa Spanyol.",
        durationMinutes: 10
    }
];


// =======================================================
// === 3. ROUTES (Endpoints API & Frontend) ===
// =======================================================

// ROUTE 1: Halaman utama (GET /)
// Mengganti teks send() dengan mengirim file index.html
app.get('/', (req, res) => {
    // Kirim file index.html sebagai halaman utama aplikasi
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ROUTE 2: Status kesehatan server (GET /api/status)
app.get('/api/status', (req, res) => {
    res.status(200).json({ 
        status: 'berhasil',
        aplikasi: APP_NAME,
        versi: '1.0.0',
        pesan: 'Server Node.js LinguaQuest berjalan lancar!'
    });
});

// ROUTE 3: Mengambil semua daftar pelajaran (GET /api/lessons)
app.get('/api/lessons', (req, res) => {
    res.status(200).json(lessonsData);
});


// =======================================================
// === 4. SERVER START ===
// =======================================================
app.listen(PORT, () => {
    console.log(`\n--- ${APP_NAME} Dijalankan ---`);
    console.log(`Server Frontend & API berjalan di: http://localhost:${PORT}`);
    console.log('Endpoints API tersedia:');
    console.log(`- Status: http://localhost:${PORT}/api/status`);
    console.log(`- Pelajaran: http://localhost:${PORT}/api/lessons`);
    console.log('Tekan CTRL+C untuk menghentikan server.');
});