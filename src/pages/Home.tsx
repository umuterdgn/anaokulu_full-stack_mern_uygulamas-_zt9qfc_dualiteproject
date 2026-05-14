import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Star, ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Card from "../components/Card";
import Modal from "../components/Modal";

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[]; // GÜNCELLENDİ
}

const Home: React.FC = () => {
  const [services, setServices] = useState<Item[]>([]);
  const [activities, setActivities] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, activitiesRes] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/activities"),
        ]);
        setServices(servicesRes.data.slice(0, 3));
        setActivities(activitiesRes.data.slice(0, 3));
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <PageTransition>
      <div className="w-full">
        {/* 1. Hero Section (Video Arka Plan) */}
        <section className="relative h-[calc(100vh-72px)] w-full overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.6]">
            <source
              src="https://www.pexels.com/tr-tr/download/video/6299087/"
              type="video/mp4"
            />
          </video>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
              Çocuklarınızın İkinci Evi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-white mb-10 font-medium drop-shadow-md">
              Sevgiyle büyüyen, oyunla öğrenen mutlu nesiller yetiştiriyoruz.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-4 justify-center">
              <Link
                to="/iletisim"
                className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-orange-600 hover:scale-105 transition transform">
                Bize Katılın
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. Kısaca Hakkımızda */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Kısaca Hakkımızda
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Mutlu Çocuklar Anaokulu olarak, çocuklarımızın en verimli
                çağlarında onlara güvenli, sevgi dolu ve eğitici bir ortam
                sunuyoruz. Uzman eğitim kadromuzla, her çocuğun potansiyelini
                keşfetmesine rehberlik ediyoruz.
              </p>
              <Link
                to="/hakkimizda"
                className="inline-flex items-center text-orange-500 font-bold text-lg hover:underline">
                Devamını Oku <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-2xl h-80 relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover">
                <source
                  src="https://www.pexels.com/tr-tr/download/video/5273820/"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </div>
        </section>

        {/* 3. Hizmetlerimiz (Önizleme) */}
        <section className="py-24 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-bold text-gray-800">
                Hizmetlerimiz
              </h2>
              <Link
                to="/hizmetler"
                className="text-blue-500 font-bold hover:underline flex items-center">
                Tümünü Gör <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.length > 0 ? (
                services.map((service) => (
                  <Card
                    key={service._id}
                    title={service.title}
                    images={service.images || []} // GÜNCELLENDİ
                    onClick={() => setSelectedItem(service)}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-3">
                  Hizmetler yükleniyor veya henüz eklenmemiş.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 4. Aktivitelerimiz (Önizleme) */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-bold text-gray-800">
                Aktivitelerimiz
              </h2>
              <Link
                to="/aktiviteler"
                className="text-green-500 font-bold hover:underline flex items-center">
                Tümünü Gör <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <Card
                    key={activity._id}
                    title={activity.title}
                    images={activity.images || []} // GÜNCELLENDİ
                    onClick={() => setSelectedItem(activity)}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-3">
                  Aktiviteler yükleniyor veya henüz eklenmemiş.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 5. Müşteri Memnuniyeti */}
        <section className="py-24 px-8 bg-yellow-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              Velilerimiz Ne Diyor?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Ayşe Yılmaz",
                  text: "Çocuğum her gün okula gitmek için can atıyor. Öğretmenlerin ilgisi harika!",
                },
                {
                  name: "Mehmet Demir",
                  text: "Güvenlik, temizlik ve eğitim kalitesi açısından beklentilerimizin çok üstünde.",
                },
                {
                  name: "Elif Kaya",
                  text: "Aktiviteler o kadar çeşitli ki, kızımın yeteneklerini keşfetmesine çok yardımcı oldu.",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <h4 className="font-bold text-gray-800">
                    - {testimonial.name}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title || ""}
          description={selectedItem?.description || ""}
          images={selectedItem?.images || []} // GÜNCELLENDİ
        />
      </div>
    </PageTransition>
  );
};

export default Home;
