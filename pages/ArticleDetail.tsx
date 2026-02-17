
import React from 'react';
import { Language, BlogPost } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  article: BlogPost | null;
  onBack: () => void;
}

const ArticleDetail: React.FC<Props> = ({ lang, article, onBack }) => {
  const t = translations[lang];

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-black text-brand-maroon mb-4">Artikel Tidak Ditemukan</h2>
        <button onClick={onBack} className="bg-brand-maroon text-white px-8 py-3 rounded-2xl font-black">Kembali</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Article Hero */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img 
          src={article.image} 
          className="w-full h-full object-cover" 
          alt={article.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 inset-x-0">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-1.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-amber-500/20">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">👤</span>
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {article.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-brand-maroon font-black uppercase tracking-widest text-xs mb-12 group hover:gap-4 transition-all"
          >
            <span className="text-xl">←</span> Kembali ke Edukasi
          </button>

          <article className="prose prose-slate prose-xl max-w-none">
            {/* Split content by newlines to create paragraphs */}
            {article.content.split('\n').map((para, i) => (
              <p key={i} className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mb-8">
                {para}
              </p>
            ))}
          </article>

          {/* Social Share (Simulated) */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bagikan:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-maroon hover:text-white transition-all shadow-sm">f</button>
                  <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-maroon hover:text-white transition-all shadow-sm">t</button>
                  <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-maroon hover:text-white transition-all shadow-sm">w</button>
                </div>
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[10px] font-black text-brand-maroon uppercase tracking-widest border-2 border-brand-maroon/20 px-6 py-3 rounded-2xl hover:bg-brand-maroon hover:text-white transition-all"
              >
                Kembali ke Atas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
