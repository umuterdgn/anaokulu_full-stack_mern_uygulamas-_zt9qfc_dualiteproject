import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Card from "../components/Card";
import Modal from "../components/Modal";
import PageTransition from "../components/PageTransition";
import { Loader2 } from "lucide-react";

interface Item {
  _id: string;
  title: string;
  description: string;
  images?: string[]; // Yeni sistem verisi
  imageUrl?: string; // Eski sistem verisi
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/services");
        setServices(res.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <PageTransition>
      <section className="py-20 px-8 min-h-[calc(100vh-72px)] bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Hizmetlerimiz
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}>
              {services.length > 0 ? (
                services.map((service) => (
                  <motion.div
                    key={service._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}>
                    <Card
                      title={service.title}
                      images={service.images || []}
                      imageUrl={service.imageUrl} // Kartta eski görseli yakalıyoruz
                      onClick={() => setSelectedItem(service)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  Henüz hizmet eklenmemiş.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || ""}
        description={selectedItem?.description || ""}
        // BÜYÜK KURTARICI 2: Eğer yeni 'images' dizisi varsa onu gönder.
        // Yoksa ve eski 'imageUrl' varsa onu tek elemanlı bir dizi yapıp gönder.
        images={
          selectedItem?.images && selectedItem.images.length > 0
            ? selectedItem.images
            : selectedItem?.imageUrl
            ? [selectedItem.imageUrl]
            : []
        }
      />
    </PageTransition>
  );
};

export default Services;