import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plane, Cpu, Search, Trash2, Download, Database, 
  Sparkles, Filter, RefreshCw, BarChart2, ShieldCheck, CheckCircle,
  ChevronDown, ChevronUp, Settings, Upload, Image, FileText, Check, RotateCcw,
  Copy, Link
} from 'lucide-react';
import { RegistrationData, DivisionType, ExperienceLevel, KopConfig } from '../types';
import { generateAerobLogo, generateSchoolLogo } from '../utils/logoGenerator';

interface AdminPanelProps {
  registrations: RegistrationData[];
  onDeleteRegistration: (id: string) => void;
  onClearAll: () => void;
  onSeedMockData: () => void;
  kopConfig: KopConfig;
  onUpdateKopConfig: (config: KopConfig) => void;
  appScriptUrl: string;
  onUpdateAppScriptUrl: (url: string) => void;
}

export default function AdminPanel({ 
  registrations, 
  onDeleteRegistration, 
  onClearAll, 
  onSeedMockData,
  kopConfig,
  onUpdateKopConfig,
  appScriptUrl,
  onUpdateAppScriptUrl
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<DivisionType | 'All'>('All');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | 'All'>('All');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'pendaftar' | 'pengaturan'>('pendaftar');

  const [localKop1, setLocalKop1] = useState(kopConfig.kopLine1 || '');
  const [localKop2, setLocalKop2] = useState(kopConfig.kopLine2 || '');
  const [localKop3, setLocalKop3] = useState(kopConfig.kopLine3 || '');
  const [localKop4, setLocalKop4] = useState(kopConfig.kopLine4 || '');

  const [localAppScriptUrl, setLocalAppScriptUrl] = useState(appScriptUrl || '');
  const [copied, setCopied] = useState(false);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [testStatusMsg, setTestStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  React.useEffect(() => {
    setLocalKop1(kopConfig.kopLine1 || '');
    setLocalKop2(kopConfig.kopLine2 || '');
    setLocalKop3(kopConfig.kopLine3 || '');
    setLocalKop4(kopConfig.kopLine4 || '');
  }, [kopConfig]);

  React.useEffect(() => {
    setLocalAppScriptUrl(appScriptUrl || '');
  }, [appScriptUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'org' | 'school') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG/JPEG)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      if (type === 'org') {
        onUpdateKopConfig({ ...kopConfig, orgLogo: base64String });
      } else {
        onUpdateKopConfig({ ...kopConfig, schoolLogo: base64String });
      }
      triggerSuccess(`Logo ${type === 'org' ? 'Organisasi' : 'Sekolah'} berhasil diperbarui!`);
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = (type: 'org' | 'school') => {
    const defaultLogo = type === 'org' ? generateAerobLogo() : generateSchoolLogo();
    if (type === 'org') {
      onUpdateKopConfig({ ...kopConfig, orgLogo: defaultLogo });
    } else {
      onUpdateKopConfig({ ...kopConfig, schoolLogo: defaultLogo });
    }
    triggerSuccess(`Logo ${type === 'org' ? 'Organisasi' : 'Sekolah'} berhasil di-reset ke default!`);
  };

  const handleSaveKopConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKopConfig({
      ...kopConfig,
      kopLine1: localKop1,
      kopLine2: localKop2,
      kopLine3: localKop3,
      kopLine4: localKop4,
    });
    triggerSuccess('Pengaturan teks Kop Formulir berhasil disimpan!');
  };

  const handleResetAllKop = () => {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh konfigurasi KOP ke default?')) {
      const defaultOrg = generateAerobLogo();
      const defaultSchool = generateSchoolLogo();
      onUpdateKopConfig({
        orgLogo: defaultOrg,
        schoolLogo: defaultSchool,
        kopLine1: 'ORGANISASI INTRA SEKOLAH (OSIS) / KLUB EKSTRAKURIKULER',
        kopLine2: 'KLUB AEROMODELING & ROBOTIKA (AEROB) MALANG',
        kopLine3: 'SEKOLAH MENENGAH ATAS NEGERI 3 MALANG',
        kopLine4: 'Sekretariat: Jl. Tugu No. 18, Malang, Jawa Timur. Telp/WA: 081234567890'
      });
      triggerSuccess('Konfigurasi KOP berhasil di-reset!');
    }
  };

  const handleSaveAppScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAppScriptUrl(localAppScriptUrl);
    triggerSuccess('URL Google Apps Script berhasil disimpan!');
  };

  const handleCopyScript = () => {
    const scriptCode = `// KODE GOOGLE APPS SCRIPT - SALIN KE EXTENSIONS > APPS SCRIPT DI SPREADSHEET ANDA
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Jika spreadsheet masih kosong, buat baris header (field database) otomatis
  if (sheet.getLastRow() === 0) {
    var headers = [
      "ID Registrasi", 
      "Tanggal Daftar", 
      "NISN", 
      "Nama Lengkap", 
      "Orang Tua / Wali", 
      "Kelas", 
      "Tempat Lahir", 
      "Tanggal Lahir", 
      "Hobi", 
      "Cita-Cita", 
      "Email Aktif", 
      "WhatsApp", 
      "Asal Instansi", 
      "Pilihan Divisi", 
      "Sub Divisi", 
      "Pemahaman/Pengalaman", 
      "Motivasi"
    ];
    sheet.appendRow(headers);
    
    // Format header agar rapi dan profesional
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2563eb"); // Warna Biru AEROB
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    // Auto-resize kolom
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Jika hanya request inisialisasi / cek koneksi
    if (data.action === 'init') {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Koneksi Berhasil! Field database berhasil dibuat di Spreadsheet.' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Tambahkan data registrasi baru ke baris selanjutnya
    sheet.appendRow([
      data.id || "",
      data.registrationDate || "",
      data.nisn || "",
      data.fullName || "",
      data.parentName || "",
      data.kelas || "",
      data.tempatLahir || "",
      data.tanggalLahir || "",
      data.hobi || "",
      data.citaCita || "",
      data.email || "",
      data.whatsapp || "",
      data.institution || "",
      data.division || "",
      data.subDivision || "",
      data.experienceLevel || "",
      data.motivation || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Data berhasil masuk ke Google Spreadsheet!' 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: 'success', 
    message: 'Apps Script AEROB Aktif! Gunakan metode POST untuk mengirim data.' 
  })).setMimeType(ContentService.MimeType.JSON);
}`;

    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestAppScriptUrl = async () => {
    if (!localAppScriptUrl.trim()) {
      setTestStatusMsg({ type: 'error', text: 'Mohon masukkan URL Google Apps Script terlebih dahulu!' });
      return;
    }
    if (!localAppScriptUrl.startsWith('https://')) {
      setTestStatusMsg({ type: 'error', text: 'Format URL salah! Harus diawali dengan https://' });
      return;
    }

    setIsTestingUrl(true);
    setTestStatusMsg(null);

    try {
      await fetch(localAppScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // avoid CORS crash during apps script redirection
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'init' })
      });
      
      setTestStatusMsg({ 
        type: 'success', 
        text: 'Sinyal koneksi berhasil dikirim! Silakan buka Google Spreadsheet Anda untuk memeriksa apakah baris Header (field database) sudah terbuat secara otomatis.' 
      });
    } catch (error) {
      setTestStatusMsg({ 
        type: 'error', 
        text: 'Gagal mengirim sinyal koneksi. Periksa koneksi internet Anda atau validitas URL.' 
      });
    } finally {
      setIsTestingUrl(false);
    }
  };



  // Trigger alert messages softly
  const triggerSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 3000);
  };

  // Filter and search logic
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesDivision = selectedDivision === 'All' || reg.division === selectedDivision;
      const matchesExperience = selectedExperience === 'All' || reg.experienceLevel === selectedExperience;

      return matchesSearch && matchesDivision && matchesExperience;
    });
  }, [registrations, searchQuery, selectedDivision, selectedExperience]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = registrations.length;
    const aeromodeling = registrations.filter(r => r.division === 'Aeromodeling').length;
    const robotics = registrations.filter(r => r.division === 'Robotics').length;
    
    const beginner = registrations.filter(r => r.experienceLevel === 'Beginner').length;
    const intermediate = registrations.filter(r => r.experienceLevel === 'Intermediate').length;
    const advanced = registrations.filter(r => r.experienceLevel === 'Advanced').length;

    const aeroPercent = total > 0 ? Math.round((aeromodeling / total) * 100) : 0;
    const robotPercent = total > 0 ? Math.round((robotics / total) * 100) : 0;

    return {
      total,
      aeromodeling,
      robotics,
      beginner,
      intermediate,
      advanced,
      aeroPercent,
      robotPercent
    };
  }, [registrations]);

  // Export to JSON
  const handleExportJSON = () => {
    if (registrations.length === 0) {
      alert('Tidak ada data pendaftaran untuk di-ekspor!');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aerob_pendaftaran_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccess('Data sukses diekspor ke file JSON!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Sistem Admin Lokal • Live Data
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 font-display flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" /> Panel Pengelola Pendaftar
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Kelola, filter, dan analisa data pendaftar AEROB dari penyimpanan lokal browser (LocalStorage).
          </p>
        </div>

        {/* Global Control Actions */}
        <div className="flex items-center gap-3">
          {registrations.length === 0 && (
            <button
              id="admin-btn-seed"
              onClick={() => {
                onSeedMockData();
                triggerSuccess('Mock pendaftar berhasil ditambahkan!');
              }}
              className="clay-btn-orange px-4 py-2.5 text-xs font-bold flex items-center gap-2 hover:clay-btn-orange-hover transition-all"
            >
              <Database className="w-4 h-4" /> Tambah Mock Pendaftar
            </button>
          )}
          {registrations.length > 0 && (
            <>
              <button
                id="admin-btn-export"
                onClick={handleExportJSON}
                className="clay-btn-blue px-4 py-2.5 text-xs font-bold flex items-center gap-2 hover:clay-btn-blue-hover transition-all"
              >
                <Download className="w-4 h-4" /> Ekspor Data (.JSON)
              </button>
              <button
                id="admin-btn-clear"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftar?')) {
                    onClearAll();
                    triggerSuccess('Seluruh database pendaftaran berhasil dibersihkan!');
                  }
                }}
                className="clay-btn-gray text-rose-600 border border-rose-100 px-4 py-2.5 text-xs font-bold flex items-center gap-2 hover:bg-rose-50 transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-500" /> Bersihkan Semua
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600" /> {actionSuccessMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-navigation Menu for Database vs Form Kop Settings */}
      <div className="flex border-b border-slate-200/85 mb-8 gap-1">
        <button
          onClick={() => setActiveSubTab('pendaftar')}
          className={`px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pendaftar'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Database Pendaftar ({registrations.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pengaturan')}
          className={`px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pengaturan'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" /> Pengaturan Kop Formulir
        </button>
      </div>

      {activeSubTab === 'pendaftar' && (
        <div className="space-y-6">
          {/* Statistics Section (Claymorphic Bento Grid) */}
          <div id="stats-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Registrants */}
        <div className="neu-flat p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Total Pendaftar</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800 font-display">{stats.total}</span>
            <span className="text-xs text-slate-500">Anggota</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Target: 200 Kuota Tersedia</p>
        </div>

        {/* Aeromodeling Breakdown */}
        <div className="neu-flat p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Aeromodeling</span>
            <Plane className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-600 font-display">{stats.aeromodeling}</span>
            <span className="text-xs text-slate-500">Pendaftar</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.aeroPercent}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Kontribusi: {stats.aeroPercent}% dari total</p>
        </div>

        {/* Robotics Breakdown */}
        <div className="neu-flat p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Robotics</span>
            <Cpu className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-500 font-display">{stats.robotics}</span>
            <span className="text-xs text-slate-500">Pendaftar</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.robotPercent}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Kontribusi: {stats.robotPercent}% dari total</p>
        </div>

        {/* Level distribution */}
        <div className="neu-flat p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Pemetaan Level</span>
            <BarChart2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Beginner</span>
              <span className="font-semibold text-emerald-600">{stats.beginner}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: stats.total > 0 ? `${(stats.beginner/stats.total)*100}%` : '0%' }} />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Intermediate</span>
              <span className="font-semibold text-amber-600">{stats.intermediate}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: stats.total > 0 ? `${(stats.intermediate/stats.total)*100}%` : '0%' }} />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Advanced</span>
              <span className="font-semibold text-rose-600">{stats.advanced}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: stats.total > 0 ? `${(stats.advanced/stats.total)*100}%` : '0%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter and Search Bar (Neumorphic inputs) */}
      <div id="admin-filters-section" className="neu-flat p-6 rounded-2xl mb-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" /> Filter & Pencarian Aktif
          </h3>
          {(searchQuery !== '' || selectedDivision !== 'All' || selectedExperience !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDivision('All');
                setSelectedExperience('All');
              }}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama, asal instansi, ID pendaftaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-sm bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value as DivisionType | 'All')}
              className="w-full px-3 py-3 text-sm bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <option value="All">Semua Divisi</option>
              <option value="Aeromodeling">Divisi Aeromodeling</option>
              <option value="Robotics">Divisi Robotics</option>
            </select>
          </div>

          {/* Experience level filter */}
          <div>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value as ExperienceLevel | 'All')}
              className="w-full px-3 py-3 text-sm bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <option value="All">Semua Level</option>
              <option value="Beginner">Beginner (Pemula)</option>
              <option value="Intermediate">Intermediate (Menengah)</option>
              <option value="Advanced">Advanced (Mahir)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations List / Table Container */}
      <div id="admin-data-list" className="neu-flat rounded-2xl overflow-hidden p-2">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">Tidak Ada Data Pendaftar Ditemukan</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {registrations.length === 0 
                ? 'Database lokal kosong. Silakan buka tab Pendaftaran untuk mendaftar atau klik tombol "Tambah Mock Pendaftar" di kanan atas.'
                : 'Tidak ada data pendaftar yang cocok dengan kriteria pencarian dan penyaringan Anda.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">ID / Tanggal</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Asal Instansi</th>
                  <th className="px-6 py-4">Spesifikasi Divisi</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Kontak (WA)</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                <AnimatePresence>
                  {filteredRegistrations.map((reg) => {
                    const isExpanded = expandedRowId === reg.id;
                    return (
                      <React.Fragment key={reg.id}>
                        <motion.tr
                          id={`row-${reg.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.2 }}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isExpanded ? 'bg-blue-50/20' : ''
                          }`}
                          onClick={() => setExpandedRowId(isExpanded ? null : reg.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div>
                                <span className="font-bold text-xs font-mono text-slate-900 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">
                                  {reg.id}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1">{reg.registrationDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {reg.fullName}
                            <p className="text-[11px] text-slate-400 font-normal font-mono">{reg.email}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 max-w-[160px] truncate" title={reg.institution}>
                            {reg.institution}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              {reg.division === 'Aeromodeling' ? (
                                <Plane className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                              )}
                              {reg.division}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{reg.subDivision}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                              reg.experienceLevel === 'Beginner' ? 'bg-emerald-500 shadow-sm shadow-emerald-100' :
                              reg.experienceLevel === 'Intermediate' ? 'bg-amber-500 shadow-sm shadow-amber-100' : 
                              'bg-rose-500 shadow-sm shadow-rose-100'
                            }`}>
                              {reg.experienceLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                            {reg.whatsapp}
                          </td>
                          <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`delete-btn-${reg.id}`}
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin menghapus pendaftaran atas nama "${reg.fullName}"?`)) {
                                  onDeleteRegistration(reg.id);
                                  triggerSuccess(`Pendaftaran "${reg.fullName}" berhasil dihapus.`);
                                }
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                              title="Hapus pendaftar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>

                        {/* Expandable Details Sub-row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/50" onClick={(e) => e.stopPropagation()}>
                            <td colSpan={7} className="px-8 py-5 border-l-4 border-blue-500 shadow-inner">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
                                <div className="space-y-2">
                                  <h5 className="font-bold text-slate-500 uppercase tracking-wider font-mono">Biodata Anggota</h5>
                                  <div className="flex flex-col gap-1.5">
                                    <div><span className="text-slate-400 font-medium">NISN:</span> <span className="font-mono font-bold text-slate-800">{reg.nisn || '-'}</span></div>
                                    <div><span className="text-slate-400 font-medium">Orang Tua / Wali:</span> <span className="font-semibold text-slate-800">{reg.parentName || '-'}</span></div>
                                    <div><span className="text-slate-400 font-medium">Kelas:</span> <span className="font-semibold text-slate-800">{reg.kelas || '-'}</span></div>
                                    <div><span className="text-slate-400 font-medium">Tempat, Tgl Lahir:</span> <span className="font-semibold text-slate-800">{reg.tempatLahir ? `${reg.tempatLahir}, ${reg.tanggalLahir}` : '-'}</span></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h5 className="font-bold text-slate-500 uppercase tracking-wider font-mono">Profil Diri</h5>
                                  <div className="flex flex-col gap-1.5">
                                    <div><span className="text-slate-400 font-medium">Hobi:</span> <span className="font-semibold text-slate-800">{reg.hobi || '-'}</span></div>
                                    <div><span className="text-slate-400 font-medium">Cita-Cita:</span> <span className="font-semibold text-slate-800">{reg.citaCita || '-'}</span></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h5 className="font-bold text-slate-500 uppercase tracking-wider font-mono font-sans">Motivasi Bergabung</h5>
                                  <p className="italic text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed shadow-sm">
                                    "{reg.motivation}"
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      )}

      {/* Tab Content 2: Pengaturan Kop & Preview */}
      {activeSubTab === 'pengaturan' && (
        <motion.div
          key="pengaturan-kop-tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Form Settings Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="neu-flat p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Image className="w-4 h-4 text-blue-500" /> Logo & Identitas Kop
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload file logo custom (PNG/JPEG) atau reset ke desain default AEROB.
                </p>
              </div>

              {/* Logo Organisasi Upload */}
              <div className="space-y-2 border-b pb-4 border-slate-200/50">
                <label className="text-xs font-bold text-slate-500 block">Logo Organisasi (Kiri)</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                    {kopConfig.orgLogo ? (
                      <img src={kopConfig.orgLogo} alt="Org Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Kosong</span>
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100/70 transition-all text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Upload PNG/JPG
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'org')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleResetLogo('org')}
                        className="p-2 border border-slate-200 text-slate-500 hover:text-blue-650 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                        title="Reset ke logo default"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">File maksimal 1MB, format transparan direkomendasikan.</p>
                  </div>
                </div>
              </div>

              {/* Logo Sekolah Upload */}
              <div className="space-y-2 border-b pb-4 border-slate-200/50">
                <label className="text-xs font-bold text-slate-500 block">Logo Sekolah (Kanan)</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                    {kopConfig.schoolLogo ? (
                      <img src={kopConfig.schoolLogo} alt="School Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Kosong</span>
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100/70 transition-all text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Upload PNG/JPG
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'school')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleResetLogo('school')}
                        className="p-2 border border-slate-200 text-slate-500 hover:text-blue-650 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                        title="Reset ke logo default"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">File maksimal 1MB, format transparan direkomendasikan.</p>
                  </div>
                </div>
              </div>

              {/* Kop Text Lines Input Form */}
              <form onSubmit={handleSaveKopConfig} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2 border-t pt-4 border-slate-200/50">
                    <FileText className="w-4 h-4 text-blue-500" /> Teks Kop Surat Resmi
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sesuaikan baris teks Kop formulir resmi. Huruf besar otomatis diterapkan pada cetakan.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Kop Baris 1 (Instansi Atas / Dinas)</label>
                  <input
                    type="text"
                    value={localKop1}
                    onChange={(e) => setLocalKop1(e.target.value)}
                    placeholder="Contoh: DINAS PENDIDIKAN PROVINSI JAWA TIMUR"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 font-semibold text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Kop Baris 2 (Nama Organisasi Utama)</label>
                  <input
                    type="text"
                    value={localKop2}
                    onChange={(e) => setLocalKop2(e.target.value)}
                    placeholder="Contoh: KLUB AEROMODELING & ROBOTIKA (AEROB)"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Kop Baris 3 (Nama Lembaga / Sekolah)</label>
                  <input
                    type="text"
                    value={localKop3}
                    onChange={(e) => setLocalKop3(e.target.value)}
                    placeholder="Contoh: SMA NEGERI 3 MALANG"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Kop Baris 4 (Alamat & Detail Kontak)</label>
                  <textarea
                    rows={2}
                    value={localKop4}
                    onChange={(e) => setLocalKop4(e.target.value)}
                    placeholder="Contoh: Jalan Tugu No. 18, Malang. Telp: (0341) 362412"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-600 leading-normal font-medium"
                  />
                </div>

                {/* Submit / Reset Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-grow clay-btn-blue py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Simpan Pengaturan Kop
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAllKop}
                    className="p-2 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Reset semua ke default"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Google Spreadsheet Integration Card */}
            <div className="neu-flat p-6 rounded-2xl space-y-4 mt-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" /> Google Spreadsheet Sync
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${appScriptUrl ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {appScriptUrl ? 'Terkoneksi' : 'Belum Terkoneksi'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Koneksikan form pendaftaran dengan Google Spreadsheet menggunakan Apps Script agar database terisi otomatis secara real-time.
                </p>
              </div>

              {/* URL Input Form */}
              <form onSubmit={handleSaveAppScriptUrl} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block flex items-center gap-1">
                    <Link className="w-3.5 h-3.5 text-slate-400" /> URL Web App Google Apps Script
                  </label>
                  <input
                    type="url"
                    value={localAppScriptUrl}
                    onChange={(e) => setLocalAppScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2.5 text-xs bg-white rounded-xl shadow-inner border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 text-slate-700 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Simpan URL
                  </button>
                  <button
                    type="button"
                    onClick={handleTestAppScriptUrl}
                    disabled={isTestingUrl}
                    className="px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isTestingUrl ? (
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-700 border-t-transparent rounded-full font-bold"></span>
                    ) : (
                      'Uji & Buat Field'
                    )}
                  </button>
                </div>
              </form>

              {testStatusMsg && (
                <div className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
                  testStatusMsg.type === 'success' 
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 font-medium' 
                    : 'bg-rose-50/50 border-rose-200 text-rose-800 font-medium'
                }`}>
                  {testStatusMsg.text}
                </div>
              )}

              {/* Instructions on how to use Apps Script */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  💡 Panduan Langkah Google Sheets:
                </span>
                <ol className="list-decimal list-inside text-[10px] text-slate-500 space-y-1.5 leading-relaxed font-medium">
                  <li>Buka atau buat <strong className="text-slate-700">Google Spreadsheet</strong> baru.</li>
                  <li>Pilih menu <strong className="text-slate-700">Ekstensi &gt; Apps Script</strong>.</li>
                  <li>Hapus kode bawaan, lalu klik tombol di bawah untuk menyalin kode integrasi.</li>
                  <li>Tempel kode tersebut di halaman editor Apps Script.</li>
                  <li>Klik tombol <strong className="text-slate-700">Terapkan &gt; Penerapan Baru (Deploy &gt; New Deployment)</strong>.</li>
                  <li>Pilih jenis <strong className="text-slate-700">Aplikasi Web (Web App)</strong>.</li>
                  <li>Setel Akses ke <strong className="text-slate-700">Siapa Saja (Anyone)</strong>, lalu klik Terapkan.</li>
                  <li>Salin URL Aplikasi Web yang diberikan, tempel di kolom atas lalu klik Simpan.</li>
                  <li><strong className="text-blue-600">Deploy Vercel:</strong> Anda juga dapat menyetel URL ini secara permanen di Vercel Dashboard dengan menambahkan Environment Variable <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-mono">VITE_SHEETS_API_URL</code>.</li>
                </ol>

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="w-full mt-2 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Tersalin ke Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" /> Salin Kode Google Apps Script
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Form Layout Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                🔍 Live Preview Dokumen Formulir (A4)
              </h3>
              <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                WYSWYG • Skala 1:1 PDF
              </span>
            </div>

            {/* Paper Container Replica */}
            <div className="bg-white border border-slate-300 shadow-xl rounded-2xl p-8 text-slate-800 font-sans select-none overflow-x-auto min-w-[340px]">
              <div className="w-full max-w-[550px] mx-auto space-y-4">
                
                {/* Real-time Kop Surat */}
                <div className="flex items-center justify-between pb-3 relative">
                  {/* Org Logo */}
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    {kopConfig.orgLogo ? (
                      <img src={kopConfig.orgLogo} alt="Org Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400">Logo</div>
                    )}
                  </div>
                  
                  {/* Kop Center Text lines */}
                  <div className="flex-grow text-center px-4">
                    <div className="text-[9px] font-bold text-slate-500 tracking-wider uppercase leading-snug">
                      {localKop1 || 'ORGANISASI INTRA SEKOLAH (OSIS) / KLUB EKSTRAKURIKULER'}
                    </div>
                    <div className="text-[12px] font-extrabold text-slate-900 leading-tight uppercase mt-0.5">
                      {localKop2 || 'KLUB AEROMODELING & ROBOTIKA (AEROB) MALANG'}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">
                      {localKop3 || 'SEKOLAH MENENGAH ATAS NEGERI 3 MALANG'}
                    </div>
                    <div className="text-[8px] text-slate-400 mt-1 leading-relaxed">
                      {localKop4 || 'Sekretariat: Jl. Tugu No. 18, Malang, Jawa Timur. Telp/WA: 081234567890'}
                    </div>
                  </div>
                  
                  {/* School Logo */}
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    {kopConfig.schoolLogo ? (
                      <img src={kopConfig.schoolLogo} alt="School Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400">Logo</div>
                    )}
                  </div>
                </div>

                {/* Double Border under Kop */}
                <div className="space-y-0.5 border-t border-slate-900 pt-0.5">
                  <div className="border-t-[3px] border-slate-900" />
                </div>

                {/* Document Body */}
                <div className="space-y-4 pt-2">
                  <div className="text-center">
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800 border-b pb-1.5 border-slate-200">
                      I. DATA DIRI & DETAIL PENDAFTARAN (CONTOH)
                    </h4>
                  </div>

                  {/* Complete Biodata Table matching all input fields */}
                  <div className="grid grid-cols-12 gap-y-1.5 text-[9px] leading-relaxed px-2 font-mono">
                    <div className="col-span-4 font-bold text-slate-400">ID Registrasi</div>
                    <div className="col-span-8 text-slate-850 font-bold">: AEROB-8341</div>

                    <div className="col-span-4 font-bold text-slate-400">Tanggal Daftar</div>
                    <div className="col-span-8 text-slate-850 font-semibold">: 20/07/2026, 20:30</div>

                    <div className="col-span-4 font-bold text-slate-400">NISN</div>
                    <div className="col-span-8 text-slate-850 font-semibold">: 0081234567</div>

                    <div className="col-span-4 font-bold text-slate-400">Nama Lengkap</div>
                    <div className="col-span-8 text-slate-850 font-bold">: Ahmad Zakaria</div>

                    <div className="col-span-4 font-bold text-slate-400">Orang Tua / Wali</div>
                    <div className="col-span-8 text-slate-850 font-semibold">: Hendra Zakaria</div>

                    <div className="col-span-4 font-bold text-slate-400">Kelas</div>
                    <div className="col-span-8 text-slate-850">: XII IPA 3</div>

                    <div className="col-span-4 font-bold text-slate-400">Tempat, Tgl Lahir</div>
                    <div className="col-span-8 text-slate-850">: Malang, 12 Agustus 2008</div>

                    <div className="col-span-4 font-bold text-slate-400">Hobi</div>
                    <div className="col-span-8 text-slate-850">: Robotika, Aeromodeling, Pemrograman</div>

                    <div className="col-span-4 font-bold text-slate-400">Cita-Cita</div>
                    <div className="col-span-8 text-slate-850">: Aerospace Engineer</div>

                    <div className="col-span-4 font-bold text-slate-400">Email Aktif</div>
                    <div className="col-span-8 text-slate-850">: ahmad.zakaria@email.com</div>

                    <div className="col-span-4 font-bold text-slate-400">WhatsApp</div>
                    <div className="col-span-8 text-slate-850 font-semibold">: 081234567890</div>

                    <div className="col-span-4 font-bold text-slate-400">Asal Instansi</div>
                    <div className="col-span-8 text-slate-850">: SMA Negeri 3 Malang</div>

                    <div className="col-span-4 font-bold text-slate-400">Pilihan Divisi</div>
                    <div className="col-span-8 text-blue-600 font-bold">: Aeromodeling (RC Plane)</div>

                    <div className="col-span-4 font-bold text-slate-400">Pemahaman</div>
                    <div className="col-span-8 text-slate-850">: Intermediate (Menengah)</div>

                    <div className="col-span-4 font-bold text-slate-400">Motivasi</div>
                    <div className="col-span-8 text-slate-700 italic">: "Saya ingin belajar merakit pesawat remote control sendiri dan memahami mekatronika."</div>
                  </div>

                  {/* Scissors line */}
                  <div className="relative my-6 text-center py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-slate-400" />
                    </div>
                    <span className="relative px-3 text-[8px] font-bold text-slate-400 bg-white tracking-widest font-mono uppercase">
                      ✂️ Gunting di sini untuk lembar persetujuan fisik
                    </span>
                  </div>

                  {/* Consent section replica */}
                  <div className="text-center">
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800 border-b pb-1.5 border-slate-200">
                      II. PERNYATAAN PERSETUJUAN ORANG TUA / WALI SISWA
                    </h4>
                  </div>
                  <p className="text-[9px] text-slate-500 text-justify leading-relaxed px-2 font-medium">
                    Saya yang bertanda tangan di bawah ini selaku Orang Tua / Wali dari siswa bernama <strong>Ahmad Zakaria</strong> (NISN: 0081234567, Kelas: XII IPA 3), menyatakan memberikan persetujuan sepenuhnya kepada anak saya untuk mendaftar, bergabung, dan mengikuti seluruh kegiatan ekstrakurikuler serta pelatihan teknologi di Klub Aeromodeling & Robotika (AEROB) Sekolah Menengah untuk tahun ajaran 2026/2027.
                  </p>

                  {/* Signature block replica matching the image exactly */}
                  <div className="grid grid-cols-2 text-[10px] pt-8 text-slate-800 px-6 font-sans">
                    {/* Siswa Column */}
                    <div className="text-center flex flex-col items-center">
                      <div className="invisible select-none leading-normal">
                        Malang, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-slate-800 font-medium">Siswa Pendaftar,</div>
                      {/* Generous space for signing */}
                      <div className="h-16"></div>
                      <div className="font-bold text-slate-950 font-sans tracking-wide">
                        ( Ahmad Zakaria )
                      </div>
                    </div>

                    {/* Orang Tua / Wali Column */}
                    <div className="text-center flex flex-col items-center">
                      <div className="text-slate-600 leading-normal">
                        Malang, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-slate-800 font-medium">Orang Tua / Wali,</div>
                      {/* Generous space for signing */}
                      <div className="h-16"></div>
                      <div className="font-bold text-slate-950 font-sans tracking-wide">
                        ( Hendra Zakaria )
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
