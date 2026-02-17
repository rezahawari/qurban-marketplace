
import React, { useState } from 'react';
import { Language, Order } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
}

const Dashboard: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [expandedId, setExpandedId] = useState<string | null>('PYR-88219');
  
  const [orders] = useState<Order[]>([
    {
      id: 'PYR-88219',
      customerName: 'Haji Ahmad',
      email: 'ahmad@example.com',
      service: 'kurban' as any,
      animal: 'goat' as any,
      weight: 35,
      location: 'Al-Muaisim',
      totalPrice: 255.00,
      beneficiaries: ['Ahmad bin Abdullah'],
      // Fix: Renamed 'fees' to 'appliedFees' and formatted as array to match Order interface
      appliedFees: [{ label: 'Processing Fee', amount: 5 }, { label: 'Logistics', amount: 3 }],
      status: 'completed',
      timestamp: '2024-05-15',
      documentation: {
        photos: ['https://picsum.photos/400/300?1', 'https://picsum.photos/400/300?2'],
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        earTag: 'MKK-1234',
        certificateUrl: '#'
      }
    },
    {
      id: 'PYR-88220',
      customerName: 'Haji Ahmad',
      email: 'ahmad@example.com',
      service: 'aqiqah' as any,
      animal: 'cow' as any,
      weight: 350,
      location: 'Sekitar Masjidil Haram',
      totalPrice: 1650.00,
      beneficiaries: ['Ibrahim bin Ahmad', 'Ismail bin Ahmad'],
      // Fix: Renamed 'fees' to 'appliedFees' and formatted as array to match Order interface
      appliedFees: [{ label: 'Processing Fee', amount: 5 }, { label: 'Logistics', amount: 3 }],
      status: 'pending',
      timestamp: '2024-05-18',
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-maroon mb-2">{t.dashboard}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Kelola Transaksi & Dokumentasi Syariah Anda</p>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-xl text-brand-maroon_light font-black text-xs uppercase tracking-widest">
            {orders.length} Pesanan
          </div>
        </div>
        
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedId === order.id;
            
            return (
              <div key={order.id} className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-brand-maroon/20 shadow-2xl shadow-red-100/50' : 'border-red-50 shadow-sm hover:border-red-100'}`}>
                {/* Accordion Header */}
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full text-left p-8 flex flex-wrap justify-between items-center gap-6"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 ${isExpanded ? 'bg-brand-maroon text-white rotate-6' : 'bg-red-50 text-brand-maroon'}`}>
                      {order.animal === 'goat' ? '🐐' : '🐄'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-brand-maroon uppercase tracking-widest mb-1">{order.id}</div>
                      <div className="text-xl font-black text-slate-900 capitalize">{order.service} - {order.animal}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal</div>
                      <div className="text-sm font-bold text-slate-700">{order.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {order.status}
                      </span>
                    </div>
                    <div className={`text-brand-maroon transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</div>
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="px-8 pb-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="border-t border-red-50 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      {/* Left Side: Order Details */}
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Transaksi</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-slate-500">Berat Hewan:</span>
                              <span className="font-black text-slate-900">{order.weight} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-slate-500">Lokasi:</span>
                              <span className="font-black text-slate-900">{order.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-slate-500">Atas Nama:</span>
                              <span className="font-black text-slate-900">{order.beneficiaries.join(', ')}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between text-lg">
                              <span className="font-black text-slate-800">Total:</span>
                              <span className="font-black text-brand-maroon tracking-tighter">${order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {!order.documentation && (
                          <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-6">
                            <div className="text-4xl">⏳</div>
                            <div>
                              <p className="text-sm font-bold text-amber-800 leading-snug">
                                Tim kami sedang menyiapkan hewan Anda. Dokumentasi akan diunggah setelah proses penyembelihan selesai.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Documentation */}
                      <div className="space-y-6">
                        {order.documentation ? (
                          <>
                            <h4 className="text-xs font-black text-brand-maroon uppercase tracking-widest flex items-center gap-2">
                              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                              Dokumentasi Syariah
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                              {order.documentation.photos.map((p, i) => (
                                <img key={i} src={p} className="w-full h-32 object-cover rounded-2xl shadow-sm border border-red-100" />
                              ))}
                            </div>

                            <video 
                              src={order.documentation.video} 
                              controls 
                              className="w-full aspect-video bg-slate-900 rounded-[2rem] shadow-xl"
                            ></video>

                            <div className="flex gap-4">
                              <div className="flex-grow p-4 bg-brand-maroon text-white rounded-2xl shadow-lg">
                                <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Ear Tag ID</div>
                                <div className="text-xl font-black">{order.documentation.earTag}</div>
                              </div>
                              <button className="px-6 bg-white border-2 border-brand-maroon text-brand-maroon rounded-2xl font-black hover:bg-red-50 transition shadow-sm">
                                ⬇️
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center text-center p-10 border-2 border-dashed border-red-100 rounded-[2.5rem] bg-red-50/20">
                            <div>
                              <div className="text-4xl mb-4 grayscale opacity-30">📸</div>
                              <p className="text-xs font-bold text-red-900/40 uppercase tracking-widest">Menunggu Dokumentasi</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
