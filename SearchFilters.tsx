
import React from 'react';

interface SearchFiltersProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    maxDistance: number;
  };
  onUpdate: (key: string, value: number) => void;
  onReset: () => void;
  currency: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onUpdate, onReset, currency }) => {
  return (
    <div className="bg-white p-4 border-b border-gray-100 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#162a3d]">Filtros Avançados</h3>
        <button onClick={onReset} className="text-[10px] font-bold text-blue-600 uppercase">Limpar</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-gray-400 uppercase">Preço Máximo ({currency})</label>
          <input 
            type="range" 
            min="0" 
            max="1000000" 
            step="1000"
            value={filters.maxPrice}
            onChange={(e) => onUpdate('maxPrice', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#162a3d]"
          />
          <div className="text-[10px] font-bold text-gray-600">
            {filters.maxPrice >= 1000000 ? 'Sem limite' : `Até ${filters.maxPrice.toLocaleString('pt-BR')} ${currency}`}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold text-gray-400 uppercase">Raio de Distância Máxima (km)</label>
          <input 
            type="range" 
            min="10" 
            max="10000" 
            step="50"
            value={filters.maxDistance}
            onChange={(e) => onUpdate('maxDistance', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#162a3d]"
          />
          <div className="text-[10px] font-bold text-gray-600">
            {filters.maxDistance >= 10000 ? 'Toda a África' : `${filters.maxDistance.toLocaleString('pt-BR')} km`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
