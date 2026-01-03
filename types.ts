
export enum Category {
  AGRICULTURE = 'Agricultura',
  ELECTRONICS = 'Eletrônicos',
  TEXTILES = 'Têxteis e Moda',
  CONSTRUCTION = 'Construção',
  AUTO = 'Automotivo',
  HOME = 'Casa e Decoração'
}

export type AccountType = 'Normal' | 'Premium';
export type AppTheme = 'navy' | 'sunset' | 'forest';

export interface User {
  id: string;
  name: string;
  avatar: string;
  accountType: AccountType;
  preferences: UserPreferences;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  lat: number;
  lng: number;
  city: string;
  country: string;
  createdAt: string;
  distance?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  text?: string;
  image?: string;
  timestamp: string;
}

export interface Conversation {
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  lastMessage?: string;
  lastTimestamp: string;
  unread: boolean;
}

export interface UserPreferences {
  favoriteCategories: Category[];
  searchHistory: string[];
  theme: AppTheme;
  notifications: boolean;
  language: 'PT-BR' | 'EN' | 'FR';
  lastLocation?: {
    lat: number;
    lng: number;
  };
}
