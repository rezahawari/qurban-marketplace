
import React, { useState } from 'react';
import { Language, User } from '../types';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  children: React.ReactNode;
  lang: Language;
  onLangChange: (lang: Language) => void;
  navigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

const Layout: React.FC<Props> = ({ 
  children, lang, onLangChange, navigate, currentPage, user, onLoginClick, onRegisterClick, onLogout 
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [showDropdown, setShowDropdown] = useState(false);

  const NavItem = ({ page, label }: { page: string, label: string }) => (
    <button 
      onClick={() => navigate(page)} 
      className={`relative px-1 py-2 text-sm font-bold tracking-wide transition-all duration-300
        ${currentPage === page ? 'text-brand-maroon' : 'text-slate-500 hover:text-brand-maroon_light'}
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
        after:bg-amber-400 after:scale-x-0 after:transition-transform after:duration-300
        ${currentPage === page ? 'after:scale-x-100' : 'hover:after:scale-x-100'}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-red-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
              <img src="../logo.png" alt="PIRAMID logo" className="w-11 h-11 rounded-xl object-cover shadow-md" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-brand-maroon leading-none tracking-tighter group-hover:text-brand-maroon_dark transition-colors">PIRAMID</span>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] leading-none mt-1">Makkah</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <NavItem page="home" label={t.home} />
              <NavItem page="catalog" label={t.services} />
              <NavItem page="blog" label={t.blog} />
              {user?.role === 'admin' && <NavItem page="admin" label={t.adminPanel} />}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <LanguageSwitcher current={lang} onChange={onLangChange} />
            </div>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1 pr-4 bg-red-50 hover:bg-red-100 rounded-full border border-red-100 transition-all group"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-bold text-brand-maroon leading-none mb-0.5">{user.name}</div>
                    <div className="text-[10px] font-black text-brand-maroon_light uppercase tracking-widest">{user.role}</div>
                  </div>
                  <span className={`text-brand-maroon transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className={`absolute top-full mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-red-50 py-3 z-20 animate-in fade-in slide-in-from-top-4 duration-300 ${isRtl ? 'left-0' : 'right-0'}`}>
                      <div className="px-6 py-4 border-b border-red-50 mb-2">
                        <div className="font-bold text-brand-maroon truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      </div>
                      
                      <button 
                        onClick={() => { navigate(user.role === 'admin' ? 'admin' : 'dashboard'); setShowDropdown(false); }}
                        className="w-full text-left px-6 py-3 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-brand-maroon transition flex items-center gap-3"
                      >
                        <span className="text-lg">{user.role === 'admin' ? '🛠️' : '🕋'}</span> 
                        {user.role === 'admin' ? t.adminPanel : t.memberArea}
                      </button>

                      <button 
                        onClick={() => { navigate('profile'); setShowDropdown(false); }}
                        className="w-full text-left px-6 py-3 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-brand-maroon transition flex items-center gap-3"
                      >
                        <span className="text-lg">👤</span> {t.profile}
                      </button>
                      
                      <div className="mx-6 my-2 border-t border-red-50"></div>

                      <button 
                        onClick={() => { onLogout(); setShowDropdown(false); }}
                        className="w-full text-left px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-3"
                      >
                        <span className="text-lg">🚪</span> {t.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onLoginClick}
                  className="text-brand-maroon hover:text-brand-maroon_dark px-5 py-2.5 font-bold text-sm transition"
                >
                  {t.login}
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="bg-brand-maroon hover:bg-brand-maroon_dark text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-red-200"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-brand-maroon_dark text-red-50 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold text-xl border border-white/20">P</div>
                <span className="text-3xl font-black tracking-tighter">PIRAMID <span className="text-amber-500 underline decoration-2 underline-offset-8">MAKKAH</span></span>
            </div>
            <p className="text-red-100/60 max-w-sm leading-relaxed text-lg">
              Solusi digital terintegrasi untuk pelaksanaan ibadah Kurban, Aqiqah, dan Dam di Kota Suci Mekkah dengan transparansi penuh dan dokumentasi lengkap sesuai syariat.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-8 text-amber-500 uppercase tracking-widest">{t.services}</h4>
            <ul className="space-y-4 text-red-100/70 text-base font-medium">
              <li className="hover:text-amber-400 cursor-pointer transition">Kurban Makkah</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Aqiqah Barokah</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Dam Haji Tamattu</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Sedekah Daging Hadyu</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-8 text-amber-500 uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-red-100/70 text-base font-medium">
              <li className="hover:text-amber-400 cursor-pointer transition">Pusat Bantuan</li>
              <li className="hover:text-amber-400 cursor-pointer transition">FAQ Kurban</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Kebijakan Privasi</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Syarat & Ketentuan</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-red-100/40">
          <p>© 2024 PIRAMID Marketplace. Amanah, Transparan & Sesuai Syariat.</p>
          <div className="flex gap-8">
            <span className="hover:text-red-100 cursor-pointer transition">Instagram</span>
            <span className="hover:text-red-100 cursor-pointer transition">Facebook</span>
            <span className="hover:text-red-100 cursor-pointer transition">WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
