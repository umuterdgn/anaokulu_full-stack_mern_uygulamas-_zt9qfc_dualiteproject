import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import Activity from "../models/Activity.js";
import Service from "../models/Service.js";
import Settings from "../models/Settings.js"; // Settings modelimiz
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_kindergarten_key";

// --- CLOUDINARY VE MULTER AYARLARI ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Resim Yükleme Fonksiyonu
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "kindergarten" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Video Yükleme Fonksiyonu (resource_type: "video" eklendi)
const streamVideoUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "kindergarten", resource_type: "video" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// --- AUTH MİDDLEWARE (Güvenlik duvarı mutlaka rotalardan ÖNCE gelmeli) ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Yetkisiz erişim." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token." });
  }
};

// --- LOGIN ROTASI ---
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@mutlucocuklar.com" && password === "admin123") {
    const token = jwt.sign({ id: 1, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { email, role: "admin" } });
  } else {
    res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
  }
});

// --- SETTINGS (VİDEO) ROTALARI ---
router.get("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/settings",
  authMiddleware,
  upload.fields([{ name: "heroVideo", maxCount: 1 }, { name: "aboutVideo", maxCount: 1 }]),
  async (req, res) => {
    try {
      let settings = await Settings.findOne();
      if (!settings) settings = new Settings({});

      if (req.files && req.files["heroVideo"]) {
        const result = await streamVideoUpload(req.files["heroVideo"][0].buffer);
        settings.heroVideo = result.secure_url;
      }

      if (req.files && req.files["aboutVideo"]) {
        const result = await streamVideoUpload(req.files["aboutVideo"][0].buffer);
        settings.aboutVideo = result.secure_url;
      }

      await settings.save();
      res.json(settings);
    } catch (error) {
      console.error("Video güncelleme hatası:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// --- ACTIVITY ROTALARI ---
router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/activities", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    const newActivity = new Activity({ title, description, images: imageUrls });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/activities/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateData = { title, description };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      updateData.images = results.map((result) => result.secure_url);
    }

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/activities/:id", authMiddleware, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Aktivite silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVICE ROTALARI ---
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/services", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    const newService = new Service({ title, description, images: imageUrls });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
