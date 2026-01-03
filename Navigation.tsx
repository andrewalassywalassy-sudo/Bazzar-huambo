
import React from 'react';

interface NavigationProps {
  activeTab: 'home' | 'search' | 'sell' | 'chat' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'sell' | 'chat' | 'profile') => void;
  unreadCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, unreadCount }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'search', label: 'Explorar', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'sell', label: 'Vender', icon: 'M12 4v16m8-8H4' },
    { id: 'chat', label: 'Mensagens', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'profile', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[32px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex flex-col items-center relative transition-all duration-500 ${
            activeTab === tab.id ? 'text-[#162a3d] -translate-y-1' : 'text-gray-400'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-[#162a3d]/5' : 'bg-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === tab.id ? 2.5 : 2} d={tab.icon} />
            </svg>
          </div>
          <span className={`text-[9px] mt-1 font-black uppercase tracking-tighter transition-opacity duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 h-0'}`}>{tab.label}</span>
          {tab.id === 'chat' && unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
