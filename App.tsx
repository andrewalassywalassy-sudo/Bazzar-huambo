
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Category, Product, UserPreferences, Conversation, AppTheme, AccountType } from './types';
import { CATEGORY_ICONS, COUNTRY_CURRENCY_MAP } from './constants';
import ProductCard from './components/ProductCard';
import Navigation from './components/Navigation';
import ChatWindow from './components/ChatWindow';
import ChatList from './components/ChatList';
import SellFlow from './components/SellFlow';
import ProfilePage from './components/ProfilePage';
import SearchFilters from './components/SearchFilters';
import AdminDashboard from './components/AdminDashboard';
import { getAiRecommendedProducts } from './services/geminiService';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Tecido Nigerian Hand-Woven (Aso Oke)',
    description: 'Belo tecido feito à mão em Lagos. Algodão 100% de alta qualidade.',
    price: 45000,
    currency: 'NGN',
    category: Category.TEXTILES,
    images: ['https://picsum.photos/seed/aso-oke/600/600'],
    sellerId: 'u1',
    sellerName: 'Ade Fabrics',
    sellerRating: 4.8,
    lat: 6.5244,
    lng: 3.3792,
    city: 'Lagos',
    country: 'Nigéria',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    title: 'Chá Rooibos Atacado África do Sul',
    description: 'Chá Rooibos a granel de Cederberg. Certificado orgânico.',
    price: 1200,
    currency: 'ZAR',
    category: Category.AGRICULTURE,
    images: ['https://picsum.photos/seed/rooibos/600/600'],
    sellerId: 'u2',
    sellerName: 'Cape Exports',
    sellerRating: 4.5,
    lat: -33.9249,
    lng: 18.4241,
    city: 'Cape Town',
    country: 'África do Sul',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 1000000, 
  maxDistance: 10000, 
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'sell' | 'chat' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [userCountry, setUserCountry] = useState('Brasil');
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bazzar_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('bazzar_user');
    return saved ? JSON.parse(saved) : {
      name: 'Mateus Silva',
      avatar: 'https://picsum.photos/seed/user-mateus/200/200',
      accountType: 'Normal' as AccountType,
    };
  });

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('bazzar_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'navy' as AppTheme,
      notifications: true,
      language: 'PT-BR',
    };
  });

  const [searchFilters, setSearchFilters] = useState(DEFAULT_FILTERS);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('bazzar_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatProduct, setActiveChatProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('bazzar_products', JSON.stringify(products));
    localStorage.setItem('bazzar_user', JSON.stringify(userProfile));
    localStorage.setItem('bazzar_settings', JSON.stringify(appSettings));
    localStorage.setItem('bazzar_chats', JSON.stringify(conversations));
  }, [products, userProfile, appSettings, conversations]);

  const currentCurrency = useMemo(() => COUNTRY_CURRENCY_MAP[userCountry] || 'BRL', [userCountry]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const initAi = useCallback(async (location?: { lat: number, lng: number }) => {
    setIsRecommending(true);
    const userPrefs: UserPreferences = {
      favoriteCategories: [Category.AGRICULTURE, Category.TEXTILES],
      searchHistory: ['atacado chá', 'bomba solar'],
      theme: appSettings.theme,
      notifications: appSettings.notifications,
      language: appSettings.language as any,
    };
    const ids = await getAiRecommendedProducts(products, userPrefs, location);
    setRecommendedIds(ids);
    setIsRecommending(false);
  }, [products, appSettings]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          if (pos.coords.latitude < 0 && pos.coords.longitude > 0) setUserCountry('Moçambique');
          else if (pos.coords.latitude < 0 && pos.coords.longitude < 0) setUserCountry('Brasil');
          initAi(loc);
        },
        () => initAi()
      );
    } else {
      initAi();
    }
  }, [initAi]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    
    if (searchFilters.maxPrice < 1000000) {
      result = result.filter(p => p.price <= searchFilters.maxPrice);
    }

    if (userLocation) {
      result = result.map(p => ({
        ...p,
        distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
      }));
      if (searchFilters.maxDistance < 10000) {
        result = result.filter(p => (p.distance || 0) <= searchFilters.maxDistance);
      }
    }

    if (activeTab === 'home' && recommendedIds.length > 0) {
      result.sort((a, b) => {
        const indexA = recommendedIds.indexOf(a.id);
        const indexB = recommendedIds.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
    } else if (activeTab === 'search' && userLocation) {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    return result;
  }, [selectedCategory, searchQuery, userLocation, recommendedIds, activeTab, products, searchFilters]);

  const handleStartChat = (product: Product) => {
    if (!conversations.find(c => c.productId === product.id)) {
      const newConv: Conversation = {
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        lastTimestamp: new Date().toISOString(),
        unread: false
      };
      setConversations([newConv, ...conversations]);
    }
    setActiveChatProduct(product);
  };

  const handleSelectConversation = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setActiveChatProduct(product);
      setConversations(prev => prev.map(c => c.productId === productId ? { ...c, unread: false } : c));
    }
  };

  const handlePostProduct = (formData: any) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      currency: currentCurrency,
      category: formData.category,
      images: [formData.image],
      sellerId: 'me_123',
      sellerName: userProfile.name,
      sellerRating: 5.0,
      lat: userLocation?.lat || -23.5505,
      lng: userLocation?.lng || -46.6333,
      city: 'Localização Atual',
      country: userCountry,
      createdAt: formData.createdAt,
    };
    setProducts([newProduct, ...products]);
    setActiveTab('home');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const themeColors = {
    navy: 'bg-[#162a3d]',
    sunset: 'bg-orange-600',
    forest: 'bg-emerald-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 transition-all duration-500">
      {showAdmin && <AdminDashboard products={products} onDeleteProduct={handleDeleteProduct} onClose={() => setShowAdmin(false)} />}
      
      <header className={`sticky top-0 z-40 ${themeColors[appSettings.theme]} border-b border-white/10 text-white shadow-2xl`}>
        <div className="max-w-4xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2 rotate-3 hover:rotate-0 transition-transform">
                  <svg viewBox="0 0 100 100" className={`w-full h-full ${appSettings.theme === 'navy' ? 'text-[#162a3d]' : 'text-gray-900'}`} fill="currentColor">
                     <path d="M50 10 C30 10 15 25 15 45 C15 60 25 70 35 75 L35 90 L65 90 L65 75 C75 70 85 60 85 45 C85 25 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 55 68 62 60 65 L60 80 L40 80 L40 65 C32 62 25 55 25 45 C25 30 35 20 50 20 Z" />
                     <circle cx="50" cy="45" r="5" />
                     <rect x="48" y="55" width="4" height="15" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-[#162a3d] text-[7px] font-black px-1 rounded-sm shadow-sm border border-white">BETA</div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter leading-none uppercase italic">BAZZAR DIGITAL</h1>
                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-0.5">{userCountry} • {currentCurrency}</p>
              </div>
            </div>
            {activeTab !== 'chat' && (
               <div className="flex items-center space-x-3">
                 <button onClick={() => setActiveTab('chat')} className="p-2.5 text-white/90 bg-white/10 rounded-2xl relative transition-all active:scale-90 hover:bg-white/20">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                   {conversations.filter(c => c.unread).length > 0 && <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#162a3d] shadow-lg"></span>}
                 </button>
               </div>
            )}
          </div>
          {(activeTab === 'home' || activeTab === 'search') && (
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3.5 border-none bg-white/10 rounded-2xl leading-5 placeholder-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all shadow-inner font-bold"
                  placeholder="Pesquisar em toda a rede..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3.5 rounded-2xl transition-all shadow-xl active:scale-90 ${showFilters ? 'bg-white text-gray-900' : 'bg-white/10 text-white'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {(activeTab === 'home' || activeTab === 'search') && showFilters && (
        <SearchFilters 
          filters={searchFilters} 
          onUpdate={(key, val) => setSearchFilters(prev => ({ ...prev, [key]: val }))}
          onReset={() => setSearchFilters(DEFAULT_FILTERS)}
          currency={currentCurrency}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {activeTab === 'home' ? (
          <>
            <div className="flex overflow-x-auto space-x-3 pb-5 no-scrollbar">
              <button onClick={() => setSelectedCategory('All')} className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? themeColors[appSettings.theme] + ' text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}>Todos</button>
              {(Object.values(Category) as Category[]).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 transition-all ${selectedCategory === cat ? themeColors[appSettings.theme] + ' text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}>
                  <span className="w-4 h-4">{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 mb-4">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center">✨ Descobertas Inteligentes</h2>
              {isRecommending && <div className="text-[9px] text-[#162a3d] font-black uppercase animate-pulse">Sincronizando IA...</div>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={handleStartChat} />
              ))}
            </div>
          </>
        ) : activeTab === 'chat' ? (
          <ChatList conversations={conversations} onSelectConversation={handleSelectConversation} />
        ) : activeTab === 'sell' ? (
          <SellFlow onPost={handlePostProduct} onCancel={() => setActiveTab('home')} currency={currentCurrency} />
        ) : activeTab === 'profile' ? (
          <ProfilePage 
            user={userProfile} 
            settings={appSettings} 
            onUpdateAvatar={(img) => setUserProfile(p => ({ ...p, avatar: img }))}
            onUpdateTheme={(t) => setAppSettings(s => ({ ...s, theme: t }))}
            onTogglePremium={() => setUserProfile(p => ({ ...p, accountType: p.accountType === 'Normal' ? 'Premium' : 'Normal' }))}
            onUpdateSettings={(k, v) => setAppSettings(s => ({ ...s, [k]: v }))}
            onOpenAdmin={() => setShowAdmin(true)}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onClick={handleStartChat} />
            ))}
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={conversations.filter(c => c.unread).length} />
      
      {activeChatProduct && (
        <ChatWindow 
          product={activeChatProduct} 
          currentUserId="me_123" 
          onClose={() => setActiveChatProduct(null)} 
          onNewMessage={(msg) => {
            setConversations(prev => {
              const existing = prev.find(c => c.productId === activeChatProduct.id);
              if (existing) {
                return [{ ...existing, lastMessage: msg.text || 'Imagem', lastTimestamp: msg.timestamp, unread: msg.senderId !== 'me_123' }, ...prev.filter(c => c.productId !== activeChatProduct.id)];
              }
              return prev;
            });
          }}
        />
      )}
    </div>
  );
};

export default App;
