
import React, { useRef, useState } from 'react';
import { AccountType, AppTheme } from '../types';
import TermsOfService from './TermsOfService';

interface ProfilePageProps {
  user: {
    name: string;
    avatar: string;
    accountType: AccountType;
  };
  settings: {
    theme: AppTheme;
    notifications: boolean;
    language: string;
  };
  onUpdateAvatar: (base64: string) => void;
  onUpdateTheme: (theme: AppTheme) => void;
  onTogglePremium: () => void;
  onUpdateSettings: (key: string, value: any) => void;
  onOpenAdmin: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, settings, onUpdateAvatar, onUpdateTheme, onTogglePremium, onUpdateSettings, onOpenAdmin
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTerms, setShowTerms] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const themes: { id: AppTheme; color: string; label: string }[] = [
    { id: 'navy', color: 'bg-[#162a3d]', label: 'Padrão' },
    { id: 'sunset', color: 'bg-orange-600', label: 'Sunset' },
    { id: 'forest', color: 'bg-emerald-700', label: 'Selva' },
  ];

  return (
    <div className="p-5 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}

      <div className="flex flex-col items-center py-10 bg-white rounded-[40px] shadow-xl border border-gray-50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white" />
        
        {user.accountType === 'Premium' && (
          <div className="absolute top-6 right-6 bg-yellow-400 text-[#162a3d] text-[10px] font-black px-3 py-1.5 rounded-2xl flex items-center shadow-lg animate-pulse z-10">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ESTRELA PREMIUM
          </div>
        )}
        
        <div className="relative z-10">
          <div className="w-32 h-32 rounded-[48px] overflow-hidden border-4 border-white shadow-2xl transition-transform hover:rotate-3">
            <img 
              src={user.avatar} 
              className="w-full h-full object-cover" 
              alt="Avatar do Usuário" 
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-2xl text-blue-900 border border-gray-50 active:scale-90 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
        
        <h3 className="mt-6 text-2xl font-black text-gray-900 uppercase tracking-tighter">{user.name}</h3>
        <button onDoubleClick={onOpenAdmin} className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1 focus:outline-none">Vendedor Verificado</button>
      </div>

      <div className={`p-6 rounded-[32px] shadow-sm border-2 transition-all ${user.accountType === 'Premium' ? 'bg-gradient-to-br from-yellow-50/50 to-orange-50/50 border-yellow-200' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status da Conta</h4>
            <p className="text-sm font-bold text-gray-800">
              {user.accountType === 'Premium' 
                ? 'Você é um vendedor destaque em toda a rede!' 
                : 'Conta Normal'}
            </p>
          </div>
          <button 
            onClick={onTogglePremium}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
              user.accountType === 'Premium' 
                ? 'bg-white text-gray-500 border border-gray-200' 
                : 'bg-yellow-400 text-[#162a3d] shadow-yellow-200/50'
            }`}
          >
            {user.accountType === 'Premium' ? 'Remover Pro' : 'Ativar Premium'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Configurações</h4>
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
          <div>
            <p className="text-xs font-black text-gray-800 mb-5 uppercase tracking-wider">Aparência do App</p>
            <div className="flex space-x-6">
              {themes.map(t => (
                <button 
                  key={t.id}
                  onClick={() => onUpdateTheme(t.id)}
                  className="flex flex-col items-center space-y-3"
                >
                  <div className={`w-14 h-14 rounded-3xl ${t.color} ${settings.theme === t.id ? 'ring-4 ring-offset-4 ring-blue-500 shadow-2xl' : 'opacity-40'} transition-all duration-300`} />
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-50" />

          <button 
            onClick={() => setShowTerms(true)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 text-left">
               <div className="bg-gray-50 p-3 rounded-2xl">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-800">Termos e Licença</p>
                 <p className="text-[10px] text-gray-400 font-medium">Privacidade e Regras de Uso</p>
               </div>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="bg-gray-50 p-3 rounded-2xl">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-800">Notificações</p>
                 <p className="text-[10px] text-gray-400 font-medium">Alertas de vendas e chat</p>
               </div>
            </div>
            <button 
              onClick={() => onUpdateSettings('notifications', !settings.notifications)}
              className={`w-14 h-7 rounded-full transition-all relative ${settings.notifications ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${settings.notifications ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="pb-12 px-2">
        <button className="w-full bg-red-50 text-red-500 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-sm border border-red-100 transition-transform active:scale-95">
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
