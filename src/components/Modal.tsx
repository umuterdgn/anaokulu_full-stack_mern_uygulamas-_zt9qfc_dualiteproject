import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  images: string[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          
          {/* Arka Plan Karartması (Daha yumuşak ve şık bir blur) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Konteyneri */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-10 flex flex-col max-h-[90vh] ring-1 ring-white/50"
          >
            
            {/* Zarif Kapat Butonu (Glassmorphism) */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 bg-white/70 hover:bg-white backdrop-blur-md text-slate-800 rounded-full p-2.5 shadow-sm transition-all duration-300 hover:scale-110 hover:text-red-500 group"
            >
              <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* Görsel Slider Alanı (Daha sinematik ve odaklı) */}
            <div className="relative w-full h-[35vh] min-h-[250px] sm:h-[45vh] bg-slate-100 flex-shrink-0 group overflow-hidden">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentIndex}
                    src={images[currentIndex]} 
                    alt={`${title} - Görsel ${currentIndex + 1}`} 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                  <span className="text-sm font-medium tracking-widest uppercase">Görsel Bulunamadı</span>
                </div>
              )}

              {/* Slider Kontrolleri */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-slate-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-white hover:text-slate-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Modern Nokta İndikatörleri */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    {images.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === currentIndex 
                            ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                            : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Resim Altı Yumuşak Geçiş (Gradient) */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10" />
            </div>

            {/* Metin Alanı (Dergi / Editöryal Tarzı) */}
            <div className="p-8 sm:p-10 overflow-y-auto bg-white relative scrollbar-hide md:scrollbar-default">
              
              <div className="max-w-3xl mx-auto">
                {/* Zarif Süsleme Çizgisi */}
                <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6" />
                
                {/* Modern Başlık */}
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
                  {title}
                </h3>
                
                {/* Okunabilirliği yüksek, ferah Açıklama */}
                <p className="text-slate-600 leading-relaxed text-lg font-light whitespace-pre-wrap">
                  {description}
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
