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
  Edit,
  Video // Video ikonu eklendi
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
  // Yeni sekme eklendi: settings
  const [activeTab, setActiveTab] = useState<"activities" | "services" | "settings">("activities");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Settings/Video State'leri
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [aboutVideoUrl, setAboutVideoUrl] = useState("");
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);
  const [aboutVideoFile, setAboutVideoFile] = useState<File | null>(null);

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
      if (activeTab === "settings") {
        const res = await axios.get("/api/settings");
        if (res.data) {
          setHeroVideoUrl(res.data.heroVideo || "");
          setAboutVideoUrl(res.data.aboutVideo || "");
        }
      } else {
        const res = await axios.get(`/api/${activeTab}`);
        setItems(res.data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    cancelEdit();
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

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setPreviews(item.images || []);
    setFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setFiles([]);
    setPreviews([]);
  };

  // Ayarları (Videoları) Kaydetme Fonksiyonu
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroVideoFile && !aboutVideoFile) {
      return alert("Lütfen değiştirmek istediğiniz videoyu seçin.");
    }

    setSubmitLoading(true);
    const formData = new FormData();
    if (heroVideoFile) formData.append("heroVideo", heroVideoFile);
    if (aboutVideoFile) formData.append("aboutVideo", aboutVideoFile);

    try {
      await axios.put("/api/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Videolar başarıyla güncellendi!");
      setHeroVideoFile(null);
      setAboutVideoFile(null);
      fetchItems();
    } catch (error) {
      console.error("Video güncelleme hatası:", error);
      alert("Yükleme sırasında hata oluştu. Video boyutu çok büyük olabilir.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || (!editingItem && files.length === 0)) {
      return alert("Lütfen tüm alanları doldurun ve en az bir resim seçin.");
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("images", file));

    try {
      if (editingItem) {
        await axios.put(`/api/${activeTab}/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`/api/${activeTab}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      }
      cancelEdit();
      fetchItems();
    } catch (error) {
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
      if(editingItem?._id === id) cancelEdit();
      fetchItems();
    } catch (error) {
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

        {/* Sekmeler (Tabs) */}
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab("activities")} className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "activities" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Aktiviteler
          </button>
          <button onClick={() => setActiveTab("services")} className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "services" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Hizmetler
          </button>
          <button onClick={() => setActiveTab("settings")} className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === "settings" ? "bg-purple-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Anasayfa Videoları
          </button>
        </div>

        {/* EĞER SETTINGS (VİDEOLAR) SEKMESİ SEÇİLİYSE */}
        {activeTab === "settings" ? (
           <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-purple-500">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <Video className="w-6 h-6 text-purple-500" />
               Anasayfa Videolarını Yönet
             </h2>
             <form onSubmit={handleSettingsSubmit} className="space-y-8">
               
               {/* 1. Hero Video */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border">
                 <div>
                   <label className="block text-lg font-bold text-gray-800 mb-2">Karşılama Ekranı (Hero) Videosu</label>
                   <p className="text-sm text-gray-500 mb-4">Anasayfaya ilk girildiğinde arkada dönen büyük video.</p>
                   <input 
                     type="file" 
                     accept="video/*" 
                     onChange={(e) => setHeroVideoFile(e.target.files?.[0] || null)}
                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                   />
                 </div>
                 <div>
                   {heroVideoUrl && !heroVideoFile && (
                     <video src={heroVideoUrl} className="w-full h-40 object-cover rounded-lg shadow-sm" controls muted />
                   )}
                   {heroVideoFile && <p className="text-green-600 font-bold mt-4">Yeni video seçildi: {heroVideoFile.name}</p>}
                 </div>
               </div>

               {/* 2. About Video */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border">
                 <div>
                   <label className="block text-lg font-bold text-gray-800 mb-2">Hakkımızda Videosu</label>
                   <p className="text-sm text-gray-500 mb-4">Anasayfanın ortasındaki küçük boyutlu tanıtım videosu.</p>
                   <input 
                     type="file" 
                     accept="video/*" 
                     onChange={(e) => setAboutVideoFile(e.target.files?.[0] || null)}
                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                   />
                 </div>
                 <div>
                   {aboutVideoUrl && !aboutVideoFile && (
                     <video src={aboutVideoUrl} className="w-full h-40 object-cover rounded-lg shadow-sm" controls muted />
                   )}
                   {aboutVideoFile && <p className="text-green-600 font-bold mt-4">Yeni video seçildi: {aboutVideoFile.name}</p>}
                 </div>
               </div>

               <button type="submit" disabled={submitLoading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition flex justify-center items-center gap-2 disabled:opacity-70">
                 {submitLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Video className="w-6 h-6" />}
                 {submitLoading ? "Videolar Yükleniyor (Bu işlem biraz sürebilir)..." : "Videoları Güncelle"}
               </button>
             </form>
           </div>
        ) : (
          /* AKTİVİTELER VE HİZMETLER EKRANI (Aynı Kaldı) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  </label>
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center text-gray-500">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <p className="text-sm">Görselleri buraya sürükleyin</p>
                    </div>
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {previews.map((src, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 shadow-sm">
                          <img src={src} className="w-full h-20 object-cover" />
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
                    <button type="button" onClick={cancelEdit} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">İptal</button>
                  )}
                  <button type="submit" disabled={submitLoading} className={`flex-1 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 ${editingItem ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                    {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingItem ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {submitLoading ? "Kaydediliyor..." : editingItem ? "Güncelle" : "Kaydet"}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-6">Mevcut Kayıtlar</h2>
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
              ) : items.length === 0 ? (
                <p className="text-gray-500 text-center p-8 border border-dashed rounded-lg">Kayıt bulunmuyor.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition ${editingItem?._id === item._id ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"}`}>
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} className="w-full h-full object-cover rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleEdit(item)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-full transition"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
