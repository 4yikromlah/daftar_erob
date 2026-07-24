import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Cpu, ShieldCheck, Home, FileText, ClipboardList,
  Sparkles, CheckCircle2, ChevronRight, Copy, Check
} from 'lucide-react';
import { RegistrationData, DivisionType, SubDivisionType, KopConfig } from './types';
import { generateAerobLogo, generateSchoolLogo } from './utils/logoGenerator';
import HeroSection from './components/HeroSection';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

// Key for local storage
const LOCAL_STORAGE_KEY = 'aerob_registration_db_v1';
const LOCAL_STORAGE_KOP_KEY = 'aerob_kop_config_v1';

// High-fidelity pre-seeded data for demonstrating stats & list
const MOCK_REGISTRATIONS: RegistrationData[] = [
  {
    id: 'AEROB-8341',
    nisn: '0081234567',
    fullName: 'Ahmad Zakaria',
    parentName: 'Hendra Zakaria',
    kelas: 'XII IPA 3',
    tempatLahir: 'Bandung',
    tanggalLahir: '2008-05-12',
    hobi: 'Membaca & Aeromodeling',
    citaCita: 'Insinyur Kedirgantaraan',
    email: 'ahmad.zakaria@gmail.com',
    whatsapp: '081234456789',
    institution: 'SMA Negeri 1 Bandung',
    division: 'Aeromodeling',
    subDivision: 'RC Plane (Radio Control)',
    experienceLevel: 'Intermediate',
    motivation: 'Sangat tertarik dengan kendali sayap tetap dan aerodinamika pesawat model sejak kecil.',
    registrationDate: '19/7/2026, 14.23.10'
  },
  {
    id: 'AEROB-2910',
    nisn: '0098765432',
    fullName: 'Dewi Lestari',
    parentName: 'Budi Lestari',
    kelas: 'XI IPA 1',
    tempatLahir: 'Malang',
    tanggalLahir: '2009-08-22',
    hobi: 'Koding & Berenang',
    citaCita: 'Roboticist / AI Engineer',
    email: 'dewi.lestari@student.ub.ac.id',
    whatsapp: '085678901234',
    institution: 'SMA Negeri 3 Malang',
    division: 'Robotics',
    subDivision: 'Line Follower Robot',
    experienceLevel: 'Beginner',
    motivation: 'Ingin menguasai pemrograman Arduino untuk membuat robot pelacak jalur otomatis.',
    registrationDate: '20/7/2026, 08.11.45'
  },
  {
    id: 'AEROB-4911',
    nisn: '0085566778',
    fullName: 'Rian Hidayat',
    parentName: 'Mulyadi Hidayat',
    kelas: 'XII IPS 2',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2008-11-05',
    hobi: 'Olahraga & Rakit Roket',
    citaCita: 'Pilot / Teknisi Pesawat',
    email: 'rianh@outlook.com',
    whatsapp: '081987654321',
    institution: 'SMA Negeri 3 Malang',
    division: 'Aeromodeling',
    subDivision: 'RC Plane (Radio Control)',
    experienceLevel: 'Beginner',
    motivation: 'Ingin memahami hukum fisika tekanan udara dan aerodinamika penerbangan.',
    registrationDate: '18/7/2026, 10.05.12'
  },
  {
    id: 'AEROB-7740',
    nisn: '0073344556',
    fullName: 'Clara Angelina',
    parentName: 'Thomas Angelina',
    kelas: 'XII IPA 4',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-04-18',
    hobi: 'Solder & IoT Programming',
    citaCita: 'IoT Hardware Architect',
    email: 'clara.angeline@gmail.com',
    whatsapp: '082133445566',
    institution: 'SMA Negeri 1 Jakarta',
    division: 'Robotics',
    subDivision: 'Creative IoT Robot',
    experienceLevel: 'Advanced',
    motivation: 'Sudah berpengalaman membuat sistem smart home berbasis ESP32 dan ingin riset lebih lanjut di AEROB.',
    registrationDate: '20/7/2026, 09.01.23'
  },
  {
    id: 'AEROB-5122',
    nisn: '0081122334',
    fullName: 'Fajar Setiawan',
    parentName: 'Rudi Setiawan',
    kelas: 'XI Teknik Mesin',
    tempatLahir: 'Malang',
    tanggalLahir: '2009-02-14',
    hobi: 'Bermain Game & Otomotif',
    citaCita: 'Insinyur Mekatronika',
    email: 'fajar.setiawan@gmail.com',
    whatsapp: '081288990011',
    institution: 'SMK Negeri 1 Malang',
    division: 'Robotics',
    subDivision: 'Battlebot Robot',
    experienceLevel: 'Intermediate',
    motivation: 'Sangat suka dengan mekanika robot tempur RC dan ingin mendesain chassis bermotor torsi tinggi.',
    registrationDate: '19/7/2026, 19.40.02'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'admin'>('beranda');
  const [selectedDivision, setSelectedDivision] = useState<DivisionType>('Aeromodeling');
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Initial Kop Config with LocalStorage persistence
  const [kopConfig, setKopConfig] = useState<KopConfig>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KOP_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return {
            orgLogo: parsed.orgLogo !== undefined ? parsed.orgLogo : generateAerobLogo(),
            schoolLogo: parsed.schoolLogo !== undefined ? parsed.schoolLogo : generateSchoolLogo(),
            kopLine1: parsed.kopLine1 || 'ORGANISASI INTRA SEKOLAH (OSIS) / KLUB EKSTRAKURIKULER',
            kopLine2: parsed.kopLine2 || 'KLUB AEROMODELING & ROBOTIKA (AEROB) BONDOWOSO',
            kopLine3: parsed.kopLine3 || 'SMAN 1 BONDOWOSO',
            kopLine4: parsed.kopLine4 || 'Sekretariat: SMAN 1 Bondowoso, Jawa Timur'
          };
        } catch (e) {
          console.error('Failed to parse kop config from storage', e);
        }
      }
    }
    return {
      orgLogo: generateAerobLogo(),
      schoolLogo: generateSchoolLogo(),
      kopLine1: 'ORGANISASI INTRA SEKOLAH (OSIS) / KLUB EKSTRAKURIKULER',
      kopLine2: 'KLUB AEROMODELING & ROBOTIKA (AEROB) BONDOWOSO',
      kopLine3: 'SMAN 1 BONDOWOSO',
      kopLine4: 'Sekretariat: SMAN 1 Bondowoso, Jawa Timur'
    };
  });

  const getEnvScriptUrl = (): string => {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const env = (import.meta as any).env;
      return (
        env.VITE_SHEETS_API_URL ||
        env.VITE_APP_SCRIPT_URL ||
        env.VITE_APPS_SCRIPT_URL ||
        env.VITE_GOOGLE_SCRIPT_URL ||
        env.VITE_SCRIPT_URL ||
        env.VITE_SPREADSHEET_URL ||
        ''
      ).trim();
    }
    return '';
  };

  const [appScriptUrl, setAppScriptUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramUrl = urlParams.get('scriptUrl') || urlParams.get('appScriptUrl') || urlParams.get('script');
      if (paramUrl && paramUrl.trim().startsWith('https://')) {
        const clean = paramUrl.trim();
        localStorage.setItem('aerob_appscript_url_v1', clean);
        return clean;
      }
      const stored = localStorage.getItem('aerob_appscript_url_v1');
      if (stored && stored.trim().startsWith('https://')) {
        return stored.trim();
      }
    }
    return getEnvScriptUrl();
  });

  // Sync from Google Apps Script on mount if URL configured
  useEffect(() => {
    const activeUrl = appScriptUrl || getEnvScriptUrl();
    if (activeUrl && activeUrl.trim().startsWith('https://')) {
      handleSyncFromSpreadsheet(activeUrl);
    }
  }, []);

  const handleUpdateKopConfig = (newConfig: KopConfig) => {
    setKopConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KOP_KEY, JSON.stringify(newConfig));
    }

    // Sync config to Google Apps Script if connected so all gadgets receive updated settings
    const activeUrl = appScriptUrl || getEnvScriptUrl();
    if (activeUrl && activeUrl.trim().startsWith('https://')) {
      fetch(activeUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'saveConfig',
          config: newConfig
        })
      }).catch(err => console.error('Failed to sync Kop config to Apps Script:', err));
    }
  };

  const handleUpdateAppScriptUrl = (url: string) => {
    const cleanUrl = url.trim();
    setAppScriptUrl(cleanUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aerob_appscript_url_v1', cleanUrl);
    }
    if (cleanUrl.startsWith('https://')) {
      handleSyncFromSpreadsheet(cleanUrl);
    }
  };

  // Sync registrations & config from Google Spreadsheet API
  const handleSyncFromSpreadsheet = async (customUrl?: string): Promise<{ success: boolean; count?: number; message?: string }> => {
    const targetUrl = customUrl || appScriptUrl || getEnvScriptUrl();
    if (!targetUrl || !targetUrl.trim().startsWith('https://')) {
      return { 
        success: false, 
        message: 'URL Google Apps Script belum dikonfigurasi! Silakan masukkan URL di menu Pengaturan Kop atau tambahkan VITE_SHEETS_API_URL di Vercel Environment Variables.' 
      };
    }

    try {
      const res = await fetch(targetUrl.trim());
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      
      let itemsList: any[] = [];
      let remoteConfig: KopConfig | null = null;

      if (Array.isArray(data)) {
        if (data.length > 0 && Array.isArray(data[0])) {
          // Parse 2D raw spreadsheet rows
          const rows = data;
          if (rows.length > 1) {
            const headers: string[] = rows[0].map((h: any) => String(h).toLowerCase().trim());
            const findCol = (keywords: string[], defaultIdx: number): number => {
              const idx = headers.findIndex(h => keywords.some(kw => h.includes(kw)));
              return idx !== -1 ? idx : defaultIdx;
            };

            const idIdx = findCol(['id', 'registrasi'], 0);
            const dateIdx = findCol(['tanggal', 'date', 'waktu'], 1);
            const nisnIdx = findCol(['nisn'], 2);
            const nameIdx = findCol(['nama', 'fullname', 'lengkap'], 3);
            const parentIdx = findCol(['orang tua', 'parent', 'wali'], 4);
            const kelasIdx = findCol(['kelas', 'class'], 5);
            const tempatIdx = findCol(['tempat', 'pob'], 6);
            const tglLahirIdx = findCol(['lahir', 'dob'], 7);
            const hobiIdx = findCol(['hobi', 'hobby'], 8);
            const citaIdx = findCol(['cita', 'goal'], 9);
            const emailIdx = findCol(['email'], 10);
            const waIdx = findCol(['whatsapp', 'wa', 'hp', 'telepon'], 11);
            const instIdx = findCol(['instansi', 'sekolah', 'asal'], 12);
            const divIdx = findCol(['divisi', 'pilihan', 'division'], 13);
            const subDivIdx = findCol(['sub', 'kategori'], 14);
            const expIdx = findCol(['pemahaman', 'pengalaman', 'level'], 15);
            const motIdx = findCol(['motivasi', 'alasan'], 16);

            for (let i = 1; i < rows.length; i++) {
              const r = rows[i];
              if (r && (r[nameIdx] || r[nisnIdx])) {
                itemsList.push({
                  id: String(r[idIdx] || `REG-${i}`),
                  registrationDate: String(r[dateIdx] || ''),
                  nisn: String(r[nisnIdx] || ''),
                  fullName: String(r[nameIdx] || ''),
                  parentName: String(r[parentIdx] || ''),
                  kelas: String(r[kelasIdx] || ''),
                  tempatLahir: String(r[tempatIdx] || ''),
                  tanggalLahir: String(r[tglLahirIdx] || ''),
                  hobi: String(r[hobiIdx] || ''),
                  citaCita: String(r[citaIdx] || ''),
                  email: String(r[emailIdx] || ''),
                  whatsapp: String(r[waIdx] || ''),
                  institution: String(r[instIdx] || ''),
                  division: String(r[divIdx] || 'Aeromodeling'),
                  subDivision: String(r[subDivIdx] || ''),
                  experienceLevel: String(r[expIdx] || 'Beginner'),
                  motivation: String(r[motIdx] || '')
                });
              }
            }
          }
        } else {
          itemsList = data;
          if ((data as any).config) {
            remoteConfig = (data as any).config;
          }
        }
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.registrations)) {
          itemsList = data.registrations;
        } else if (Array.isArray(data.data)) {
          itemsList = data.data;
        } else if (Array.isArray(data.rows)) {
          itemsList = data.rows;
        }
        if (data.config && typeof data.config === 'object') {
          remoteConfig = data.config;
        }
      }

      // If remote config exists from Google Apps Script, update local kopConfig
      if (remoteConfig && typeof remoteConfig === 'object') {
        setKopConfig(prev => {
          const mergedConfig: KopConfig = {
            orgLogo: (remoteConfig.orgLogo && remoteConfig.orgLogo.trim().length > 10) ? remoteConfig.orgLogo : prev.orgLogo,
            schoolLogo: (remoteConfig.schoolLogo && remoteConfig.schoolLogo.trim().length > 10) ? remoteConfig.schoolLogo : prev.schoolLogo,
            kopLine1: (remoteConfig.kopLine1 && remoteConfig.kopLine1.trim() !== '') ? remoteConfig.kopLine1 : prev.kopLine1,
            kopLine2: (remoteConfig.kopLine2 && remoteConfig.kopLine2.trim() !== '') ? remoteConfig.kopLine2 : prev.kopLine2,
            kopLine3: (remoteConfig.kopLine3 && remoteConfig.kopLine3.trim() !== '') ? remoteConfig.kopLine3 : prev.kopLine3,
            kopLine4: (remoteConfig.kopLine4 && remoteConfig.kopLine4.trim() !== '') ? remoteConfig.kopLine4 : prev.kopLine4
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KOP_KEY, JSON.stringify(mergedConfig));
          }
          return mergedConfig;
        });
      }

      if (itemsList.length > 0 || Array.isArray(data) || (data && typeof data === 'object' && Array.isArray(data.registrations))) {
        setRegistrations(prev => {
          const existingMap = new Map<string, RegistrationData>();
          prev.forEach(item => {
            const key = item.id || `${item.fullName}-${item.nisn}`;
            existingMap.set(key, item);
          });

          itemsList.forEach((item: any) => {
            if (item.fullName && String(item.fullName).trim()) {
              const norm: RegistrationData = {
                id: String(item.id || `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`),
                fullName: String(item.fullName || ''),
                registrationDate: String(item.registrationDate || new Date().toLocaleString('id-ID')),
                nisn: String(item.nisn || ''),
                parentName: String(item.parentName || ''),
                kelas: String(item.kelas || ''),
                tempatLahir: String(item.tempatLahir || ''),
                tanggalLahir: String(item.tanggalLahir || ''),
                hobi: String(item.hobi || ''),
                citaCita: String(item.citaCita || ''),
                email: String(item.email || ''),
                whatsapp: String(item.whatsapp || ''),
                institution: String(item.institution || ''),
                division: (item.division === 'Robotics' || item.division === 'Aeromodeling') ? item.division : 'Aeromodeling',
                subDivision: (item.subDivision || 'RC Plane (Radio Control)') as SubDivisionType,
                experienceLevel: (item.experienceLevel === 'Intermediate' || item.experienceLevel === 'Advanced') ? item.experienceLevel : 'Beginner',
                motivation: String(item.motivation || '')
              };
              const key = norm.id || `${norm.fullName}-${norm.nisn}`;
              existingMap.set(key, norm);
            }
          });

          const merged = Array.from(existingMap.values());
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          }
          return merged;
        });

        return {
          success: true,
          count: itemsList.length,
          message: remoteConfig 
            ? `Berhasil menyingkronkan ${itemsList.length} pendaftar dan Pengaturan Kop dari Google Spreadsheet!` 
            : `Berhasil menyingkronkan ${itemsList.length} pendaftar dari Google Spreadsheet!`
        };
      } else if (data && typeof data === 'object' && data.message) {
        return {
          success: false,
          message: `Keterangan Apps Script: "${data.message}".`
        };
      } else {
        return {
          success: false,
          message: 'Format data dari Google Spreadsheet tidak valid.'
        };
      }
    } catch (err: any) {
      console.error('Error syncing from Google Spreadsheet:', err);
      return {
        success: false,
        message: 'Gagal mengambil data dari Google Spreadsheet. Pastikan URL Web App benar dan Akses disetel ke "Siapa Saja (Anyone)".'
      };
    }
  };

  // Auto-sync from Google Spreadsheet on initial load or URL change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('scriptUrl') || params.get('appScriptUrl') || params.get('script');
      if (urlParam && urlParam.trim().startsWith('https://')) {
        const cleanUrl = urlParam.trim();
        setAppScriptUrl(cleanUrl);
        handleSyncFromSpreadsheet(cleanUrl);
        return;
      }
    }

    if (appScriptUrl && appScriptUrl.trim().startsWith('https://')) {
      handleSyncFromSpreadsheet(appScriptUrl);
    }
  }, [appScriptUrl]);

  // Initial registrations on mount with LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setRegistrations(JSON.parse(stored));
          return;
        } catch (e) {
          console.error('Failed to parse registrations', e);
        }
      }
    }
    setRegistrations(MOCK_REGISTRATIONS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
    }
  }, []);

  // Save registration helper
  const handleAddRegistration = (newData: RegistrationData) => {
    const updated = [newData, ...registrations];
    setRegistrations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Delete registration helper
  const handleDeleteRegistration = (id: string) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Clear all database
  const handleClearAll = () => {
    setRegistrations([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
  };

  // Seed mock registrations helper
  const handleSeedMockData = () => {
    setRegistrations(MOCK_REGISTRATIONS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
    }
  };

  // Start registration helper from Hero card click
  const handleLaunchRegistration = (division: DivisionType) => {
    setSelectedDivision(division);
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col justify-between">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-[#eef2f7]/95 backdrop-blur-md border-b border-slate-200/50 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Organization Logo Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('beranda')}>
            <div className="flex items-center gap-2">
              {kopConfig.schoolLogo && (
                <img 
                  src={kopConfig.schoolLogo} 
                  alt="Logo Sekolah" 
                  className="w-10 h-10 object-contain rounded-xl bg-white/90 p-1 shadow-md border border-slate-200/80 group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              )}
              {kopConfig.orgLogo && (
                <img 
                  src={kopConfig.orgLogo} 
                  alt="Logo Organisasi" 
                  className="w-10 h-10 object-contain rounded-xl bg-white/90 p-1 shadow-md border border-slate-200/80 group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              )}
              {!kopConfig.schoolLogo && !kopConfig.orgLogo && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md border border-white/20">
                  <Plane className="w-5 h-5 absolute -translate-y-1 translate-x-1" />
                  <Cpu className="w-4 h-4 absolute translate-y-2 -translate-x-1" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-slate-800 font-display">AEROB</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                {kopConfig.kopLine3 || 'Aeromodeling & Robotic'}
              </p>
            </div>
          </div>

          {/* Interactive Neumorphic Navigation Menu & Admin Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <nav className="flex items-center gap-2 bg-[#e6ebf3] p-1.5 rounded-xl shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.4),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)]">
              <button
                id="nav-home"
                onClick={() => setActiveTab('beranda')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeTab === 'beranda'
                    ? 'bg-white text-blue-600 shadow-sm shadow-blue-500/5'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <Home className="w-3.5 h-3.5" /> Beranda
              </button>
              
              {/* Only show Admin Panel tab when successfully logged in */}
              {isAdminLoggedIn && (
                <button
                  id="nav-admin"
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    activeTab === 'admin'
                      ? 'bg-white text-blue-600 shadow-sm shadow-blue-500/5'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                </button>
              )}
            </nav>

            {/* Quick Actions / Auth Status */}
            <div className="flex items-center gap-2">
              {isAdminLoggedIn && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
                    Admin Active
                  </span>
                  <button
                    id="header-btn-logout"
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setActiveTab('beranda');
                    }}
                    className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Body Section */}
      <main className="flex-grow py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'beranda' && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSection 
                onOpenRegister={() => setIsRegisterOpen(true)}
                onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
                kopConfig={kopConfig}
              />
            </motion.div>
          )}

          {activeTab === 'admin' && isAdminLoggedIn && (
            <motion.div
              key="admin-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AdminPanel
                registrations={registrations}
                onDeleteRegistration={handleDeleteRegistration}
                onClearAll={handleClearAll}
                onSeedMockData={handleSeedMockData}
                kopConfig={kopConfig}
                onUpdateKopConfig={handleUpdateKopConfig}
                appScriptUrl={appScriptUrl}
                onUpdateAppScriptUrl={handleUpdateAppScriptUrl}
                onSyncFromSpreadsheet={handleSyncFromSpreadsheet}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Neumorphic Footer */}
      <footer className="bg-[#eef2f7] border-t border-slate-200/50 py-8 px-6 text-center text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs md:text-sm">
            <p className="font-bold text-slate-700">AEROB (Aeromodeling & Robotic)</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            © 2026 AEROB
          </div>
        </div>
      </footer>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#eef2f7] w-full max-w-3xl rounded-[32px] p-2 shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto"
            >
              <RegistrationForm
                initialDivision={selectedDivision}
                onBack={() => setIsRegisterOpen(false)}
                onAddRegistration={handleAddRegistration}
                kopConfig={kopConfig}
                appScriptUrl={appScriptUrl}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal Overlay */}
      <AnimatePresence>
        {isAdminLoginOpen && (
          <AdminLogin
            onClose={() => setIsAdminLoginOpen(false)}
            onLoginSuccess={() => {
              setIsAdminLoggedIn(true);
              setActiveTab('admin');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
