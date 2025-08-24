import { v2 as cloudinary } from "cloudinary"

const uploadToCloudinary = async (filePath, folder, publicId, resource_type = "auto") => {
    try {
        if (!filePath) return null;
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            public_id: publicId,
            resource_type,
        });

        return result
    } catch (error) {
        console.log("Cloudinary Upload Error:", error.message);
        return null;
    }
};

export default uploadToCloudinary;
