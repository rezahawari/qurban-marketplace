
import React, { useState, useEffect } from 'react';
import { Language, User, AdminSettings, Product, Order, AnimalType, ServiceType, UserRole, FeeItem, BlogPost } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import { PRODUCTS as INITIAL_PRODUCTS, MOCK_BLOG_POSTS } from './constants';

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'admin@pyramid.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', createdAt: '10 Mei 2024', isActive: true },
  { id: '2', name: 'Haji Ahmad', email: 'ahmad@example.com', role: 'user', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad', createdAt: '14 Mei 2024', isActive: true },
  { id: '3', name: 'Siti Aminah', email: 'siti@example.com', role: 'user', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', createdAt: '16 Mei 2024', isActive: true }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'PYR-88219',
    customerName: 'Haji Ahmad',
    email: 'ahmad@example.com',
    service: ServiceType.KURBAN,
    animal: AnimalType.GOAT,
    weight: 35,
    location: 'Al-Muaisim',
    totalPrice: 255.00,
    beneficiaries: ['Ahmad bin Abdullah'],
    appliedFees: [{ label: 'Processing Fee', amount: 15.00 }],
    status: 'completed',
    timestamp: '2024-05-15',
    documentation: {
      photos: ['https://picsum.photos/400/300?1', 'https://picsum.photos/400/300?2'],
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      earTag: 'MKK-1234',
      certificateUrl: '#'
    }
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('id');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS as BlogPost[]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    fees: [
      { id: '1', label: 'Processing & Logistics', type: 'percentage', value: 2.5 },
      { id: '2', label: 'Service Fee', type: 'fixed', value: 10 }
    ]
  });

  const handleLogin = (role: UserRole, email: string) => {
    const found = users.find(u => u.email === email && u.role === role) || 
                  users.find(u => u.role === role);
    
    if (found) {
      if (found.isActive === false) {
        alert('Akun Anda dinonaktifkan.');
        return;
      }
      setUser(found);
      setCurrentPage('home');
    } else {
      alert('Login gagal.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleReadArticle = (post: BlogPost) => {
    setSelectedArticle(post);
    setCurrentPage('article_detail');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home 
          lang={lang} 
          onOrder={() => setCurrentPage('catalog')} 
          blogPosts={blogPosts} 
          onNavigateBlog={() => setCurrentPage('blog')}
          onReadArticle={handleReadArticle}
        />;
      case 'catalog':
        return <Catalog 
          lang={lang} 
          products={products}
          adminSettings={adminSettings}
          onCheckout={(data) => {
            if (user) {
              const newOrder: Order = {
                id: `PYR-${Math.floor(10000 + Math.random() * 90000)}`,
                customerName: user.name,
                email: user.email,
                service: data.service,
                animal: data.animal,
                weight: data.weight,
                location: data.location,
                beneficiaries: data.beneficiaries,
                totalPrice: data.total,
                appliedFees: data.appliedFees,
                status: 'pending',
                timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              };
              setOrders([newOrder, ...orders]);
              setCurrentPage('dashboard');
            } else {
              setCurrentPage('login');
            }
        }} />;
      case 'dashboard':
        return <Dashboard lang={lang} />;
      case 'blog':
        return <Blog lang={lang} blogPosts={blogPosts} onReadArticle={handleReadArticle} />;
      case 'article_detail':
        return <ArticleDetail lang={lang} article={selectedArticle} onBack={() => setCurrentPage('blog')} />;
      case 'admin':
        return <Admin 
          lang={lang} 
          settings={adminSettings}
          products={products}
          users={users}
          orders={orders}
          blogPosts={blogPosts}
          onUpdateSettings={setAdminSettings}
          onUpdateProducts={setProducts}
          onUpdateUsers={setUsers}
          onUpdateOrders={setOrders}
          onUpdateBlogPosts={setBlogPosts}
        />;
      case 'login':
        return <Login lang={lang} onLogin={handleLogin} onRegisterClick={() => setCurrentPage('register')} />;
      case 'register':
        return <Register lang={lang} onRegister={() => setCurrentPage('home')} onLoginClick={() => setCurrentPage('login')} />;
      case 'profile':
        return <Profile lang={lang} user={user} onLogout={handleLogout} />;
      default:
        return <Home 
          lang={lang} 
          onOrder={() => setCurrentPage('catalog')} 
          blogPosts={blogPosts} 
          onNavigateBlog={() => setCurrentPage('blog')}
          onReadArticle={handleReadArticle}
        />;
    }
  };

  return (
    <Layout 
        lang={lang} 
        onLangChange={setLang} 
        navigate={setCurrentPage} 
        currentPage={currentPage}
        user={user}
        onLoginClick={() => setCurrentPage('login')}
        onRegisterClick={() => setCurrentPage('register')}
        onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
