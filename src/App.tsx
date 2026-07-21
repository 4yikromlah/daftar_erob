import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Cpu, ShieldCheck, Home, FileText, ClipboardList,
  Sparkles, CheckCircle2, ChevronRight, Copy, Check
} from 'lucide-react';
import { RegistrationData, DivisionType, KopConfig } from './types';
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

  const [kopConfig, setKopConfig] = useState<KopConfig>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KOP_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse kop config', e);
        }
      }
    }
    return {
      orgLogo: '',
      schoolLogo: '',
      kopLine1: 'ORGANISASI INTRA SEKOLAH (OSIS) / KLUB EKSTRAKURIKULER',
      kopLine2: 'KLUB AEROMODELING & ROBOTIKA (AEROB) MALANG',
      kopLine3: 'SEKOLAH MENENGAH ATAS NEGERI 3 MALANG',
      kopLine4: 'Sekretariat: Jl. Tugu No. 18, Malang, Jawa Timur. Telp/WA: 081234567890'
    };
  });

  const [appScriptUrl, setAppScriptUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aerob_appscript_url_v1') || (import.meta as any).env.VITE_SHEETS_API_URL || '';
    }
    return (import.meta as any).env.VITE_SHEETS_API_URL || '';
  });

  // Generate logos on mount if missing
  useEffect(() => {
    if (!kopConfig.orgLogo || !kopConfig.schoolLogo) {
      const defaultOrg = generateAerobLogo();
      const defaultSchool = generateSchoolLogo();
      const updated = {
        ...kopConfig,
        orgLogo: kopConfig.orgLogo || defaultOrg,
        schoolLogo: kopConfig.schoolLogo || defaultSchool
      };
      setKopConfig(updated);
      localStorage.setItem(LOCAL_STORAGE_KOP_KEY, JSON.stringify(updated));
    }
  }, []);

  const handleUpdateKopConfig = (newConfig: KopConfig) => {
    setKopConfig(newConfig);
    localStorage.setItem(LOCAL_STORAGE_KOP_KEY, JSON.stringify(newConfig));
  };

  const handleUpdateAppScriptUrl = (url: string) => {
    setAppScriptUrl(url);
    localStorage.setItem('aerob_appscript_url_v1', url);
  };

  // Load registrations from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setRegistrations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse registrations', e);
        setRegistrations([]);
      }
    } else {
      // Initialize with mock data to make the app looks great instantly
      setRegistrations(MOCK_REGISTRATIONS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
    }
  }, []);

  // Save registration helper
  const handleAddRegistration = (newData: RegistrationData) => {
    const updated = [newData, ...registrations];
    setRegistrations(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Delete registration helper
  const handleDeleteRegistration = (id: string) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Clear all database
  const handleClearAll = () => {
    setRegistrations([]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  };

  // Seed mock registrations helper
  const handleSeedMockData = () => {
    setRegistrations(MOCK_REGISTRATIONS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('beranda')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md border border-white/20">
              <Plane className="w-5 h-5 absolute -translate-y-1 translate-x-1" />
              <Cpu className="w-4 h-4 absolute translate-y-2 -translate-x-1" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-slate-800 font-display">AEROB</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold font-mono px-2 py-0.5 rounded-full">CLUB</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Aeromodeling & Robotic</p>
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Neumorphic Footer */}
      <footer className="bg-[#eef2f7] border-t border-slate-200/50 py-8 px-6 text-center text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs md:text-sm">
            <p className="font-bold text-slate-700">AEROB (Aeromodeling & Robotic Club)</p>
            <p className="text-slate-400 mt-1">Gedung Pusat Kreativitas Mahasiswa, Kavling Dirgantara No. 12</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            © 2026 AEROB. All Rights Reserved. Crafted with React & Tailwind CSS.
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
