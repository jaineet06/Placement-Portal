import { v2 as cloudinary } from 'cloudinary'

const deleteFromCloudinary = async (publicId, resource_type = "auto") => {
    await cloudinary.uploader.destroy(publicId, {
        resource_type
    })
}

export default deleteFromCloudinary