
import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  onLogin: (role: UserRole, email: string) => void;
  onRegisterClick: () => void;
}

const Login: React.FC<Props> = ({ lang, onLogin, onRegisterClick }) => {
  const t = translations[lang];
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole, email);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-red-50/30 px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-red-200/50 border border-red-50 overflow-hidden flex flex-col">
        <div className="p-10 sm:p-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 text-3xl">🔑</div>
            <h1 className="text-3xl font-black text-brand-maroon mb-2">{t.welcomeBack}</h1>
            <p className="text-slate-400">Masuk ke akun Piramid Makkah Anda</p>
          </div>

          {!selectedRole ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Tipe Akun</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedRole('user')}
                  className="group p-8 rounded-[2rem] border-2 border-red-50 hover:border-brand-maroon hover:bg-red-50 transition-all text-center"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                  <div className="font-black text-brand-maroon">User / Jamaah</div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Layanan Kurban & Aqiqah</p>
                </button>
                <button 
                  onClick={() => setSelectedRole('admin')}
                  className="group p-8 rounded-[2rem] border-2 border-red-50 hover:border-brand-maroon hover:bg-red-50 transition-all text-center"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛠️</div>
                  <div className="font-black text-brand-maroon">Administrator</div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Kelola Operasional</p>
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5 animate-in slide-in-from-bottom-4 duration-300" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-black text-brand-maroon_light hover:underline underline-offset-4"
                >
                  ← Kembali ke Pilih Peran
                </button>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Login as {selectedRole}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.emailAddress}</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                  placeholder="nama@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.password}</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-maroon hover:bg-brand-maroon_dark text-white py-5 rounded-[1.25rem] font-black text-lg shadow-xl shadow-red-200 transition-all hover:-translate-y-1 active:scale-95 mt-4"
              >
                {t.login}
              </button>
            </form>
          )}

          <div className="mt-10 text-center text-slate-500 font-medium">
            {t.dontHaveAccount} <button onClick={onRegisterClick} className="text-brand-maroon font-black hover:underline underline-offset-4">{t.register}</button>
          </div>
        </div>

        <div className="bg-red-50/50 p-6 text-center border-t border-red-50">
          <p className="text-[10px] text-brand-maroon/40 uppercase tracking-[0.3em] font-black">Encrypted • Secure • Piramid Cloud</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
