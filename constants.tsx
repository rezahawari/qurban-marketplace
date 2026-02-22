
import { AnimalType, ServiceType, Product, Location, BlogPost } from './types';

export const LOCATIONS: Location[] = [
  { id: 'muaisim', name: 'Rumah Potong Hewan Al-Muaisim', additionalPrice: 50 },
  { id: 'haram', name: 'Sekitar Masjidil Haram', additionalPrice: 100 },
  { id: 'makkah_city', name: 'Wilayah Kota Mekkah', additionalPrice: 0 }
];

export const PRODUCTS: Product[] = [
  // KURBAN
  {
    id: 'kurban_goat',
    type: AnimalType.GOAT,
    service: ServiceType.KURBAN,
    basePrice: 200,
    variants: [{ weight: 25, price: 0 }, { weight: 35, price: 50 }, { weight: 45, price: 100 }]
  },
  {
    id: 'kurban_cow',
    type: AnimalType.COW,
    service: ServiceType.KURBAN,
    basePrice: 1200,
    variants: [{ weight: 250, price: 0 }, { weight: 350, price: 400 }]
  },
  {
    id: 'kurban_camel',
    type: AnimalType.CAMEL,
    service: ServiceType.KURBAN,
    basePrice: 1500,
    variants: [{ weight: 300, price: 0 }, { weight: 450, price: 600 }]
  },
  {
    id: 'kurban_buffalo',
    type: AnimalType.BUFFALO,
    service: ServiceType.KURBAN,
    basePrice: 1300,
    variants: [{ weight: 300, price: 0 }, { weight: 400, price: 300 }]
  },

  // AQIQAH
  {
    id: 'aqiqah_goat_m',
    type: AnimalType.GOAT,
    service: ServiceType.AQIQAH,
    basePrice: 220,
    variants: [{ weight: 25, price: 0 }, { weight: 30, price: 30 }]
  },
  {
    id: 'aqiqah_cow',
    type: AnimalType.COW,
    service: ServiceType.AQIQAH,
    basePrice: 1250,
    variants: [{ weight: 300, price: 0 }]
  },

  // DAM
  {
    id: 'dam_goat',
    type: AnimalType.GOAT,
    service: ServiceType.DAM,
    basePrice: 150,
    variants: [{ weight: 20, price: 0 }, { weight: 25, price: 30 }]
  },

  // SEDEKAH
  {
    id: 'sedekah_goat',
    type: AnimalType.GOAT,
    service: ServiceType.SEDEKAH,
    basePrice: 180,
    variants: [{ weight: 25, price: 0 }]
  },
  {
    id: 'sedekah_cow',
    type: AnimalType.COW,
    service: ServiceType.SEDEKAH,
    basePrice: 1100,
    variants: [{ weight: 250, price: 0 }]
  },
  {
    id: 'sedekah_camel',
    type: AnimalType.CAMEL,
    service: ServiceType.SEDEKAH,
    basePrice: 1400,
    variants: [{ weight: 300, price: 0 }]
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  { 
    id: '1', 
    title: 'Adab Berqurban dalam Islam', 
    content: 'Berqurban adalah ibadah yang sangat mulia bagi umat Muslim di seluruh dunia. Pelaksanaan qurban di tanah suci memiliki keutamaan tersendiri bagi yang menjalankannya...', 
    author: 'Ustadz Abdullah', 
    date: '10 Mei 2024',
    image: 'https://images.unsplash.com/photo-1590076175573-09756b78d91c?auto=format&fit=crop&q=80&w=800',
    category: 'Edukasi',
    status: 'published'
  },
  { 
    id: '2', 
    title: 'Panduan Lengkap Aqiqah Anak', 
    content: 'Aqiqah disunnahkan dilakukan pada hari ketujuh kelahiran sang buah hati. Memilih hewan yang sehat dan sesuai syariat adalah langkah awal yang sangat penting...', 
    author: 'Admin Pyramid', 
    date: '12 Mei 2024',
    image: 'https://images.unsplash.com/photo-1700299926955-d68c16ba107b?auto=format&fit=crop&q=80&w=800',
    category: 'Panduan',
    status: 'published'
  },
  { 
    id: '3', 
    title: 'Keutamaan Berbagi Daging di Tanah Suci', 
    content: 'Mekkah merupakan tempat yang penuh berkah. Menyalurkan sedekah daging atau kurban di sana memberikan manfaat luas bagi para mustahik di sekitarnya...', 
    author: 'Syeikh Mansour', 
    date: '15 Mei 2024',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    category: 'Berita',
    status: 'published'
  }
];
