# Panduan & Prompt Lanjutan Pengembangan Web Pendaftaran AEROB (Aeromodeling & Robotic)

Dokumen ini berisi kumpulan **Prompt Tingkat Lanjut (Advanced Ready-to-Use Prompts)** yang dirancang khusus untuk memperluas fitur platform pendaftaran AEROB yang telah dibangun. Dokumen ini mempertahankan konsistensi gaya desain **Neumorphism & Claymorphism**, integrasi **LocalStorage**, dan animasi interaktif menggunakan **Framer Motion (`motion/react`)**.

Anda dapat langsung menyalin prompt-prompt di bawah ini dan memberikannya ke AI Coding agent Anda untuk melakukan peningkatan fungsionalitas secara otomatis dan modular.

---

## 🚀 PROMPT 1: Sistem Otentikasi Admin Terproteksi (Login Neumorphism)

### Deskripsi
Prompt ini digunakan untuk menambahkan pintu masuk terproteksi (Login Card) sebelum user dapat melihat Panel Admin. Desain Login harus mengikuti pola Neumorphic yang elegan.

### 📝 Salin Prompt Berikut:
```text
Tolong tambahkan fitur Otentikasi Login Admin sederhana (Client-side) sebelum masuk ke Panel Admin di web pendaftaran AEROB. Ikuti spesifikasi teknis berikut tanpa merusak struktur yang ada:

1. MODUL LOGIN BARU:
   Buat file baru `/src/components/AdminLogin.tsx` berupa card Neumorphism yang cantik.
   - Field: Username & Password.
   - Desain: Pressed shadow pada input field saat focus, serta tombol login Claymorphic yang membal saat di-tap.
   - Gunakan ikon gembok (Lock) dan kunci (Key) dari lucide-react.

2. LOGIKA KREDENSIAL LOKAL:
   - Kredensial default: Username 'admin_aerob' dan Password 'aerob2026'.
   - Simpan status login di React State dalam App.tsx agar ketika berpindah tab, sesi admin tetap aktif selama halaman tidak di-reload.

3. ANIMASI TRANSISI:
   - Gunakan `<AnimatePresence>` dan `<motion.div>` dari 'motion/react' untuk menghasilkan transisi 'slide-up fade-in' yang halus ketika panel login muncul dan ketika berhasil masuk ke panel utama admin.

4. FEEDBACK ERROR:
   - Jika password salah, buat card login bergetar (shake animation) menggunakan variant Framer Motion: `animate={{ x: [-10, 10, -10, 10, 0] }}` dengan transisi cepat.
```

---

## 📊 PROMPT 2: Integrasi Sinkronisasi Real-time dengan Google Sheets (Tanpa Database Rumit)

### Deskripsi
Membantu admin menyinkronkan data pendaftar dari LocalStorage secara otomatis ke Google Sheets milik organisasi menggunakan integrasi Webhook API gratis (seperti SheetDB atau Google Apps Script).

### 📝 Salin Prompt Berikut:
```text
Tolong integrasikan data pendaftaran AEROB lokal agar otomatis tersinkronisasi ke Google Sheets menggunakan API Webhook. Modifikasi file `/src/components/RegistrationForm.tsx` dan `App.tsx` dengan panduan berikut:

1. LAZY INITIALIZATION & HANDLING:
   - Tambahkan variabel lingkungan `VITE_SHEETS_API_URL` di `.env.example` (biarkan kosong sebagai placeholder).
   - Di dalam fungsi submit pendaftaran, periksa terlebih dahulu jika `import.meta.env.VITE_SHEETS_API_URL` terdefinisi.
   - Jika terdefinisi, lakukan pemanggilan POST fetch API secara asynchronous untuk mengirim objek pendaftaran ke endpoint Google Sheets tersebut.
   - Jika tidak terdefinisi, tetap simpan data secara lokal di LocalStorage dengan sukses (graceful degradation).

2. INDIKATOR STATUS CLOUD:
   - Di Panel Admin (`/src/components/AdminPanel.tsx`), tambahkan indikator status di bagian atas: "SINKRONISASI CLOUD: AKTIF" (jika API URL terisi) atau "SINKRONISASI CLOUD: LOKAL SAJA" (jika kosong) dengan dot berwarna hijau atau kuning berkedip lembut.

3. PROSES BACKGROUND:
   - Gunakan indikator loading yang lembut (spinner kecil) di samping baris tabel data admin untuk menandakan jika baris tersebut sudah terkirim ke cloud atau baru tersimpan di lokal saja.
```

