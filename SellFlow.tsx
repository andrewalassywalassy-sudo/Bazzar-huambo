
import React, { useState, useRef } from 'react';
import { Category } from '../types';

interface SellFlowProps {
  onPost: (product: any) => void;
  onCancel: () => void;
  currency: string;
}

const SellFlow: React.FC<SellFlowProps> = ({ onPost, onCancel, currency }) => {
  const [step, setStep] = useState<'choice' | 'details'>('choice');
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(Category.AGRICULTURE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep('details');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPost({
      title,
      description,
      price: parseFloat(price),
      category,
      image,
      createdAt: new Date().toISOString(),
    });
  };

  if (step === 'choice') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <h2 className="text-2xl font-black text-[#162a3d] mb-12 uppercase tracking-tight text-center">
          O que você quer anunciar?
        </h2>
        
        <div className="flex space-x-12">
          {/* Botão de Câmera */}
          <div className="flex flex-col items-center space-y-4 opacity-0 animate-pop-in">
            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="w-24 h-24 bg-[#162a3d] text-white rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tirar Foto</span>
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          {/* Botão de Galeria */}
          <div className="flex flex-col items-center space-y-4 opacity-0 animate-pop-in delay-100">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-white border-2 border-[#162a3d] text-[#162a3d] rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Escolher Arquivo</span>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-12">
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-lg px-4 py-4 border-b flex items-center justify-between">
        <button onClick={() => setStep('choice')} className="text-[#162a3d] font-bold text-sm flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>
        <h2 className="font-black text-xs uppercase tracking-widest text-[#162a3d]">Detalhes do Anúncio</h2>
        <div className="w-12"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-8">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-2xl ring-1 ring-black/5">
          <img src={image!} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button" 
            onClick={() => setStep('choice')}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-2xl shadow-xl text-red-500 active:scale-90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Título do Produto</label>
            <input 
              required
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Drone Agrícola DJI"
              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-[#162a3d] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Preço</label>
              <div className="relative">
                <input 
                  required
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-[#162a3d] outline-none transition-all shadow-sm pl-16"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#162a3d] font-black text-xs">{currency}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-[#162a3d] outline-none transition-all shadow-sm appearance-none font-bold text-gray-700"
              >
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Descrição</label>
            <textarea 
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte mais sobre o estado e características..."
              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-[#162a3d] outline-none transition-all shadow-sm resize-none"
            ></textarea>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#162a3d] text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-[#162a3d]/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3"
        >
          <span>Anunciar agora</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SellFlow;
