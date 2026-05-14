import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import Activity from "../models/Activity.js";
import Service from "../models/Service.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_kindergarten_key";

// Cloudinary Yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// api.js dosyasında bu satırı bul:
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });// GÜNCELLENDİ: Artık direkt dosya buffer'ını alıyor (çoklu yükleme için)
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "kindergarten" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// --- AUTH MİDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Yetkisiz erişim. Token bulunamadı." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};

// --- LOGIN ROTASI ---
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@mutlucocuklar.com" && password === "admin123") {
    const token = jwt.sign({ id: 1, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, user: { email, role: "admin" } });
  } else {
    res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
  }
});

// --- ACTIVITY ROTLARI ---
router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GÜNCELLENDİ: upload.array('images', 10) ve Promise.all eklendi
router.post(
  "/activities",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      let imageUrls = [];

      // Dosyalar varsa hepsini aynı anda Cloudinary'ye yükle
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          streamUpload(file.buffer),
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((result) => result.secure_url);
      }

      const newActivity = new Activity({
        title,
        description,
        images: imageUrls,
      });
      await newActivity.save();
      res.status(201).json(newActivity);
    } catch (error) {
      console.error("Aktivite ekleme hatası:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

router.delete("/activities/:id", authMiddleware, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Aktivite silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVICE ROTLARI ---
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GÜNCELLENDİ: upload.array('images', 10) ve Promise.all eklendi
router.post(
  "/services",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      let imageUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          streamUpload(file.buffer),
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((result) => result.secure_url);
      }

      const newService = new Service({ title, description, images: imageUrls });
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      console.error("Hizmet ekleme hatası:", error);
      res.status(500).json({ error: error.message });
    }
  },
);
router.put("/activities/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateData = { title, description };

    // Eğer yeni resimler seçilmişse, onları da Cloudinary'ye yükle
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      updateData.images = results.map((result) => result.secure_url);
    }

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedActivity);
  } catch (error) {
    console.error("Aktivite güncelleme hatası:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- HİZMET GÜNCELLEME ROTASI ---
router.put("/services/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateData = { title, description };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      updateData.images = results.map((result) => result.secure_url);
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedService);
  } catch (error) {
    console.error("Hizmet güncelleme hatası:", error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/services/:id", authMiddleware, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Hizmet silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
