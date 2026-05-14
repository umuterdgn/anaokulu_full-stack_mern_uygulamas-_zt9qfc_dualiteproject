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
  images: string[]; // GÜNCELLENDİ: Çoklu görsel için dizi
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("/api/activities");
        setActivities(res.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <PageTransition>
      <section className="py-20 px-8 min-h-[calc(100vh-72px)] bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Aktivitelerimiz
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
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
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <motion.div
                    key={activity._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}>
                    <Card
                      title={activity.title}
                      images={activity.images || []}
                      imageUrl={activity.imageUrl} // BÜYÜK KURTARICI BURASI! Eski görsellerini geri getirecek.
                      onClick={() => setSelectedItem(activity)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  Henüz aktivite eklenmemiş.
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
        images={selectedItem?.images || []} // GÜNCELLENDİ
      />
    </PageTransition>
  );
};

export default Activities;
