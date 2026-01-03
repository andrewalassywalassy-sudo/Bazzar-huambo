
import React from 'react';
import { Product, Category } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onDeleteProduct, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-[250] flex flex-col animate-in fade-in duration-300">
      <header className="p-6 bg-red-600 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <h2 className="font-black uppercase tracking-tighter">Painel de Controle Bazzar</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase">Total de Itens</p>
            <p className="text-2xl font-black text-gray-900">{products.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase">Países Ativos</p>
            <p className="text-2xl font-black text-gray-900">{Array.from(new Set(products.map(p => p.country))).length}</p>
          </div>
        </div>

        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Gerenciar Catálogo</h3>
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-3">
                <img src={product.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{product.category}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if(confirm('Tem certeza que deseja excluir este produto do catálogo público?')) {
                    onDeleteProduct(product.id);
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 border-t">
        <p className="text-[9px] text-center text-gray-400 font-bold uppercase">Atenção: Ações aqui são permanentes no banco de dados local.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
