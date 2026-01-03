
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-md text-[10px] font-bold text-gray-800 shadow-sm">
          {product.category}
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#162a3d] text-white rounded-md text-[10px] font-bold shadow-lg flex items-center">
          <svg className="w-2.5 h-2.5 mr-1 fill-current text-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {product.sellerRating}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">{product.title}</h3>
        <p className="text-[#162a3d] font-bold mt-1 text-lg">
          {product.currency} {product.price.toLocaleString()}
        </p>
        <div className="flex flex-col mt-2 space-y-1">
          <div className="flex items-center text-[10px] text-gray-500">
            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{product.city}, {product.country}</span>
          </div>
          {product.distance !== undefined && (
            <div className="text-[10px] font-medium text-blue-800/70">
              {product.distance < 1 ? '< 1 km away' : `${product.distance.toFixed(1)} km away`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
