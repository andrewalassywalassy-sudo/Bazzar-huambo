
import React from 'react';
import { Conversation } from '../types';

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (productId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, onSelectConversation }) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Sem conversas ainda</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Suas negociações aparecerão aqui. Comece a conversar com vendedores para ver suas mensagens.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((chat) => (
        <div 
          key={chat.productId}
          onClick={() => onSelectConversation(chat.productId)}
          className="flex items-center p-4 bg-white active:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="relative">
            <img 
              src={`https://picsum.photos/seed/${chat.sellerId}/100/100`} 
              className="w-14 h-14 rounded-full border-2 border-blue-900 object-cover" 
              alt={chat.sellerName}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md border-2 border-white overflow-hidden bg-gray-200">
              <img src={chat.productImage} className="w-full h-full object-cover" alt="Product" />
            </div>
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-gray-900 truncate text-sm">{chat.sellerName}</h4>
              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                {new Date(chat.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-[11px] font-bold text-blue-900 truncate mb-0.5">{chat.productTitle}</p>
            <p className={`text-xs truncate ${chat.unread ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
              {chat.lastMessage || 'Envie uma imagem ou mensagem...'}
            </p>
          </div>
          {chat.unread && (
            <div className="ml-3 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
