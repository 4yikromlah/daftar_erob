import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, X, Key, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onClose, onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Kredensial default sesuai spesifikasi premium
    if (username === 'admin_aerob' && password === 'aerob2026') {
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 1000);
    } else {
      // Trigger shake animation
      setIsShake(true);
      setError('Kredensial salah! Silakan coba lagi.');
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        id="admin-login-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          x: isShake ? [-10, 10, -10, 10, -5, 5, 0] : 0
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#e0e5ec] w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-white/50 overflow-hidden"
      >
        {/* Decorative background blurs */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-orange-500/10 rounded-full blur-xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md mb-3 border border-white/20">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-600 tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase">
            Sistem Proteksi AEROB
          </span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-2">
            Autentikasi Administrator
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Silakan masukkan kredensial administrator klub Anda untuk mengelola pendaftaran anggota.
          </p>
        </div>

        {/* Success Splash */}
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-3 py-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle className="w-8 h-8 animate-bounce" />
              </div>
              <p className="font-extrabold text-slate-800 text-sm">Berhasil Masuk!</p>
              <p className="text-slate-400 text-xs font-mono">Membuka database terpadu...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin_aerob"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-700 bg-[#edf2f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] focus:shadow-[inset_3px_3px_6px_#b8c4d6,inset_-3px_-3px_6px_#ffffff] focus:outline-none transition-all duration-200 border border-transparent focus:border-blue-300 text-sm"
                  />
                </div>
              </div>

              {/* Help Hint */}
              <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/50 text-[10px] text-slate-500 leading-normal font-mono flex items-start gap-1.5 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-indigo-700">Petunjuk Akses:</span>
                  <br />
                  Username: <code className="bg-slate-200 px-1 rounded font-bold">admin_aerob</code>
                  <br />
                  Password: <code className="bg-slate-200 px-1 rounded font-bold">aerob2026</code>
                </div>
              </div>

              {/* Error messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="clay-btn-blue w-full py-3 text-sm font-extrabold hover:clay-btn-blue-hover transition-all duration-200 shadow-md"
              >
                Masuk ke Panel Admin
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
