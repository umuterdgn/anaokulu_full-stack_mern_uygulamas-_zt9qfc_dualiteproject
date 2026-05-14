import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Contact: React.FC = () => {
  return (
    <PageTransition>
      <section className="py-20 px-8bg-pastel-yellow min-h-[calc(100vh-72px)] flex items-center">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full">
          <div className="md:w-1/2 bg-gray-200 min-h-[400px] relative">
            <iframe 
              src= "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25636.48171818969!2d36.12515777349472!3d36.56471559749135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152f5937a100c7ab%3A0xa94b66f1874d86db!2s%C3%87ocuk%20Eli%20Anaokulu!5e0!3m2!1str!2str!4v1778424324058!5m2!1str!2str"
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen={false} 
              loading="lazy"
            ></iframe>
          </div>
          <div className="md:w-1/2 p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bize Ulaşın</h2>
            <div className="space-y-4 mb-8">
              <p className="flex items-center text-gray-600"><MapPin className="w-5 h-5 mr-3 text-pastel-orange" />  Numune, 573/9. Sk. no:2A/A, 31200 İskenderun/Hatay</p>
              <p className="flex items-center text-gray-600"><Phone className="w-5 h-5 mr-3 text-pastel-orange" /> +9 0530 131 02 04</p>
              <p className="flex items-center text-gray-600"><Mail className="w-5 h-5 mr-3 text-pastel-orange" /> info@COCUKELİ.com</p>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Adınız Soyadınız" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-orange" />
              <input type="email" placeholder="E-posta Adresiniz" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-orange" />
              <textarea placeholder="Mesajınız" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-orange"></textarea>
              <button className="w-full bg-pastel-orange text-white font-bold py-3 rounded-lg hover:bg-orange-400 transition">Gönder</button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;
