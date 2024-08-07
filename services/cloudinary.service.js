const cloudinary = require("cloudinary");
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
module.exports = cloudinaryConfig;
cloudinary.config(cloudinaryConfig);
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
        });
        return data;
    } catch (error) {
        return error;
    }
};
const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
    } catch (error) {
        return error;
    }
};
const cloudinaryRemoveManyImage = async (publicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        return error;
    }
};

module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveManyImage,
};
