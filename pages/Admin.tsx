
import React, { useState, useMemo, useRef } from 'react';
import { Language, AdminSettings, Product, User, Order, AnimalType, ServiceType, WeightVariant, FeeItem, BlogPost } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { translations } from '../translations';

interface Props {
  lang: Language;
  settings: AdminSettings;
  products: Product[];
  users: User[];
  orders: Order[];
  blogPosts: BlogPost[];
  onUpdateSettings: (s: AdminSettings) => void;
  onUpdateProducts: (p: Product[]) => void;
  onUpdateUsers: (u: User[]) => void;
  onUpdateOrders: (o: Order[]) => void;
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
}

const Admin: React.FC<Props> = ({ 
  lang, settings, products, users, orders, blogPosts, onUpdateSettings, onUpdateProducts, onUpdateUsers, onUpdateOrders, onUpdateBlogPosts 
}) => {
  const t = translations[lang];
  const [view, setView] = useState<'dashboard' | 'orders' | 'products' | 'users' | 'settings' | 'articles'>('dashboard');
  
  // State for Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedUserSummary, setSelectedUserSummary] = useState<User | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articleImageInputRef = useRef<HTMLInputElement>(null);

  // Stats Logic
  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const pendingDocs = orders.filter(o => !o.documentation).length;
    return {
      totalOrders: orders.length,
      revenue,
      pendingDocs,
      totalUsers: users.length
    };
  }, [orders, users]);

  // Chart Data
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      name: date.split('-').slice(1).join('/'),
      count: orders.filter(o => o.timestamp.includes(date)).length
    }));
  }, [orders]);

  // Forms States
  const [productForm, setProductForm] = useState<Partial<Product>>({
    type: AnimalType.GOAT,
    service: ServiceType.KURBAN,
    basePrice: 0,
    variants: [{ weight: 0, price: 0 }]
  });

  const [articleForm, setArticleForm] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    category: 'Edukasi',
    image: '',
    status: 'draft'
  });

  const [adminForm, setAdminForm] = useState({ name: '', email: '' });

  // Article Management Logic
  const handleSaveArticle = () => {
    const post = editingArticle || { 
      id: `B-${Date.now()}`, 
      author: 'Admin', 
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
    } as BlogPost;
    
    const newPost = { ...post, ...articleForm } as BlogPost;
    
    if (editingArticle) {
      onUpdateBlogPosts(blogPosts.map(p => p.id === post.id ? newPost : p));
    } else {
      onUpdateBlogPosts([newPost, ...blogPosts]);
    }
    setShowArticleModal(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Hapus artikel ini secara permanen?')) {
      onUpdateBlogPosts(blogPosts.filter(p => p.id !== id));
    }
  };

  const toggleArticleStatus = (id: string) => {
    onUpdateBlogPosts(blogPosts.map(p => 
      p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
    ));
  };

  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setArticleForm(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  // Documentation Upload State
  const [docUpload, setDocUpload] = useState({ photos: '', video: '', youtube: '', earTag: '' });

  // Helper: File to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (file.type.startsWith('image/')) {
          setDocUpload(prev => ({
            ...prev,
            photos: prev.photos ? `${prev.photos}, ${result}` : result
          }));
        } else if (file.type.startsWith('video/')) {
          setDocUpload(prev => ({
            ...prev,
            video: result
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Logic: Upload Docs & Complete Order
  const handleUpdateDocs = () => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? {
      ...o,
      status: 'completed' as const,
      documentation: {
        photos: docUpload.photos.split(',').map(p => p.trim()).filter(p => p.length > 0),
        video: docUpload.video,
        youtubeUrl: docUpload.youtube,
        earTag: docUpload.earTag,
        certificateUrl: '#'
      }
    } : o);
    onUpdateOrders(updatedOrders);
    setSelectedOrder(null);
    setDocUpload({ photos: '', video: '', youtube: '', earTag: '' });
  };

  // Logic: Add Admin
  const handleAddAdmin = () => {
    if (!adminForm.name || !adminForm.email) return;
    const newUser: User = {
      id: `U-${Date.now()}`,
      name: adminForm.name,
      email: adminForm.email,
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminForm.name}`,
      createdAt: new Date().toLocaleDateString('id-ID'),
      isActive: true
    };
    onUpdateUsers([...users, newUser]);
    setShowAddAdminModal(false);
    setAdminForm({ name: '', email: '' });
  };

  // Logic: Toggle User Status
  const toggleUserStatus = (userId: string) => {
    onUpdateUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  // Logic: CRUD Products
  const handleSaveProduct = () => {
    const p = editingProduct || { id: `P-${Date.now()}` } as Product;
    const newP = { ...p, ...productForm } as Product;
    if (editingProduct) {
      onUpdateProducts(products.map(item => item.id === p.id ? newP : item));
    } else {
      onUpdateProducts([...products, newP]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Hapus produk ini?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Logic: Fees
  const handleAddFee = () => {
    const newFee: FeeItem = { id: `F-${Date.now()}`, label: 'Biaya Baru', type: 'fixed', value: 0 };
    onUpdateSettings({ ...settings, fees: [...settings.fees, newFee] });
  };

  const handleUpdateFee = (id: string, updates: Partial<FeeItem>) => {
    onUpdateSettings({
      ...settings,
      fees: settings.fees.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const handleDeleteFee = (id: string) => {
    onUpdateSettings({ ...settings, fees: settings.fees.filter(f => f.id !== id) });
  };

  const filteredUsers = users.filter(u => userFilter === 'all' ? true : u.role === userFilter);
  const getUserOrders = (email: string) => orders.filter(o => o.email === email);

  // Helper to extract YouTube ID
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : url;
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white p-4 rounded-[2.5rem] border border-red-50 shadow-sm sticky top-28">
            <div className="px-6 py-8 mb-4 border-b border-red-50">
              <h2 className="text-xl font-black text-brand-maroon">Admin Panel</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'orders', label: 'Transaksi', icon: '📝' },
                { id: 'products', label: 'Kelola Produk', icon: '🏷️' },
                { id: 'users', label: 'Kelola Pengguna', icon: '👥' },
                { id: 'articles', label: 'Kelola Artikel', icon: '✍️' },
                { id: 'settings', label: 'Pengaturan Harga', icon: '⚙️' },
              ].map((item) => (
                <button key={item.id} onClick={() => setView(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${view === item.id ? 'bg-brand-maroon text-white shadow-xl translate-x-1' : 'text-slate-600 hover:bg-red-50 hover:text-brand-maroon'}`}>
                  <span className="text-xl">{item.icon}</span> {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-grow space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-100 text-blue-800' },
                  { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-emerald-100 text-emerald-800' },
                  { label: 'Pending Docs', value: stats.pendingDocs, icon: '📄', color: 'bg-amber-100 text-amber-800' },
                  { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-purple-100 text-purple-800' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm hover:shadow-lg transition-shadow">
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>{stat.icon}</div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-red-50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black text-brand-maroon">Order Volume (7 Days)</h3>
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-brand-maroon rounded-full"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</span>
                   </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: '#fff5f5' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 6 ? '#7c0000' : '#fee2e2'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ARTICLES VIEW */}
          {view === 'articles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-brand-maroon">Pusat Edukasi & Berita</h3>
                <button onClick={() => { setEditingArticle(null); setArticleForm({ title: '', content: '', category: 'Edukasi', image: '', status: 'draft' }); setShowArticleModal(true); }} className="bg-brand-maroon text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-brand-maroon_dark transition-all">+ Artikel Baru</button>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4">Thumbnail</th>
                        <th className="px-8 py-4">Judul Artikel</th>
                        <th className="px-8 py-4">Kategori</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blogPosts.map(post => (
                        <tr key={post.id} className="hover:bg-red-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <img src={post.image} className="w-16 h-10 object-cover rounded-lg border border-red-50" alt="" />
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm font-black text-slate-800 line-clamp-1">{post.title}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{post.date} • {post.author}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                          </td>
                          <td className="px-8 py-5">
                             <button onClick={() => toggleArticleStatus(post.id)} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                               {post.status}
                             </button>
                          </td>
                          <td className="px-8 py-5 flex justify-center gap-2">
                             <button onClick={() => { setEditingArticle(post); setArticleForm(post); setShowArticleModal(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">✏️</button>
                             <button onClick={() => handleDeleteArticle(post.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {view === 'orders' && (
            <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-red-50 bg-red-50/20">
                <h3 className="text-lg font-black text-brand-maroon">Monitor Transaksi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-4">ID</th>
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Layanan</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-8 py-5 font-black text-brand-maroon text-sm">{order.id}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-700">{order.customerName}</td>
                        <td className="px-8 py-5 text-sm font-medium text-slate-500 capitalize">{order.service} - {order.animal}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => { 
                              setSelectedOrder(order); 
                              setDocUpload({ 
                                photos: order.documentation?.photos.join(', ') || '', 
                                video: order.documentation?.video || '', 
                                youtube: order.documentation?.youtubeUrl || '', 
                                earTag: order.documentation?.earTag || '' 
                              }); 
                            }} 
                            className="bg-brand-maroon text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-brand-maroon_dark transition shadow-sm"
                          >
                            Detail & Dokumen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS VIEW */}
          {view === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-brand-maroon">Manajemen Inventori</h3>
                <button onClick={() => { setEditingProduct(null); setProductForm({ type: AnimalType.GOAT, service: ServiceType.KURBAN, basePrice: 0, variants: [{ weight: 0, price: 0 }] }); setShowProductModal(true); }} className="bg-brand-maroon text-white px-8 py-4 rounded-2xl font-black shadow-lg">+ Produk Baru</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-4xl">{p.type === 'goat' ? '🐐' : '🐄'}</div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setProductForm(p); setShowProductModal(true); }} className="p-3 bg-red-100 text-brand-maroon rounded-xl font-bold text-xs hover:bg-red-200 transition">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-rose-100 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-200 transition">Delete</button>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-brand-maroon capitalize">{p.type} <span className="text-sm font-bold opacity-40">({p.service})</span></h3>
                    <p className="text-slate-500 font-bold mb-4">Base Price: ${p.basePrice}</p>
                    <div className="space-y-1">
                      {p.variants.map((v, i) => <div key={i} className="text-xs font-bold text-slate-500">• {v.weight}kg (+${v.price})</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS VIEW */}
          {view === 'users' && (
            <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-red-50 flex justify-between items-center bg-red-50/20">
                <h3 className="text-lg font-black text-brand-maroon">Direktori Pengguna</h3>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddAdminModal(true)} className="bg-brand-maroon text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-maroon_dark transition shadow-md shadow-red-200">+ Add Admin</button>
                  <div className="h-10 w-px bg-red-100 hidden sm:block"></div>
                  {['all', 'admin', 'user'].map(f => (
                    <button key={f} onClick={() => setUserFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userFilter === f ? 'bg-brand-maroon text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-brand-maroon/30'}`}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-4">User</th>
                      <th className="px-8 py-4">Email</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4 text-center">Status</th>
                      <th className="px-8 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const userOrders = getUserOrders(u.email);
                      const active = u.isActive !== false;
                      return (
                        <tr key={u.id} className={`hover:bg-red-50/30 border-b border-slate-50 transition-colors ${!active ? 'opacity-50' : ''}`}>
                          <td className="px-8 py-5 flex items-center gap-4">
                            <img src={u.avatar} className="w-10 h-10 rounded-full border border-red-100 shadow-sm" />
                            <span className="font-black text-slate-800">{u.name}</span>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500 font-bold">{u.email}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{u.role}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`text-[10px] font-black ${active ? 'text-green-600' : 'text-rose-600'}`}>
                              {active ? '● ACTIVE' : '○ INACTIVE'}
                            </span>
                          </td>
                          <td className="px-8 py-5 flex justify-center gap-2">
                             <button onClick={() => setSelectedUserSummary(u)} className="p-2.5 bg-red-100 text-brand-maroon rounded-xl hover:bg-brand-maroon hover:text-white transition shadow-sm" title="History Summary">📊</button>
                             <button onClick={() => toggleUserStatus(u.id)} className={`p-2.5 rounded-xl transition shadow-sm ${active ? 'bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`} title={active ? 'Deactivate' : 'Activate'}>
                               {active ? '🚫' : '✅'}
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS (PRICING) VIEW */}
          {view === 'settings' && (
            <div className="bg-white p-10 rounded-[3rem] border border-red-50 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-brand-maroon">Pengaturan Biaya Tambahan</h3>
                  <p className="text-slate-500 font-bold text-sm mt-1">Kelola pajak dan biaya layanan yang muncul di checkout.</p>
                </div>
                <button onClick={handleAddFee} className="bg-brand-maroon text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-brand-maroon_dark transition shadow-lg shadow-red-200">+ Tambah Biaya</button>
              </div>
              <div className="space-y-6">
                {settings.fees.map(fee => (
                  <div key={fee.id} className="p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 items-center hover:border-brand-maroon/20 transition-all group">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 px-1">Label Biaya</label>
                      <input type="text" value={fee.label} onChange={(e) => handleUpdateFee(fee.id, { label: e.target.value })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-brand-maroon outline-none transition-all placeholder:text-slate-300" placeholder="Contoh: Pajak Layanan" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 px-1">Tipe</label>
                      <select value={fee.type} onChange={(e) => handleUpdateFee(fee.id, { type: e.target.value as any })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-brand-maroon outline-none transition-all cursor-pointer">
                        <option value="fixed">Fixed (USD)</option>
                        <option value="percentage">Persentase (%)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 px-1">Nilai</label>
                      <input type="number" value={fee.value} onChange={(e) => handleUpdateFee(fee.id, { value: parseFloat(e.target.value) })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 font-black text-sm bg-white focus:border-brand-maroon outline-none transition-all" />
                    </div>
                    <div className="pt-6 flex justify-end">
                      <button onClick={() => handleDeleteFee(fee.id)} className="bg-rose-50 text-rose-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">Hapus Biaya</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ARTICLE FORM (CRUD) */}
      {showArticleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-maroon_dark/60 backdrop-blur-md" onClick={() => setShowArticleModal(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[3rem] p-10 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
             <div className="flex justify-between items-center mb-8 pb-6 border-b border-red-50">
                <h2 className="text-2xl font-black text-brand-maroon">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
                <button onClick={() => setShowArticleModal(false)} className="p-3 bg-red-50 text-brand-maroon rounded-xl">✕</button>
             </div>
             <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Judul Artikel</label>
                  <input value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-maroon outline-none font-black text-lg" placeholder="Judul yang menarik..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Kategori</label>
                    <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-maroon outline-none font-bold">
                      <option>Edukasi</option>
                      <option>Berita</option>
                      <option>Panduan</option>
                      <option>Hikmah</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Status Publikasi</label>
                    <select value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value as any })} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-maroon outline-none font-bold">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Thumbnail Artikel</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div 
                      onClick={() => articleImageInputRef.current?.click()}
                      className="group cursor-pointer p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center hover:border-brand-maroon hover:bg-red-50/30 transition-all flex flex-col items-center justify-center min-h-[200px]"
                    >
                      {articleForm.image ? (
                        <div className="relative w-full h-full">
                          <img src={articleForm.image} className="w-full h-40 object-cover rounded-xl shadow-md" alt="Preview" />
                          <div className="absolute inset-0 bg-brand-maroon/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Ganti Gambar</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
                          <p className="text-sm font-black text-brand-maroon">Upload Thumbnail</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG (Max 5MB)</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={articleImageInputRef} 
                        onChange={handleArticleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 px-1">Atau Gunakan Link Gambar</label>
                        <input value={articleForm.image} onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-maroon outline-none font-bold text-xs" placeholder="https://domain.com/image.jpg" />
                      </div>
                      <p className="text-[9px] text-slate-400 italic leading-relaxed">Pilih salah satu: Upload file langsung dari perangkat Anda atau masukkan tautan gambar publik.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Konten Artikel</label>
                  <textarea value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-brand-maroon outline-none font-medium h-64" placeholder="Tulis isi artikel lengkap di sini..." />
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button onClick={() => { setArticleForm({...articleForm, status: 'draft'}); handleSaveArticle(); }} className="p-5 border-2 border-slate-100 bg-white rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Simpan Draft</button>
                  <button onClick={() => { setArticleForm({...articleForm, status: 'published'}); handleSaveArticle(); }} className="p-5 bg-brand-maroon text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-brand-maroon_dark transition-all uppercase tracking-widest text-xs">Terbitkan Artikel</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: TRANSACTION DETAIL & DOCUMENTATION UPLOADER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-maroon_dark/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white w-full max-w-6xl rounded-[3rem] p-10 relative z-10 shadow-2xl max-h-[95vh] overflow-y-auto space-y-10 custom-scrollbar">
            <div className="flex justify-between items-center pb-6 border-b border-red-100">
               <div>
                  <h2 className="text-3xl font-black text-brand-maroon">Detail Transaksi {selectedOrder.id}</h2>
                  <p className="text-slate-500 font-bold">Monitor, lengkapi data, dan unggah dokumentasi syariah.</p>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center bg-red-100 text-brand-maroon rounded-2xl hover:bg-brand-maroon hover:text-white transition-all shadow-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
                    <h3 className="text-xl font-black text-brand-maroon flex items-center gap-3">
                      <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">📑</span>
                      Informasi Detail
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-2xl border border-slate-100 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Pemesan</span>
                        <span className="text-sm font-black text-slate-800">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-2xl border border-slate-100 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layanan Yang Dipilih</span>
                        <span className="text-sm font-black text-slate-800 capitalize">{selectedOrder.service} - {selectedOrder.animal}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-2xl border border-slate-100 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Varian Berat</span>
                        <span className="text-sm font-black text-brand-maroon_light">{selectedOrder.weight} kg</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-2xl border border-slate-100 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi Penyembelihan</span>
                        <span className="text-xs font-bold text-slate-600 italic text-right">{selectedOrder.location}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-brand-maroon text-white rounded-2xl shadow-lg gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Grand Total Bayar</span>
                        <span className="text-xl font-black tracking-tighter">${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border-2 border-amber-100 rounded-[2.5rem] bg-amber-50/20 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 flex items-center gap-2 px-1">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                      Daftar Shohibul / Penerima Manfaat
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {selectedOrder.beneficiaries.map((b, i) => (
                         <div key={i} className="text-sm font-black text-brand-maroon bg-white px-4 py-3 rounded-2xl border border-amber-200/50 shadow-sm flex items-center gap-3">
                           <span className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center text-[10px] text-amber-600">{i+1}</span>
                           {b}
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <span className="text-xl">📺</span> Media Preview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {docUpload.photos.split(',').filter(url => url.trim().length > 0).map((url, i) => (
                        <div key={i} className="relative group aspect-video rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
                          <img src={url.trim()} className="w-full h-full object-cover" alt={`Preview ${i}`} />
                          <button onClick={() => {
                            const remaining = docUpload.photos.split(',').filter((_, idx) => idx !== i).join(', ');
                            setDocUpload(prev => ({ ...prev, photos: remaining }));
                          }} className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                        </div>
                      ))}
                    </div>
                    {(docUpload.video || docUpload.youtube) && (
                      <div className="space-y-4">
                        {docUpload.youtube && (
                          <div className="rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-xl">
                            <iframe className="w-full aspect-video" src={getYoutubeEmbedUrl(docUpload.youtube)} title="YouTube Preview" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                          </div>
                        )}
                        {docUpload.video && !docUpload.youtube && (
                          <div className="rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-xl bg-black">
                             <video src={docUpload.video} controls className="w-full aspect-video" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
               </div>
               <div className="space-y-8 p-10 bg-brand-maroon/5 rounded-[3rem] border-2 border-red-50 sticky top-4">
                  <h3 className="text-xl font-black text-brand-maroon flex items-center gap-3">
                    <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">📤</span>
                    Dokumentasi & Status
                  </h3>
                  <div className="space-y-6">
                    <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer p-10 bg-white border-2 border-dashed border-red-200 rounded-[2.5rem] text-center hover:border-brand-maroon hover:bg-red-50 transition-all shadow-sm">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                      <p className="text-base font-black text-brand-maroon">Klik untuk Upload File</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Gambar atau Video (Max 100MB)</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,video/*" className="hidden" />
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Ear Tag ID (MANDATORY)</label>
                        <input value={docUpload.earTag} onChange={(e) => setDocUpload({ ...docUpload, earTag: e.target.value })} className="w-full p-5 bg-white rounded-2xl border-2 border-slate-100 focus:border-brand-maroon outline-none transition-all font-bold shadow-sm" placeholder="MKK-XXXX" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Photo External Link (Comma separated)</label>
                        <input value={docUpload.photos} onChange={(e) => setDocUpload({ ...docUpload, photos: e.target.value })} className="w-full p-5 bg-white rounded-2xl border-2 border-slate-100 focus:border-brand-maroon outline-none transition-all font-bold text-xs" placeholder="https://..." />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">YouTube URL / Video ID</label>
                          <input value={docUpload.youtube} onChange={(e) => setDocUpload({ ...docUpload, youtube: e.target.value })} className="w-full p-5 bg-white rounded-2xl border-2 border-slate-100 focus:border-brand-maroon outline-none transition-all font-bold" placeholder="ID YouTube" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Direct Video URL</label>
                          <input value={docUpload.video} onChange={(e) => setDocUpload({ ...docUpload, video: e.target.value })} className="w-full p-5 bg-white rounded-2xl border-2 border-slate-100 focus:border-brand-maroon outline-none transition-all font-bold" placeholder="URL .mp4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleUpdateDocs} className="w-full bg-brand-maroon text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-red-300 hover:bg-brand-maroon_dark transition-all hover:-translate-y-1 active:scale-95">Finalisasi Dokumentasi Transaksi</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-maroon_dark/60 backdrop-blur-md" onClick={() => setShowAddAdminModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-2xl space-y-8">
            <h2 className="text-2xl font-black text-brand-maroon">Add New Administrator</h2>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Nama Lengkap</label>
                <input value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border focus:border-brand-maroon outline-none font-bold" placeholder="Administrator Name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Alamat Email</label>
                <input value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border focus:border-brand-maroon outline-none font-bold" placeholder="admin@pyramid.com" />
              </div>
            </div>
            <button onClick={handleAddAdmin} className="w-full bg-brand-maroon text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-red-200 hover:bg-brand-maroon_dark transition-all active:scale-95">Confirm Add Admin</button>
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT FORM (CRUD) */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-maroon_dark/60 backdrop-blur-md" onClick={() => setShowProductModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-brand-maroon mb-8">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Jenis Hewan</label>
                  <select value={productForm.type} onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold focus:border-brand-maroon outline-none">
                    <option value="goat">Goat (Kambing)</option>
                    <option value="cow">Cow (Sapi)</option>
                    <option value="camel">Camel (Unta)</option>
                    <option value="buffalo">Buffalo (Kerbau)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Layanan</label>
                  <select value={productForm.service} onChange={(e) => setProductForm({ ...productForm, service: e.target.value as any })} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold focus:border-brand-maroon outline-none">
                    <option value="kurban">Kurban</option>
                    <option value="aqiqah">Aqiqah</option>
                    <option value="dam">Dam</option>
                    <option value="sedekah">Sedekah</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Harga Dasar (USD)</label>
                <input type="number" value={productForm.basePrice} onChange={(e) => setProductForm({ ...productForm, basePrice: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-2xl border font-black focus:border-brand-maroon outline-none" />
              </div>
              <div>
                <div className="flex justify-between mb-4 items-center">
                  <label className="text-[10px] font-black uppercase text-slate-500">Varian Berat & Harga Tambahan</label>
                  <button onClick={() => setProductForm({ ...productForm, variants: [...(productForm.variants || []), { weight: 0, price: 0 }] })} className="px-4 py-2 bg-red-50 text-brand-maroon rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">+ Add Variant</button>
                </div>
                <div className="space-y-3">
                  {productForm.variants?.map((v, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-grow">
                         <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Berat (Kg)</label>
                         <input type="number" value={v.weight} onChange={(e) => {
                           const newV = [...(productForm.variants || [])];
                           newV[i].weight = parseFloat(e.target.value);
                           setProductForm({ ...productForm, variants: newV });
                         }} className="w-full p-3 bg-slate-50 border rounded-xl font-bold focus:border-brand-maroon outline-none" />
                      </div>
                      <div className="flex-grow">
                         <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Harga Tambahan (+USD)</label>
                         <input type="number" value={v.price} onChange={(e) => {
                           const newV = [...(productForm.variants || [])];
                           newV[i].price = parseFloat(e.target.value);
                           setProductForm({ ...productForm, variants: newV });
                         }} className="w-full p-3 bg-slate-50 border rounded-xl font-bold focus:border-brand-maroon outline-none" />
                      </div>
                      <button onClick={() => setProductForm({ ...productForm, variants: productForm.variants?.filter((_, idx) => idx !== i) })} className="self-end p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition">✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveProduct} className="w-full bg-brand-maroon text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-red-200 hover:bg-brand-maroon_dark transition-all">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: USER HISTORY SUMMARY */}
      {selectedUserSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-maroon_dark/60 backdrop-blur-md" onClick={() => setSelectedUserSummary(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl">
             <div className="flex items-center gap-6 mb-8 pb-8 border-b border-red-50">
                <img src={selectedUserSummary.avatar} className="w-24 h-24 rounded-full border-4 border-red-100 shadow-lg" />
                <div>
                   <h2 className="text-3xl font-black text-brand-maroon leading-tight">{selectedUserSummary.name}</h2>
                   <p className="font-bold text-slate-500">{selectedUserSummary.email}</p>
                   <div className="mt-2 flex gap-2">
                     <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-100 text-brand-maroon rounded-lg">{selectedUserSummary.role}</span>
                     <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${selectedUserSummary.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{selectedUserSummary.isActive !== false ? 'Active' : 'Deactivated'}</span>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Spent</div>
                   <div className="text-3xl font-black text-brand-maroon tracking-tighter">${getUserOrders(selectedUserSummary.email).reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Orders</div>
                   <div className="text-3xl font-black text-brand-maroon tracking-tighter">{getUserOrders(selectedUserSummary.email).length}</div>
                </div>
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Recent Activities</h4>
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {getUserOrders(selectedUserSummary.email).map(o => (
                  <div key={o.id} className="p-5 bg-red-50/50 border border-red-100 rounded-[1.5rem] flex justify-between items-center hover:bg-red-50 transition-colors">
                    <div>
                      <div className="font-black text-brand-maroon capitalize text-sm">{o.service} - {o.animal}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">{o.timestamp} • ID: {o.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-brand-maroon_light leading-none">${o.totalPrice.toFixed(2)}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1">{o.status}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
