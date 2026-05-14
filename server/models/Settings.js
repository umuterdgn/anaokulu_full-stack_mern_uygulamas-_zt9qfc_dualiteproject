import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  heroVideo: { type: String, default: "https://www.pexels.com/tr-tr/download/video/6299087/" },
  aboutVideo: { type: String, default: "https://www.pexels.com/tr-tr/download/video/5273820/" }
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);