---

## 🖨️ PROMPT 3: Fitur Cetak Bukti PDF & Ekspor Excel (CSV) Tingkat Lanjut

### Deskripsi
Menambahkan tombol aksi bagi pendaftar untuk mengunduh Kartu Bukti Registrasi dalam format PDF/Gambar serta mengekspor data pendaftar bagi admin dalam format file CSV terstruktur.

### 📝 Salin Prompt Berikut:
```text
Tolong tambahkan fitur ekspor file CSV dan pencetakan PDF Bukti Registrasi pada web pendaftaran AEROB:

1. FITUR CETAK BUKTI PDF (Sisi Pendaftar):
   - Ketika pendaftaran berhasil (`/src/components/RegistrationForm.tsx` pada tampilan Success), tambahkan tombol "Unduh Kartu Anggota (PDF)".
   - Gunakan fungsi `window.print()` dengan menambahkan CSS Media Query khusus `@media print` di `/src/index.css` agar ketika dicetak, hanya elemen Kartu Bukti Pendaftaran Claymorphism saja yang terlihat dengan ukuran ID card presisi, sementara tombol-tombol dan background web disembunyikan.

2. EKSPOR FORMAT CSV (Sisi Admin):
   - Di file `/src/components/AdminPanel.tsx`, modifikasi tombol ekspor agar selain mendownload file JSON, juga dapat mendownload file `.csv` yang dapat langsung dibuka di Microsoft Excel dengan pemisah koma (,).
   - Pastikan header CSV berisi: "ID Pendaftaran, Nama Lengkap, Email, WhatsApp, Instansi, Divisi, Sub-Divisi, Tingkat Pengalaman, Tanggal Pendaftaran".
   - Handle karakter baris baru (\n) pada kolom Motivasi agar tidak merusak format baris tabel CSV.
```

---

## 🔊 PROMPT 4: Efek Suara Haptik (Sound FX) & Mikro-Interaksi Claymorphic 3D

### Deskripsi
Meningkatkan kualitas UX/UI agar terasa lebih nyata (gamified) dengan suara klik mekanik / desir pesawat saat tombol atau elemen di-hover dan di-klik.

### 📝 Salin Prompt Berikut:
```text
Tolong tambahkan efek suara (Audio Sound FX) dan mikro-interaksi 3D tingkat lanjut untuk memperkaya gaya Claymorphism & Neumorphism pada web AEROB:

1. INTEGRASI SOUND FX:
   - Gunakan audio synthesizer bawaan browser (Web Audio API) atau load sound effect ringan tanpa bergantung pada package besar agar bebas dari masalah import.
   - Buat dua efek suara sintetis sederhana:
     a. "Click/Pop Sound": Suara gelembung clay lembut saat tombol di-klik.
     b. "Swoosh/Hover Sound": Suara desir angin tipis berfrekuensi tinggi saat card divisi Aeromodeling di-hover, melambangkan pesawat lepas landas.
     c. "Beep/Robotic Sound": Suara bleep robotik pendek saat divisi Robotics di-hover.

2. MIKRO-INTERAKSI FRAMER MOTION:
   - Tambahkan properti `whileTap={{ scale: 0.96, rotate: -1 }}` pada semua input dan tombol.
   - Tambahkan efek bayangan bergerak (moving shadow effect) saat card di-hover, seolah-olah sumber cahaya di atas clay-card bergeser mengikuti posisi cursor mouse.
```

---

## 🎨 Panduan Menjaga Konsistensi Desain AEROB
Saat menerapkan prompt di atas, pastikan AI Anda mematuhi aturan visual berikut:
- **Warna Pokok**: Biru Cerah (`#3b82f6` - mewakili langit/aeromodeling) dan Jingga Neon (`#f97316` - mewakili energi/robotic).
- **Claymorphism**: Harus memiliki `border: 1px solid rgba(255,255,255,0.6)` serta kombinasi `box-shadow` luar yang lembut dan `box-shadow` dalam (inset) putih terang di kiri atas untuk menciptakan efek lilin/plastik 3D.
- **Bahasa**: Seluruh antarmuka yang ramah pengguna menggunakan Bahasa Indonesia yang komunikatif dan profesional.
