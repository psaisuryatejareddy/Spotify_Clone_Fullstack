import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColor } = req.body;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const albumData = {
            name,
            desc,
            bgColor, // Ensure this matches the frontend
            image: imageUpload.secure_url
        };

        const album = new albumModel(albumData);
        await album.save();

        res.json({ success: true, message: "Album added" });

    } catch (error) {
        console.error("Error adding album:", error);
        res.json({ success: false, message: "Error adding album", error: error.message });
    }
}

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({});
        res.json({ success: true, albums: allAlbums });
    } catch (error) {
        console.error("Error listing albums:", error);
        res.json({ success: false, message: "Error listing albums", error: error.message });
    }
}

const removeAlbum = async (req, res) => {
    try {
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album removed" });
    } catch (error) {
        console.error("Error removing album:", error);
        res.json({ success: false, message: "Error removing album", error: error.message });
    }
}

export { addAlbum, listAlbum, removeAlbum };
