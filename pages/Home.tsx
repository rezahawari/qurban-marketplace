
import React from 'react';
import { Language, AnimalType, BlogPost } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  blogPosts: BlogPost[];
  onOrder: () => void;
  onNavigateBlog: () => void;
  onReadArticle: (post: BlogPost) => void;
}

const Home: React.FC<Props> = ({ lang, blogPosts, onOrder, onNavigateBlog, onReadArticle }) => {
  const t = translations[lang];

  const animals = [
    { type: AnimalType.GOAT, label: t.goat, icon: "🐐", color: "bg-red-50", textColor: "text-brand-maroon", border: "border-red-100" },
    { type: AnimalType.COW, label: t.cow, icon: "🐄", color: "bg-orange-50", textColor: "text-orange-900", border: "border-orange-100" },
    { type: AnimalType.BUFFALO, label: t.buffalo, icon: "🐃", color: "bg-slate-50", textColor: "text-slate-700", border: "border-slate-100" },
    { type: AnimalType.CAMEL, label: t.camel, icon: "🐪", color: "bg-amber-50", textColor: "text-amber-900", border: "border-amber-100" },
  ];

  const galleryItems = [
    {
      title: "Peternakan Premium",
      category: "Kualitas Hewan",
      image: "https://images.unsplash.com/photo-1700299926955-d68c16ba107b?auto=format&fit=crop&q=80&w=800",
      size: "large"
    },
    {
      title: "Distribusi Amanah",
      category: "Penyaluran",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
      size: "small"
    },
    {
      title: "Proses Syariah",
      category: "Operasional",
      image: "https://images.unsplash.com/photo-1590076175573-09756b78d91c?auto=format&fit=crop&q=80&w=800",
      size: "small"
    },
    {
      title: "Wilayah Makkah",
      category: "Lokasi",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800",
      size: "medium"
    },
    {
      title: "Dokumentasi Lengkap",
      category: "Transparansi",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      size: "medium"
    }
  ];

  const latestPosts = blogPosts.filter(p => p.status === 'published').slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-maroon_dark/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Makkah Background"
        />
        <div className="container mx-auto px-4 relative z-20 text-white">
          <div className="max-w-3xl">
            <h1 className={`text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter ${lang === 'ar' ? 'font-arabic' : ''}`}>
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-red-50 opacity-90 mb-10 leading-relaxed font-medium">
              {t.heroSub}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onOrder}
                className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-2xl font-black text-lg transition shadow-2xl shadow-amber-500/30 transform hover:-translate-y-1"
              >
                {t.ctaOrder}
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg transition">
                {t.whyUs}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animal Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-maroon mb-4 tracking-tight">{t.animalCategories}</h2>
            <p className="text-slate-400 font-bold max-w-lg mx-auto">{t.animalSub}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {animals.map((animal) => (
              <div 
                key={animal.type} 
                className={`group relative p-8 rounded-[3rem] border-2 ${animal.border} ${animal.color} transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-red-100`}
                onClick={onOrder}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                
                <div className="relative z-10 text-center sm:text-left">
                  <div className="text-7xl mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{animal.icon}</div>
                  <h3 className={`text-2xl font-black ${animal.textColor} mb-2`}>{animal.label}</h3>
                  <p className="text-sm font-bold opacity-60">Lihat Varian Berat →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-red-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-maroon mb-4 tracking-tight">{t.whyUs}</h2>
            <div className="h-1.5 w-20 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Transparansi Syariah", icon: "🕋", desc: "Setiap penyembelihan disertai dengan video dan nomor ear tag unik hewan Anda secara real-time." },
              { title: "Distribusi Tepat Sasaran", icon: "🤝", desc: "Daging didistribusikan ke fakir miskin dan mustahik di wilayah suci Mekkah dan sekitarnya." },
              { title: "Sertifikat Digital", icon: "📜", desc: "Dapatkan sertifikat resmi sebagai bukti pelaksanaan ibadah yang dapat diunduh langsung." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-red-100 hover:shadow-2xl hover:shadow-red-200 transition-all duration-500 group">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">{item.icon}</div>
                <h3 className="text-2xl font-black text-brand-maroon_light mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Library Section (New) */}
      <section className="py-24 bg-brand-maroon_dark text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Eksplorasi Layanan</span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">Library Piramid: <br/><span className="text-red-100/40">Visualisasi Amanah Kami</span></h2>
            </div>
            <p className="text-red-100/60 font-medium max-w-sm text-lg leading-relaxed">
              Melihat lebih dekat proses hulu ke hilir, dari pemilihan hewan terbaik hingga distribusi daging kurban di tanah suci.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
            {/* Masonry-style Grid */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] border-4 border-white/5 cursor-pointer shadow-2xl">
              <img src={galleryItems[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galleryItems[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon_dark via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-amber-400 text-xs font-black uppercase tracking-widest mb-2 block">{galleryItems[0].category}</span>
                <h4 className="text-2xl font-black text-white">{galleryItems[0].title}</h4>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white/5 cursor-pointer shadow-xl">
              <img src={galleryItems[1].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galleryItems[1].title} />
              <div className="absolute inset-0 bg-brand-maroon_dark/40 group-hover:bg-brand-maroon_dark/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                 <h4 className="text-lg font-black text-white">{galleryItems[1].title}</h4>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white/5 cursor-pointer shadow-xl">
              <img src={galleryItems[2].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galleryItems[2].title} />
              <div className="absolute inset-0 bg-brand-maroon_dark/40 group-hover:bg-brand-maroon_dark/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                 <h4 className="text-lg font-black text-white">{galleryItems[2].title}</h4>
              </div>
            </div>

            <div className="md:col-span-1 group relative overflow-hidden rounded-[2.5rem] border-4 border-white/5 cursor-pointer shadow-xl">
              <img src={galleryItems[3].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galleryItems[3].title} />
              <div className="absolute inset-0 bg-brand-maroon_dark/40 group-hover:bg-brand-maroon_dark/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                 <h4 className="text-lg font-black text-white">{galleryItems[3].title}</h4>
              </div>
            </div>

            <div className="md:col-span-1 group relative overflow-hidden rounded-[2.5rem] border-4 border-white/5 cursor-pointer shadow-xl">
              <img src={galleryItems[4].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galleryItems[4].title} />
              <div className="absolute inset-0 bg-brand-maroon_dark/40 group-hover:bg-brand-maroon_dark/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                 <h4 className="text-lg font-black text-white">{galleryItems[4].title}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-brand-maroon tracking-tight">{t.latestArticles}</h2>
              <div className="h-1.5 w-24 bg-amber-500 rounded-full mt-2"></div>
            </div>
            <button 
              onClick={onNavigateBlog}
              className="text-brand-maroon font-black uppercase tracking-widest text-sm flex items-center gap-2 group"
            >
              {t.blog} <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestPosts.map(post => (
              <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-red-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => onReadArticle(post)}>
                <div className="h-56 overflow-hidden">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-red-50 text-brand-maroon rounded-lg text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-brand-maroon transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 leading-relaxed">{post.content}</p>
                  <button onClick={() => onReadArticle(post)} className="text-brand-maroon font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    {t.readMore} <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-maroon py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-maroon_light rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30"></div>
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">10k+</div>
            <div className="text-xs uppercase font-black tracking-widest opacity-50">Happy Clients</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">25k+</div>
            <div className="text-xs uppercase font-black tracking-widest opacity-50">Animals Sacrificed</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">100%</div>
            <div className="text-xs uppercase font-black tracking-widest opacity-50">Verified Shariah</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">24/7</div>
            <div className="text-xs uppercase font-black tracking-widest opacity-50">Customer Care</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
