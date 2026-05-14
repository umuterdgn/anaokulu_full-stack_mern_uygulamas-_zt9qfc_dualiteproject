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
  Edit, // Yeni eklendi
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
}

const Admin: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"activities" | "services">("activities");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Düzenleme State'i
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Form States
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
    cancelEdit(); // Tab değiştiğinde formu temizle
  }, [activeTab]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // --- DÜZENLEME MODUNA GEÇİŞ ---
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setPreviews(item.images || []); // Eski resimleri önizlemede göster
    setFiles([]); // Yeni dosya seçilmediği için boş bırakıyoruz
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Formun olduğu en üste kaydır
  };

  // --- İPTAL ET BUTONU ---
  const cancelEdit = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setFiles([]);
    setPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Eğer yeni ekliyorsak resim zorunlu, düzenliyorsak eski resimler zaten var diye zorunlu değil.
    if (!title || !description || (!editingItem && files.length === 0)) {
      return alert("Lütfen tüm alanları doldurun ve en az bir resim seçin.");
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingItem) {
        // GÜNCELLEME İŞLEMİ (PUT)
        await axios.put(`/api/${activeTab}/${editingItem._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // YENİ EKLEME İŞLEMİ (POST)
        await axios.post(`/api/${activeTab}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      cancelEdit(); // Formu temizle
      fetchItems(); // Listeyi güncelle
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("İşlem sırasında bir hata oluştu.");
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
      if(editingItem?._id === id) cancelEdit(); // Eğer silinen öğe şu an düzenleniyorsa formu temizle
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
            <a href="/" className="text-blue-500 hover:underline font-semibold flex items-center">
              Siteye Dön
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-4 h-4" /> Çıkış
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab("activities")} className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "activities" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Aktiviteler
          </button>
          <button onClick={() => setActiveTab("services")} className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "services" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Hizmetler
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className={`lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-fit border-2 transition-colors ${editingItem ? "border-yellow-400" : "border-transparent"}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingItem ? <Edit className="w-5 h-5 text-yellow-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
              {editingItem ? "Kaydı Düzenle" : `Yeni ${activeTab === "activities" ? "Aktivite" : "Hizmet"} Ekle`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görseller (Sürükle & Bırak)
                  {editingItem && <span className="text-xs text-gray-500 font-normal ml-2">(Yeni seçersen eskileri silinir)</span>}
                </label>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}>
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Görselleri buraya sürükleyin veya seçin</p>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 shadow-sm">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-20 object-cover" />
                        <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {editingItem && (
                  <button type="button" onClick={cancelEdit} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                    İptal
                  </button>
                )}
                <button type="submit" disabled={submitLoading} className={`flex-1 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 ${editingItem ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingItem ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {submitLoading ? "Kaydediliyor..." : editingItem ? "Güncelle" : "Kaydet"}
                </button>
              </div>
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
              <p className="text-gray-500 text-center p-8 border border-dashed rounded-lg">Henüz kayıt bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition ${editingItem?._id === item._id ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"}`}>
                    
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <>
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-lg shadow-sm" />
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
                      <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(item)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-full transition" title="Düzenle">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition" title="Sil">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

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
