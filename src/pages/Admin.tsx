import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[]; // Artık tek resim değil, resim dizisi alıyoruz
}

const Admin: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"activities" | "services">(
    "activities",
  );
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form States (Çoklu dosya için dizi kullanıyoruz)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/${activeTab}`);
      setItems(res.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Yeni eklenen dosyaları mevcutların üzerine ekliyoruz
    setFiles((prev) => [...prev, ...acceptedFiles]);

    // Her yeni dosya için bir önizleme URL'i oluşturuyoruz
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true, // Çoklu görsel seçimine izin verildi
  });

  // Seçilen bir görseli yüklemeden önce listeden çıkarmak için
  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || files.length === 0) {
      return alert("Lütfen tüm alanları doldurun ve en az bir resim seçin.");
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Birden fazla dosyayı formData'ya ekliyoruz (Backend 'images' olarak bekleyecek)
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(`/api/${activeTab}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // Başarılı olursa formu temizle
      setTitle("");
      setDescription("");
      setFiles([]);
      setPreviews([]);
      fetchItems();
    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Eklenirken bir hata oluştu. Yetkiniz olmayabilir.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`/api/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silinemedi. Yetkiniz olmayabilir.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Yönetim Paneli</h1>
          <div className="flex gap-4">
            <a
              href="/"
              className="text-blue-500 hover:underline font-semibold flex items-center">
              Siteye Dön
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-4 h-4" /> Çıkış
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "activities" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Aktiviteler
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "services" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Hizmetler
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Yeni {activeTab === "activities" ? "Aktivite" : "Hizmet"} Ekle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görseller (Sürükle & Bırak)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}>
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">
                      Görselleri buraya sürükleyin veya seçin
                    </p>
                  </div>
                </div>

                {/* Seçilen Görsellerin Önizlemesi */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {previews.map((src, index) => (
                      <div
                        key={index}
                        className="relative group rounded-md overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition flex justify-center items-center gap-2 disabled:opacity-70 mt-4">
                {submitLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {submitLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Mevcut Kayıtlar</h2>
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-gray-500 text-center p-8 border border-dashed rounded-lg">
                Henüz kayıt bulunmuyor.
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition bg-gray-50">
                    {/* Kapak fotoğrafı olarak dizideki ilk görseli gösteriyoruz */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <>
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow border-2 border-white">
                            {item.images.length}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Sil">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
