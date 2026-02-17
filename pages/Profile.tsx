
import React from 'react';
import { Language, User } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  user: User | null;
  onLogout: () => void;
}

const Profile: React.FC<Props> = ({ lang, user, onLogout }) => {
  const t = translations[lang];

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar / Main Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-red-50 shadow-xl shadow-red-200/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-32 bg-brand-maroon"></div>
              
              <div className="relative pt-8">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-8 border-white mx-auto shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="mt-6">
                  <h2 className="text-2xl font-black text-brand-maroon_dark tracking-tight">{user.name}</h2>
                  <p className="text-slate-400 font-bold text-sm truncate">{user.email}</p>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-brand-maroon'}
                  `}>
                    {user.role} Account
                  </span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col gap-3">
                <button className="w-full py-4 bg-red-50 hover:bg-red-100 text-brand-maroon rounded-2xl font-black text-sm transition-all">{t.editProfile}</button>
                <button 
                  onClick={onLogout}
                  className="w-full py-4 text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-sm transition-all"
                >
                  {t.logout}
                </button>
              </div>
            </div>

            <div className="bg-brand-maroon_dark p-8 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">{t.stats}</h4>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-black mb-1">12</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Pesanan</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">$3,420</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Transaksi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-red-50 shadow-sm">
              <h3 className="text-xl font-black text-brand-maroon_dark mb-10 flex items-center gap-3">
                <span className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-sm">👤</span>
                Informasi Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t.fullName}</label>
                  <input type="text" readOnly value={user.name} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t.emailAddress}</label>
                  <input type="email" readOnly value={user.email} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t.memberSince}</label>
                  <input type="text" readOnly value="14 Mei 2024" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-red-50 shadow-sm">
              <h3 className="text-xl font-black text-brand-maroon_dark mb-10 flex items-center gap-3">
                <span className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-sm">🔒</span>
                {t.accountSecurity}
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors cursor-pointer">
                  <div>
                    <div className="font-black text-brand-maroon_dark">Ganti Kata Sandi</div>
                    <p className="text-xs font-bold text-slate-400">Terakhir diganti 2 bulan lalu</p>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform text-brand-maroon">→</span>
                </div>
                
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors cursor-pointer">
                  <div>
                    <div className="font-black text-brand-maroon_dark">Autentikasi Dua Faktor</div>
                    <p className="text-xs font-bold text-brand-maroon_light">Aktif & Terverifikasi</p>
                  </div>
                  <div className="w-12 h-6 bg-brand-maroon_light rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
