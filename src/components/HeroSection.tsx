import { motion } from 'motion/react';
import { 
  Plane, Cpu, Compass, Zap, Users, BookOpen, 
  Calendar, MapPin, CheckCircle, ChevronRight, HelpCircle, 
  Laptop, Sparkles, MessageCircle, ChevronDown, Check, ArrowRight 
} from 'lucide-react';
import { useState } from 'react';
import { DivisionType } from '../types';

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenAdminLogin: () => void;
}

export default function HeroSection({ onOpenRegister, onOpenAdminLogin }: HeroSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const facilities = [
    {
      icon: <Plane className="w-5 h-5 text-blue-600" />,
      title: "Wind Tunnel & Flight Simulator",
      desc: "Uji coba aerodinamika sayap pesawat model dan simulasi terbang realistik menggunakan remote control pemancar asli.",
      comingSoon: true
    },
    {
      icon: <Cpu className="w-5 h-5 text-orange-600" />,
      title: "IoT & Robotic Prototyping Lab",
      desc: "Dilengkapi dengan kit mikrokontroler lengkap (Arduino Uno, Nano, ESP32, Raspberry Pi) beserta ratusan sensor & aktuator."
    },
    {
      icon: <Laptop className="w-5 h-5 text-indigo-600" />,
      title: "3D Printing & CAD Station",
      desc: "Stasiun komputer berspesifikasi tinggi untuk mendesain CAD 3D dan mesin 3D Printer presisi untuk fabrikasi langsung chassis robot & aerofoil.",
      comingSoon: true
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      title: "Workstation Solder & Kalibrasi",
      desc: "Peralatan solder temperatur terkontrol, multimeter presisi, osiloskop digital, dan peralatan safety sirkuit."
    }
  ];

  const schedules = [
    {
      day: "Kamis",
      time: "15:30 - 17:30 WIB",
      type: "Kelas Teori & Simulasi CAD",
      place: "Lab Desain Komputer (Gedung B Lt. 3)",
      desc: "Membahas konsep dasar aerodinamika, pemrograman mikrokomputer, sirkuit IoT, dan perancangan desain 3D CAD."
    }
  ];

  const faqs = [
    {
      question: "Apakah saya harus memiliki latar belakang pemrograman atau kedirgantaraan?",
      answer: "Sama sekali tidak! AEROB dirancang terbuka bagi pemula. Kami memiliki silabus dasar mingguan yang membimbing Anda mulai dari nol—dari memegang solder & mengunggah kode pertama Anda, hingga merakit sasis pesawat model mandiri."
    },
    {
      question: "Apakah komponen praktek robotika & pesawat disediakan secara gratis?",
      answer: "Ya! Semua peralatan penunjang utama seperti kit Arduino, sensor sirkuit, baterai LiPo, 3D printer, balsa wood, dan remote control pemancar disediakan oleh klub di laboratorium pengerjaan."
    },
    {
      question: "Bagaimana proses seleksi penerimaan anggota baru?",
      answer: "Pendaftaran terpadu ini tidak melakukan eliminasi fisik. Proses administrasi dan wawancara singkat murni ditujukan untuk memetakan minat dasar Anda (apakah condong ke Aeromodeling atau Robotics) agar distribusi kelompok belajar dapat berjalan seimbang."
    },
    {
      question: "Dapatkah saya mengikuti kedua divisi sekaligus?",
      answer: "Tentu saja! Kurikulum utama kami terintegrasi. Sebagai contoh, anggota Robotics dapat berkolaborasi mendesain sistem autopilot (Autonomous Drone), sementara anggota Aeromodeling menyusun mekanika aerodinamika wahana."
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-16">
      
      {/* Brand Header */}
      <motion.div
        id="hero-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-4">
          {/* AEROB Logo Icon (Claymorphic Style) */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-white/30 relative overflow-hidden group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:10px_10px]"
            />
            <Plane className="w-6 h-6 absolute -translate-y-1.5 translate-x-1.5 text-white/95" />
            <Cpu className="w-5 h-5 absolute translate-y-2.5 -translate-x-1.5 text-white/90" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent font-display">
              AEROB
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              Aeromodeling & Robotic Club
            </p>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-400 max-w-md mx-auto mb-2 uppercase tracking-widest font-bold">
          Ekstrakurikuler Teknologi Terpadu
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800 font-display mt-1 leading-tight">
          Terbangkan Mimpi, Bangun Masa Depan Otomasi
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mt-4 leading-relaxed">
          Platform eksplorasi teknologi terbaik untuk merancang pesawat model aerodinamis bersayap tetap hingga memprogram robotika cerdas bertenaga mikrokomputer & IoT.
        </p>


      </motion.div>

      {/* Main Divisions Overview Cards */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            DUAL SPESIALISASI UTAMA
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 font-display">
            Mengenal Divisi Unggulan AEROB
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Kami mengintegrasikan dua disiplin ilmu rekayasa terpopuler untuk menghasilkan kolaborasi teknologi terbaik.
          </p>
        </div>

        <div id="division-showcases" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aeromodeling Division Card */}
          <motion.div
            id="aeromodeling-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="clay-card-blue p-8 relative overflow-hidden flex flex-col justify-between group h-auto min-h-[380px]"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl" />
            
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-wider font-mono">
                  Aerodynamics
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 uppercase tracking-wider font-mono">
                  RC Aircraft
                </span>
              </div>

              <div className="flex items-start justify-between mt-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 font-display">
                    DIVISI AEROMODELING
                  </h4>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Aeronautika • RC Flight • Drone Specs
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-white/50">
                  <Plane className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Fokus mempelajari aerodinamika, kalkulasi gaya angkat, simulasi terbang komputer, teknik pembuatan bodi pesawat berbahan Balsa/Polyfoam, transmisi Radio Control (RC), hingga peluncuran roket air dengan kalkulasi tekanan air & angin secara komputasi.
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-blue-500" /> RC Plane Glider & Jet Sport
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-blue-500" /> Drone FPV Racing & Aerial Simulator
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-blue-500" /> Water Rocket Launch & Tracking Telemetry
                </div>
              </div>
            </div>
          </motion.div>

          {/* Robotics Division Card */}
          <motion.div
            id="robotics-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="clay-card-orange p-8 relative overflow-hidden flex flex-col justify-between group h-auto min-h-[380px]"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-400/10 rounded-full blur-xl" />

            <div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20 uppercase tracking-wider font-mono">
                  Mekatronika
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 uppercase tracking-wider font-mono">
                  Smart Automation
                </span>
              </div>

              <div className="flex items-start justify-between mt-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 font-display">
                    DIVISI ROBOTICS
                  </h4>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Microcontroller • IoT Sensors • Actuators
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 border border-white/50">
                  <Cpu className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Fokus menyelami arsitektur mikrokontroler Arduino Uno, ESP32 untuk Internet of Things (IoT), pembuatan algoritma PID pada robot pengikut garis (Line Follower) otomatis, perakitan mekanis robot tempur (Battlebot), serta integrasi sensor pintar nirkabel.
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-orange-500" /> Line Follower Robot (Analog & PID Digital)
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-orange-500" /> Battlebot Arena & Wireless Controller
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-orange-500" /> IoT Smart Automation & Cloud Database
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            DURABILITAS & AKSES LABORATORIUM
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 font-display">
            Fasilitas Laboratorium & Alat Lengkap
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Anggota AEROB mendapatkan hak akses penuh ke fasilitas pendukung pengerjaan proyek tingkat tinggi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac, idx) => (
            <div key={idx} className="neu-flat p-6 rounded-2xl border border-white/60 flex items-start gap-4 relative overflow-hidden">
              {fac.comingSoon && (
                <span className="absolute top-3 right-4 text-[9px] font-mono font-black text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 uppercase tracking-wider">
                  Coming Soon
                </span>
              )}
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 self-start">
                {fac.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-base">{fac.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            JADWAL KEGIATAN RUTIN
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 font-display">
            Agenda Pembelajaran & Latihan Mingguan
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Sesi terstruktur yang menyeimbangkan teori komputasi di dalam kelas dengan praktek uji coba di lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((sch, idx) => (
            <div key={idx} className="neu-flat p-6 rounded-2xl border border-white/60 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 text-white text-xs font-mono font-extrabold px-3 py-1 rounded-lg">
                    Hari {sch.day}
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold">{sch.time}</span>
                </div>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-800 text-base font-display">{sch.type}</h4>
                <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold bg-indigo-50 w-fit px-2.5 py-0.5 rounded-md border border-indigo-100">
                  <MapPin className="w-3 h-3" /> {sch.place}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {sch.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            JAWABAN PERTANYAAN POPULER
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 font-display">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Pertanyaan yang paling sering diajukan oleh calon anggota baru AEROB.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="neu-flat rounded-2xl overflow-hidden border border-white/60 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-700 text-sm md:text-base hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic CTA Footer Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="clay-card-blue p-8 md:p-12 text-center relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-60" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/80 text-blue-700 border border-white font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> PENDAFTARAN ANGGOTA BARU 2026
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 font-display leading-tight">
            Siap Mengembangkan Keahlian Rekayasa Teknologi Anda?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Formulir pendaftaran sekarang digabungkan menjadi satu tanpa pemisahan divisi yang rumit. Amankan slot Anda sekarang dan hadiri kelas pengenalan perdana kami.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button 
              onClick={onOpenRegister}
              className="clay-btn-blue px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:clay-btn-blue-hover transition-all duration-200"
            >
              Buka Form Pendaftaran <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenAdminLogin}
              className="clay-btn-gray px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:clay-btn-gray-hover transition-all duration-200"
            >
              Kelola Database Admin
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
