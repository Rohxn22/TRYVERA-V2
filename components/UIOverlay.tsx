import React, { useState } from 'react';
import { Product } from '../types';
import { Camera, RefreshCw, ShoppingBag, MoreVertical, SwitchCamera } from 'lucide-react';

interface UIOverlayProps {
  products: Product[];
  selectedProduct: Product | null;
  isProcessing: boolean;
  onSelectProduct: (product: Product) => void;
  onReset: () => void;
  onToggleCamera: () => void;
  hasResult: boolean;
}

const ProductButton: React.FC<{
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}> = ({ product, isSelected, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`relative group flex-shrink-0 snap-center transition-all duration-300 ${
        isSelected ? 'transform scale-110 -translate-y-2' : 'opacity-80'
      }`}
    >
      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg transition-all relative bg-gray-800 ${
         isSelected ? 'border-yellow-400 ring-4 ring-yellow-400/30' : 'border-white'
      }`}>
        {!imageError ? (
          <img 
            src={product.thumbnail} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white/50 text-[10px] font-bold p-1 text-center leading-tight">
            {product.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
        )}
      </div>
      {isSelected && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full border border-white/20 text-white">
              Try On
          </div>
      )}
    </button>
  );
};

const UIOverlay: React.FC<UIOverlayProps> = ({
  products,
  selectedProduct,
  isProcessing,
  onSelectProduct,
  onReset,
  onToggleCamera,
  hasResult
}) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
           {/* Rebranded Header */}
           <div className="flex flex-col">
             <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">Tryvera</h1>
             <span className="text-[10px] text-gray-200 drop-shadow-md opacity-80 uppercase tracking-widest">Virtual Studio</span>
           </div>
        </div>
        <div className="flex gap-4 text-white drop-shadow-md items-center">
          <button 
            onClick={onToggleCamera} 
            className="hover:scale-110 active:scale-95 transition-transform"
            aria-label="Switch Camera"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Sidebar Controls */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-6 items-center pointer-events-auto">
        <div className="flex flex-col items-center gap-1">
            <ShoppingBag className="w-7 h-7 text-white drop-shadow-lg" />
            <span className="text-xs font-medium drop-shadow-md">Buy</span>
        </div>
         <div className="flex flex-col items-center gap-1">
            <MoreVertical className="w-7 h-7 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col justify-end pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        
        {/* Reset / Status Button */}
        <div className="flex justify-center mb-4 pointer-events-auto">
          {isProcessing ? (
             <div className="flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-lg rounded-full text-white font-medium animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating your look...</span>
             </div>
          ) : hasResult ? (
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition transform"
            >
              <Camera className="w-4 h-4" />
              <span>Back to Camera</span>
            </button>
          ) : (
            <div className="text-xs text-center text-white/70 animate-bounce">
              Tap a style below to try on
            </div>
          )}
        </div>

        {/* Product Carousel */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-8 no-scrollbar pointer-events-auto snap-x">
          {products.map((product) => (
            <ProductButton
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onClick={() => !isProcessing && onSelectProduct(product)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default UIOverlay;