
import React, { useState } from 'react';
import { Language, BlogPost } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  blogPosts: BlogPost[];
  onReadArticle: (post: BlogPost) => void;
}

const Blog: React.FC<Props> = ({ lang, blogPosts, onReadArticle }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];
  const filteredPosts = blogPosts.filter(p => 
    p.status === 'published' && (filter === 'All' || p.category === filter)
  );

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header Area */}
      <div className="bg-brand-maroon text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-maroon_dark opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">{t.blog}</h1>
          <p className="text-xl text-red-100/80 font-medium max-w-2xl mx-auto">
            Wawasan seputar Kurban, Aqiqah, dan hikmah beribadah di Tanah Suci Mekkah.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-24">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all ${filter === cat ? 'bg-brand-maroon text-white scale-105' : 'bg-white text-slate-500 hover:text-brand-maroon'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-[3rem] overflow-hidden border border-red-50 shadow-sm hover:shadow-2xl hover:shadow-red-200/30 transition-all group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-brand-maroon px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">{post.category}</span>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  <span>{post.date}</span>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span>Oleh {post.author}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-brand-maroon transition-colors leading-tight line-clamp-2">{post.title}</h3>
                <p className="text-slate-500 font-medium line-clamp-4 mb-8 leading-relaxed">
                  {post.content}
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => onReadArticle(post)}
                    className="text-brand-maroon font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 group-hover:gap-5 transition-all"
                  >
                    {t.readMore} <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-red-100">
               <div className="text-5xl mb-6">📝</div>
               <p className="text-slate-400 font-black uppercase tracking-widest">Belum ada artikel di kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
