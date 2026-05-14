import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface CardProps {
  title: string;
  images?: string[];    // Yeni sistem verisi
  imageUrl?: string;    // Eski sistem verisi (Görsellerin görünmeme sorununu çözer)
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, images, imageUrl, onClick }) => {
  // Akıllı Görsel Seçici: Önce yeni sistemi (images), yoksa eski sistemi (imageUrl), o da yoksa boş bir görsel gösterir.
  const coverImage = (images && images.length > 0) 
    ? images[0] 
    : (imageUrl ? imageUrl : 'https://placehold.co/600x400/ffe4e6/fb7185?text=Gorsel+Yok');

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-3 border-4 border-transparent hover:border-orange-400 shadow-xl hover:shadow-2xl hover:shadow-orange-400/30"
    >
      {/* Çoklu Fotoğraf Rozeti (Sticker tarzı eğlenceli görünüm) */}
      {images && images.length > 1 && (
        <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{images.length} Foto</span>
        </div>
      )}

      {/* Süsleme İkonu (Hover olunca sağ üstte beliren tatlı yıldızlar) */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:rotate-12">
        <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-md" />
      </div>

      {/* Görsel Alanı */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-50 rounded-t-[2rem]">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
        />
      </div>

      {/* Metin ve Buton Alanı */}
      <div className="p-6 text-center bg-white">
        <h3 className="text-2xl font-black text-gray-800 tracking-tight group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <div className="mt-4 inline-block bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-white group-hover:scale-105 shadow-sm">
          Detayları İncele
        </div>
      </div>
    </div>
  );
};

export default Card;