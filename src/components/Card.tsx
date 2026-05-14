import React from 'react';
import { Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';

interface CardProps {
  title: string;
  images?: string[];
  imageUrl?: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, images, imageUrl, onClick }) => {
  const coverImage = (images && images.length > 0) 
    ? images[0] 
    : (imageUrl ? imageUrl : 'https://placehold.co/600x400/f8fafc/94a3b8?text=Gorsel+Yok');

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col"
    >
      {/* Görsel Alanı */}
      <div className="relative w-full h-60 overflow-hidden bg-gray-50">
        
        {/* Sinematik Hover Gradient'i */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <img 
          src={coverImage} 
          alt={title} 
          /* GÜNCELLEME BURADA: 
            - object-center: Resmi her zaman tam ortadan odaklar.
            - scale-105: Üzerine gelince devasa büyümek yerine çok hafif ve şık bir şekilde yaklaşır.
          */
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105" 
        />

        {/* Modern Fotoğraf Rozeti */}
        {images && images.length > 1 && (
          <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-black/30 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{images.length}</span>
          </div>
        )}

        {/* Zarif Süsleme İkonu */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Metin ve Etkileşim Alanı */}
      <div className="p-6 bg-white relative z-20 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
          {title}
        </h3>
        
        {/* Modern, Minimalist "İncele" Butonu */}
        <div className="mt-6 flex items-center text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
          <span>Detayları İncele</span>
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Card;
