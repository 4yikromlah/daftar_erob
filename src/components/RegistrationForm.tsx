import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Cpu, ArrowLeft, CheckCircle2, Send, Sparkles, HelpCircle, X, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { RegistrationData, DivisionType, SubDivisionType, ExperienceLevel, KopConfig } from '../types';

interface RegistrationFormProps {
  initialDivision: DivisionType;
  onBack: () => void;
  onAddRegistration: (data: RegistrationData) => void;
  kopConfig: KopConfig;
  appScriptUrl?: string;
}

export default function RegistrationForm({ 
  initialDivision, 
  onBack, 
  onAddRegistration, 
  kopConfig,
  appScriptUrl
}: RegistrationFormProps) {
  const [division, setDivision] = useState<DivisionType>(initialDivision);
  const [nisn, setNisn] = useState('');
  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [kelas, setKelas] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [hobi, setHobi] = useState('');
  const [citaCita, setCitaCita] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [institution, setInstitution] = useState('');
  const [subDivision, setSubDivision] = useState<SubDivisionType>(
    initialDivision === 'Aeromodeling' ? 'RC Plane (Radio Control)' : 'Line Follower Robot'
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Beginner');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<RegistrationData | null>(null);

  // Unified list of all sub-divisions for a single joint registration process
  const allSubDivisions: { name: SubDivisionType; division: DivisionType; desc: string }[] = [
    { name: 'RC Plane (Radio Control)', division: 'Aeromodeling', desc: 'Aeronautika, RC fixed-wing & rancang bangun pesawat' },
    { name: 'Line Follower Robot', division: 'Robotics', desc: 'Robot pelacak jalur otomatis dengan sensor & mikrokontroler' },
    { name: 'Battlebot Robot', division: 'Robotics', desc: 'Robot petarung mekatronika, armor metal & motor torsi tinggi' },
    { name: 'Autonomous Drone Programming', division: 'Robotics', desc: 'Pemrograman sistem autopilot, computer vision & IoT' },
    { name: 'Creative IoT Robot', division: 'Robotics', desc: 'Sistem otomasi rumah cerdas & integrasi cloud sensor' },
  ];

  const handleSelectSubDivision = (subName: SubDivisionType, divName: DivisionType) => {
    setSubDivision(subName);
    setDivision(divName);
  };

  const handleDownloadTicket = () => {
    if (!registeredData) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- Custom Kop / Header ---
      if (kopConfig?.orgLogo) {
        try {
          doc.addImage(kopConfig.orgLogo, 'PNG', 15, 11, 16, 16);
        } catch (e) {
          console.error('Failed to add org logo to PDF', e);
        }
      }
      if (kopConfig?.schoolLogo) {
        try {
          doc.addImage(kopConfig.schoolLogo, 'PNG', 179, 11, 16, 16);
        } catch (e) {
          console.error('Failed to add school logo to PDF', e);
        }
      }

      // Draw Kop Lines
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text((kopConfig?.kopLine1 || 'ORGANISASI EKSTRAKURIKULER').toUpperCase(), 105, 13, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text((kopConfig?.kopLine2 || 'KLUB AEROMODELING & ROBOTIKA (AEROB)').toUpperCase(), 105, 18, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(kopConfig?.kopLine3 || 'SEKOLAH MENENGAH ATAS', 105, 23, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(kopConfig?.kopLine4 || 'Sekretariat Gedung Kreativitas', 105, 27, { align: 'center' });

      // Draw double line kop border
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.6);
      doc.line(15, 30.5, 195, 30.5);
      doc.setLineWidth(0.2);
      doc.line(15, 31.5, 195, 31.5);

      // --- Part 1: Registration Details (Bagian Atas) ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('I. DATA DIRI & DETAIL PENDAFTARAN', 15, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);

      let startY = 45;
      const lineHeight = 7.0;
      const leftCol = 15;
      const rightCol = 65;

      const details = [
        ['ID Registrasi', registeredData.id],
        ['Tanggal Daftar', registeredData.registrationDate],
        ['NISN', registeredData.nisn],
        ['Nama Lengkap', registeredData.fullName],
        ['Nama Orang Tua / Wali', registeredData.parentName],
        ['Kelas', registeredData.kelas],
        ['Tempat, Tanggal Lahir', `${registeredData.tempatLahir}, ${registeredData.tanggalLahir}`],
        ['Hobi', registeredData.hobi],
        ['Cita-cita', registeredData.citaCita],
        ['Email', registeredData.email],
        ['WhatsApp', registeredData.whatsapp],
        ['Asal Instansi / Sekolah', registeredData.institution],
        ['Divisi Pilihan', `${registeredData.division} (${registeredData.subDivision})`],
        ['Tingkat Pemahaman', registeredData.experienceLevel],
      ];

      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(`${label}`, leftCol, startY);
        doc.text(':', rightCol - 5, startY);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(`${value}`, rightCol, startY);
        startY += lineHeight;
      });

      // Motivation
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Motivasi Bergabung', leftCol, startY);
      doc.text(':', rightCol - 5, startY);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(51, 65, 85);
      const splitMotivation = doc.splitTextToSize(registeredData.motivation || '-', 130);
      doc.text(splitMotivation, rightCol, startY);

      // --- Part 2: Dotted Divider (Garis Putus-Putus) ---
      const dividerY = 162;
      doc.setDrawColor(148, 163, 184); // slate-400
      doc.setLineDashPattern([2, 2], 0);
      doc.setLineWidth(0.5);
      doc.line(15, dividerY, 195, dividerY);
      doc.setLineDashPattern([], 0); // Reset line dash

      // Add a cut indicator icon text or scissors symbol
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Gunting di sini untuk lembar persetujuan fisik (diberikan kepada pembina)', 105, dividerY - 2, { align: 'center' });

      // --- Part 3: Parental Consent (Bagian Bawah) ---
      const pStartY = dividerY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('II. PERNYATAAN PERSETUJUAN ORANG TUA / WALI SISWA', 15, pStartY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const statementText = `Saya yang bertanda tangan di bawah ini selaku Orang Tua / Wali dari siswa bernama ${registeredData.fullName} (NISN: ${registeredData.nisn}, Kelas: ${registeredData.kelas}), menyatakan memberikan persetujuan sepenuhnya kepada anak saya untuk mendaftar, bergabung, dan mengikuti seluruh kegiatan ekstrakurikuler serta pelatihan teknologi di Klub Aeromodeling & Robotika (AEROB) Sekolah Menengah untuk tahun ajaran 2026/2027.`;
      
      const splitStatement = doc.splitTextToSize(statementText, 180);
      doc.text(splitStatement, 15, pStartY + 8);

      // --- Signatures Section ---
      const sigY = pStartY + 45;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      // Date location
      const dateStr = `Bondowoso, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`;
      doc.text(dateStr, 150, sigY, { align: 'center' });

      // Labels should be in normal (regular) font-weight to match the image exactly
      doc.text('Siswa Pendaftar,', 50, sigY + 8, { align: 'center' });
      doc.text('Orang Tua / Wali,', 150, sigY + 8, { align: 'center' });

      // Clean formatted names inside parentheses with normal bold style
      doc.setFont('helvetica', 'bold');
      doc.text(`( ${registeredData.fullName} )`, 50, sigY + 34, { align: 'center' });
      doc.text(`( ${registeredData.parentName} )`, 150, sigY + 34, { align: 'center' });

      // Save PDF
      doc.save(`Formulir_Pendaftaran_AEROB_${registeredData.id}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Terjadi kesalahan saat mengunduh PDF.');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn || !fullName || !parentName || !kelas || !tempatLahir || !tanggalLahir || !hobi || !citaCita || !email || !whatsapp || !institution || !motivation) {
      alert('Mohon lengkapi semua field form pendaftaran!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate unique ID with AEROB prefix
      const randomId = 'AEROB-' + Math.floor(1000 + Math.random() * 9000);
      const newEntry: RegistrationData = {
        id: randomId,
        nisn,
        fullName,
        parentName,
        kelas,
        tempatLahir,
        tanggalLahir,
        hobi,
        citaCita,
        email,
        whatsapp,
        institution,
        division,
        subDivision,
        experienceLevel,
        motivation,
        registrationDate: new Date().toLocaleString('id-ID'),
      };

      // If Google Apps Script URL is provided, send the new registration in the background
      if (appScriptUrl && appScriptUrl.trim().startsWith('https://')) {
        fetch(appScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(newEntry)
        }).catch((err) => {
          console.error('Failed to sync to Google Sheets:', err);
        });
      }

      onAddRegistration(newEntry);
      setRegisteredData(newEntry);
      setIsSubmitting(false);
    }, 1200); // realistic mock server delay
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Formulir Registrasi
        </span>
        <motion.button
          id="btn-back-home"
          onClick={onBack}
          className="clay-btn-gray px-4 py-2 text-xs flex items-center gap-2 font-semibold hover:clay-btn-gray-hover transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 text-slate-500" /> Tutup Formulir
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!registeredData ? (
          <motion.div
            id="registration-card-form"
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="neu-flat rounded-[32px] p-6 md:p-10 border border-white/50"
          >
            {/* Form Title & Decorative Headers */}
            <div className="text-center mb-8">
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                FORMULIR PENDAFTARAN ANGGOTA BARU 2026
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-3 font-display">
                Bergabung Bersama AEROB
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Isi data diri Anda di bawah ini secara lengkap untuk memulai perjalanan teknologi dirgantara & mekatronika.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Data Fields */}
              <div className="space-y-4">
                {/* NISN Input */}
                <div>
                  <label htmlFor="nisn" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    NISN (Nomor Induk Siswa Nasional) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nisn"
                    type="text"
                    required
                    placeholder="Contoh: 0081234567"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>

                {/* Nama Lengkap Input */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rafli"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>

                {/* Nama Orang Tua / Wali Input */}
                <div>
                  <label htmlFor="parentName" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>

                {/* Kelas Input */}
                <div>
                  <label htmlFor="kelas" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="kelas"
                    type="text"
                    required
                    placeholder="Contoh: SMPN ........."
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>

                {/* Tempat Lahir & Tanggal Lahir (Grid 2 Kolom) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tempatLahir" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tempatLahir"
                      type="text"
                      required
                      placeholder="Contoh: Malang"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggalLahir" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tanggalLahir"
                      type="date"
                      required
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm text-slate-500"
                    />
                  </div>
                </div>

                {/* Hobi & Cita-Cita (Grid 2 Kolom) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hobi" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Hobi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hobi"
                      type="text"
                      required
                      placeholder="Contoh: Robotik, Membaca, Berenang"
                      value={hobi}
                      onChange={(e) => setHobi(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="citaCita" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Cita-cita <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="citaCita"
                      type="text"
                      required
                      placeholder="Contoh: Aerospace Engineer, Programmer"
                      value={citaCita}
                      onChange={(e) => setCitaCita(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Email Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="institution" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Asal Sekolah <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="institution"
                    type="text"
                    required
                    placeholder="Contoh: SMP Negeri 1 Malang"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>
              </div>


              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tingkat Pemahaman Bidang <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((level) => {
                    const isSelected = experienceLevel === level;
                    let activeStyles = '';
                    if (isSelected) {
                      if (level === 'Beginner') activeStyles = 'bg-emerald-500 text-white shadow-md shadow-emerald-200';
                      if (level === 'Intermediate') activeStyles = 'bg-amber-500 text-white shadow-md shadow-amber-200';
                      if (level === 'Advanced') activeStyles = 'bg-rose-500 text-white shadow-md shadow-rose-200';
                    } else {
                      activeStyles = 'bg-[#f4f7fa] text-slate-600 border border-slate-200 hover:bg-slate-50';
                    }

                    return (
                      <button
                        id={`exp-${level.toLowerCase()}`}
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold text-center transition-all duration-300 ${activeStyles}`}
                      >
                        {level === 'Beginner' && 'Pemula (Belum Paham)'}
                        {level === 'Intermediate' && 'Menengah (Bisa Sedikit)'}
                        {level === 'Advanced' && 'Mahir (Pernah Membuat)'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label htmlFor="motivation" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Motivasi Bergabung <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  rows={4}
                  required
                  placeholder="Ceritakan ketertarikan Anda dalam merakit robot/pesawat, proyek yang ingin dicapai, atau mimpi teknologi Anda..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                id="btn-submit-registration"
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl cursor-pointer ${
                  division === 'Aeromodeling' ? 'clay-btn-blue hover:clay-btn-blue-hover' : 'clay-btn-orange hover:clay-btn-orange-hover'
                } transition-all duration-200`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses Pendaftaran...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Kirim Formulir Pendaftaran AEROB
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* Submission Success Screen */
          <motion.div
            id="registration-success-card"
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="neu-flat rounded-[32px] p-8 md:p-12 text-center border-2 border-emerald-400/30"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-pulse" />
            </div>

            <span className="text-xs font-mono font-bold text-emerald-600 tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              PENDAFTARAN SELESAI & SUKSES
            </span>

            <h2 className="text-3xl font-extrabold text-slate-800 mt-4 font-display">
              Selamat, {registeredData.fullName}!
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Data Anda telah tersimpan dengan aman dalam sistem registrasi lokal AEROB{appScriptUrl ? ' dan disinkronisasikan ke Google Spreadsheet' : ''}.
            </p>

            {/* Claymorphic Code Box */}
            <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-white max-w-sm mx-auto shadow-sm">
              <p className="text-xs font-mono text-indigo-500 uppercase tracking-widest font-bold">
                ID Registrasi Unik Anda
              </p>
              <h3 className="text-3xl font-black text-slate-800 font-mono tracking-wider mt-2 bg-slate-100/80 inline-block px-4 py-2 rounded-xl border shadow-inner">
                {registeredData.id}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2">
                Simpan ID ini sebagai tanda bukti pendaftaran Anda.
              </p>
            </div>

            {/* Registration details table (Clean and high contrast) */}
            <div className="text-left bg-[#f3f6fa] rounded-2xl p-6 mb-4 max-w-lg mx-auto shadow-inner space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono border-b pb-2 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Ringkasan Pendaftaran
              </h4>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">NISN</span>
                <span className="col-span-2 font-mono font-bold text-slate-800">{registeredData.nisn}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Nama Lengkap</span>
                <span className="col-span-2 font-bold text-slate-800">{registeredData.fullName}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Orang Tua / Wali</span>
                <span className="col-span-2 font-bold text-slate-800">{registeredData.parentName}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Kelas</span>
                <span className="col-span-2 font-bold text-slate-800">{registeredData.kelas}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400 font-sans">Tempat, Tgl Lahir</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {registeredData.tempatLahir}, {registeredData.tanggalLahir}
                </span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400 font-sans">Hobi</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {registeredData.hobi}
                </span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400 font-sans">Cita-cita</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {registeredData.citaCita}
                </span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Pilihan Divisi</span>
                <span className="col-span-2 font-bold text-slate-800 flex items-center gap-1">
                  {registeredData.division === 'Aeromodeling' ? (
                    <Plane className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <Cpu className="w-3.5 h-3.5 text-orange-500" />
                  )}
                  {registeredData.division} ({registeredData.subDivision})
                </span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Asal Instansi</span>
                <span className="col-span-2 font-bold text-slate-800">{registeredData.institution}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Kontak WhatsApp</span>
                <span className="col-span-2 font-mono font-bold text-slate-800">{registeredData.whatsapp}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Email Aktif</span>
                <span className="col-span-2 font-mono font-bold text-slate-800">{registeredData.email}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-400">Tingkat Pengalaman</span>
                <span className="col-span-2 font-bold text-slate-800">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] text-white ${
                    registeredData.experienceLevel === 'Beginner' ? 'bg-emerald-500' :
                    registeredData.experienceLevel === 'Intermediate' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {registeredData.experienceLevel}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 text-xs border-t pt-2 mt-2">
                <span className="text-slate-400">Motivasi</span>
                <span className="col-span-2 text-slate-700 italic font-medium">"{registeredData.motivation}"</span>
              </div>
            </div>

            {/* Print & Download Buttons underneath */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
              <button
                id="btn-download-bukti"
                onClick={handleDownloadTicket}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 active:bg-blue-200 border border-blue-200 text-blue-700 transition-all text-xs font-bold shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                Unduh Formulir (PDF)
              </button>
              <button
                id="btn-print-bukti"
                onClick={handlePrintTicket}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 active:bg-indigo-200 border border-indigo-200 text-indigo-700 transition-all text-xs font-bold shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                Cetak Formulir
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                id="btn-back-success"
                onClick={() => {
                  setNisn('');
                  setFullName('');
                  setParentName('');
                  setKelas('');
                  setTempatLahir('');
                  setTanggalLahir('');
                  setHobi('');
                  setCitaCita('');
                  setEmail('');
                  setWhatsapp('');
                  setInstitution('');
                  setMotivation('');
                  setRegisteredData(null);
                  onBack();
                }}
                className="clay-btn-gray px-8 py-3 font-semibold hover:clay-btn-gray-hover transition-all duration-200 text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
