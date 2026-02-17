
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  onRegister: () => void;
  onLoginClick: () => void;
}

const Register: React.FC<Props> = ({ lang, onRegister, onLoginClick }) => {
  const t = translations[lang];

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-red-50/30 px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-red-200/50 border border-red-50 overflow-hidden flex flex-col">
        <div className="p-10 sm:p-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 text-3xl">🤝</div>
            <h1 className="text-3xl font-black text-brand-maroon mb-2">{t.joinPyramid}</h1>
            <p className="text-slate-400">{t.createAccount} & Mulai Kebaikan di Mekkah</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <div className="space-y-1.5">
              <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.fullName}</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                placeholder="Contoh: Haji Ahmad"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.emailAddress}</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                placeholder="nama@email.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.password}</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-black text-brand-maroon/60 uppercase tracking-widest px-1">{t.confirmPassword}</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-6 py-4 bg-red-50/50 border border-red-100 rounded-2xl focus:ring-4 focus:ring-brand-maroon/10 focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-maroon hover:bg-brand-maroon_dark text-white py-5 rounded-[1.25rem] font-black text-lg shadow-xl shadow-red-200 transition-all hover:-translate-y-1 active:scale-95 mt-4"
            >
              {t.register}
            </button>
          </form>

          <div className="mt-10 text-center text-slate-500 font-medium">
            {t.alreadyHaveAccount} <button onClick={onLoginClick} className="text-brand-maroon font-black hover:underline underline-offset-4">{t.login}</button>
          </div>
        </div>

        <div className="bg-red-50/50 p-6 text-center border-t border-red-50">
          <p className="text-[10px] text-brand-maroon/40 uppercase tracking-[0.3em] font-black">Secure • Verified • Shariah</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
