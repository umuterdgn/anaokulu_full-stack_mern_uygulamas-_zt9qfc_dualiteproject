import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const About: React.FC = () => {
  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        {/* Arka Plan Videosu */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.4]"
        >
          <source src="https://www.pexels.com/tr-tr/download/video/7106709/" type="video/mp4" />
        </video>

        {/* İçerik */}
        <div className="relative z-10 py-20 px-8 max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-xl"
          >
            Hakkımızda
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl"
          >
            <p className="text-xl text-gray-800 leading-relaxed mb-6 font-medium">
              Mutlu Çocuklar Anaokulu olarak misyonumuz, her çocuğun bireysel farklılıklarını gözeterek, 
              onların fiziksel, zihinsel ve duygusal gelişimlerini en üst düzeye çıkarmaktır. 
            </p>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              Modern eğitim yaklaşımlarımız ve sevgi dolu uzman kadromuzla, çocuklarınızı geleceğe hazırlıyoruz.
              Güvenli, eğlenceli ve öğretici bir ortamda, çocuklarınızın potansiyellerini keşfetmelerine yardımcı oluyoruz.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
