import { v2 as cloudinary } from 'cloudinary'

const deleteFromCloudinary = async (publicId, resource_type = "auto") => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type
        })
    } catch (error) {
        console.error(`Error deleting ${publicId}:`, error.message);
    }
}

export default deleteFromCloudinary