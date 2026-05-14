import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          {/* Arka Plan Karartması */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            onClick={onClose}
          ></motion.div>

          {/* Modal İçeriği */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            
            {/* Kapat Butonu */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/30 hover:bg-red-500 hover:rotate-90 backdrop-blur-md text-white rounded-full p-2 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Görsel Slider Alanı */}
            <div className="relative w-full h-64 sm:h-[400px] bg-black flex-shrink-0 group overflow-hidden">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentIndex}
                    src={images[currentIndex]} 
                    alt={`${title} - Görsel ${currentIndex + 1}`} 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Görsel bulunamadı</div>
              )}

              {/* Slider Kontrolleri */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 text-white hover:text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 text-white hover:text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Nokta İndikatörleri (Artık tıklanabilir) */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {images.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentIndex 
                            ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                            : 'w-2.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Metin Alanı */}
            <div className="p-6 sm:p-8 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;