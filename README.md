<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0ab7f0ba-ffff-4f0d-94c9-4b75406f43df

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🚀 Panduan Deploy ke Vercel

Aplikasi ini menggunakan **React 19**, **Vite 6**, dan **Tailwind CSS v4** yang sangat ringan dan siap dideploy ke **Vercel** secara instan sebagai Single Page Application (SPA).

### Langkah-langkah Deployment:

1. **Push ke GitHub:**
   Pastikan kode aplikasi Anda sudah di-push ke repositori GitHub Anda.

2. **Hubungkan ke Vercel:**
   - Buka [Vercel Dashboard](https://vercel.com/) dan masuk menggunakan akun GitHub Anda.
   - Klik tombol **"Add New"** > **"Project"**.
   - Pilih repositori `pendaftaran_aerob` dari daftar proyek Anda, lalu klik **"Import"**.

3. **Konfigurasi Proyek (Otomatis):**
   - Vercel akan secara otomatis mendeteksi framework **Vite** dan menyetel perintah build serta direktori output dengan benar:
     - **Framework Preset:** `Vite`
     - **Build Command:** `npm run build` (menjalankan `vite build`)
     - **Output Directory:** `dist`

4. **Tambahkan Environment Variables (Opsional):**
   Jika Anda ingin mengintegrasikan pendaftaran langsung dengan Google Spreadsheet secara global, tambahkan variabel lingkungan berikut di bagian **Environment Variables**:
   - **Key:** `VITE_SHEETS_API_URL`
   - **Value:** *[URL Web App Google Apps Script Anda]*

5. **Deploy!**
   - Klik tombol **"Deploy"**. Vercel akan membangun (build) aplikasi Anda dalam waktu kurang dari 1 menit.
   - Selamat! Aplikasi pendaftaran AEROB Anda sekarang sudah online secara global.

### Fitur Penunjang Vercel di Repositori Ini:
- **`vercel.json`**: Sudah terkonfigurasi dengan aturan penulisan ulang URL (*URL rewrites*) untuk memastikan routing SPA berjalan lancar tanpa error 404 saat halaman di-refresh.
- **`.env.example`**: Sebagai panduan variabel lingkungan yang dibutuhkan oleh aplikasi.
- **Fallback URL**: Sistem akan memprioritaskan URL Google Spreadsheet dari Vercel Environment Variable sebelum mengambil dari LocalStorage admin.

