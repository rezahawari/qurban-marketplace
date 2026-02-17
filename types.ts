
export type Language = 'id' | 'en' | 'ar';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
  createdAt: string;
  isActive?: boolean;
}

export interface FeeItem {
  id: string;
  label: string;
  type: 'fixed' | 'percentage';
  value: number;
}

export interface AdminSettings {
  fees: FeeItem[];
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed';

export interface Translation {
  heroTitle: string;
  heroSub: string;
  ctaOrder: string;
  services: string;
  whyUs: string;
  testimonials: string;
  faq: string;
  blog: string;
  login: string;
  register: string;
  logout: string;
  dashboard: string;
  admin: string;
  cart: string;
  home: string;
  profile: string;
  memberArea: string;
  adminPanel: string;
  beneficiaryName: string;
  addPerson: string;
  removePerson: string;
  maxSeven: string;
  adminFee: string;
  settings: string;
  saveSettings: string;
  nominal: string;
  percentage: string;
  productManagement: string;
  userManagement: string;
  addAdmin: string;
  editProduct: string;
  orderDetail: string;
}

export enum ServiceType {
  KURBAN = 'kurban',
  AQIQAH = 'aqiqah',
  DAM = 'dam',
  SEDEKAH = 'sedekah'
}

export enum AnimalType {
  GOAT = 'goat',
  COW = 'cow',
  BUFFALO = 'buffalo',
  CAMEL = 'camel'
}

export interface WeightVariant {
  weight: number;
  price: number; 
}

export interface Location {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface Product {
  id: string;
  type: AnimalType;
  service: ServiceType;
  variants: WeightVariant[];
  basePrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  service: ServiceType;
  animal: AnimalType;
  weight: number;
  location: string;
  totalPrice: number;
  beneficiaries: string[];
  appliedFees: {
    label: string;
    amount: number;
  }[];
  status: OrderStatus;
  timestamp: string;
  documentation?: {
    photos: string[];
    video?: string;
    youtubeUrl?: string;
    earTag: string;
    certificateUrl: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  status: 'draft' | 'published';
}
