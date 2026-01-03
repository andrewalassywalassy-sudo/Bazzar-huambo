
import React, { useState, useEffect, useRef } from 'react';
import { Product, ChatMessage } from '../types';
import { getNegotiationAdvice } from '../services/geminiService';

interface ChatWindowProps {
  product: Product;
  currentUserId: string;
  onClose: () => void;
  onNewMessage?: (msg: ChatMessage) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ product, currentUserId, onClose, onNewMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: product.sellerId,
      receiverId: currentUserId,
      productId: product.id,
      text: `Olá! Você tem interesse no produto ${product.title}?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isTypingAdvice, setIsTypingAdvice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: product.sellerId,
      productId: product.id,
      text: inputText.trim() || undefined,
      image: selectedImage || undefined,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');
    setSelectedImage(null);
    
    if (onNewMessage) onNewMessage(newMessage);

    // Trigger AI Advice update based on text messages
    const textHistory = updatedMessages.filter(m => m.text).map(m => m.text as string);
    if (textHistory.length > 2 && !isTypingAdvice) {
      updateAiAdvice(textHistory);
    }
  };

  const updateAiAdvice = async (textHistory: string[]) => {
    setIsTypingAdvice(true);
    const advice = await getNegotiationAdvice(product, textHistory);
    setAiAdvice(advice);
    setIsTypingAdvice(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col md:max-w-md md:mx-auto md:shadow-2xl md:relative md:inset-auto md:h-[80vh] md:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-3 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center">
            <img src={`https://picsum.photos/seed/${product.sellerId}/40/40`} className="w-10 h-10 rounded-full border-2 border-blue-900" alt="Seller" />
            <div className="ml-3">
              <h4 className="font-bold text-gray-900 text-sm leading-tight">{product.sellerName}</h4>
              <p className="text-[10px] text-green-600 font-medium">Online</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-medium">Negociação</p>
          <p className="text-xs font-bold text-blue-900 truncate max-w-[100px]">{product.title}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${
              msg.senderId === currentUserId 
                ? 'bg-[#162a3d] text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Sent" className="w-full max-h-64 object-cover" />
              )}
              {msg.text && (
                <div className="px-4 py-2 text-sm">{msg.text}</div>
              )}
              <div className={`text-[9px] px-3 pb-1 text-right ${msg.senderId === currentUserId ? 'text-gray-300' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {aiAdvice && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start space-x-3">
            <div className="bg-blue-900 p-1.5 rounded-full flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Bazzar AI Tip</p>
              <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">{aiAdvice}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white">
        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mb-3 inline-block">
            <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-blue-900" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-900 transition-colors p-1"
            title="Tirar foto ou escolher ficheiro"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-900 outline-none"
          />
          
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedImage}
            className="bg-[#162a3d] text-white p-2.5 rounded-full disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
