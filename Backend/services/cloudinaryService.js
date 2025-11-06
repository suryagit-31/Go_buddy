import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
  secure: true,
});

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const BASE_FOLDER = "GO_buddy";

export const uploadToCloudinary = async (
  fileBuffer,
  fileName,
  mimeType,
  folder = "uploads"
) => {
  try {
    const fullFolderPath = `${BASE_FOLDER}/${folder}`;
    const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(`Upload timeout after 90 seconds for file: ${fileName}`)
        );
      }, 90000);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: fullFolderPath,
          resource_type: "auto",
          public_id: fileName.replace(/\.[^/.]+$/, ""),
          overwrite: false,
          unique_filename: true,
          timeout: 60000,
        },
        (error, result) => {
          clearTimeout(timeout);

          if (error) {
            console.error("Cloudinary upload error:", error);
            console.error(`Failed file: ${fileName}, Size: ${fileSizeMB} MB`);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            });
          }
        }
      );

      uploadStream.on("error", (error) => {
        clearTimeout(timeout);
        console.error("Upload stream error:", error);
        reject(error);
      });

      bufferToStream(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Upload image with automatic thumbnail generation
 * @param {Buffer} fileBuffer - Image buffer
 * @param {String} fileName - Original file name
 * @param {String} mimeType - MIME type
 * @param {String} folder - Folder path in Cloudinary
 * @returns {Promise<Object>} Upload result with URL and thumbnail URL
 */
export const uploadImageToCloudinary = async (
  fileBuffer,
  fileName,
  mimeType,
  folder = "messages"
) => {
  try {
    // Upload original image
    const originalUpload = await uploadToCloudinary(
      fileBuffer,
      fileName,
      mimeType,
      folder
    );

    // Generate thumbnail URL using Cloudinary transformations
    // This creates a URL that generates a thumbnail on-the-fly
    // public_id already includes the folder path, so we don't need to specify it again
    const thumbnailUrl = cloudinary.url(originalUpload.public_id, {
      width: 300,
      height: 300,
      crop: "limit",
      quality: "auto",
      format: "auto",
    });

    return {
      url: originalUpload.url,
      thumbnail: thumbnailUrl,
      public_id: originalUpload.public_id,
      format: originalUpload.format,
      width: originalUpload.width,
      height: originalUpload.height,
      bytes: originalUpload.bytes,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

/**
 * Upload profile picture with optimized transformations
 * @param {Buffer} fileBuffer - Image buffer
 * @param {String} fileName - Original file name
 * @param {String} mimeType - MIME type
 * @returns {Promise<Object>} Upload result with optimized profile picture URL
 */
export const uploadProfilePicture = async (fileBuffer, fileName, mimeType) => {
  try {
    // Upload with automatic optimization and format conversion
    const fullFolderPath = `${BASE_FOLDER}/profiles`;

    // Log file size for debugging
    const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(`Uploading profile picture: ${fileName} (${fileSizeMB} MB)`);

    return new Promise((resolve, reject) => {
      // Set a timeout for the upload (90 seconds)
      const timeout = setTimeout(() => {
        reject(
          new Error(
            `Profile picture upload timeout after 90 seconds for file: ${fileName}`
          )
        );
      }, 90000);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: fullFolderPath,
          resource_type: "image",
          public_id: fileName.replace(/\.[^/.]+$/, ""),
          overwrite: false,
          unique_filename: true,
          timeout: 60000, // 60 seconds timeout per request
          transformation: [
            {
              width: 400,
              height: 400,
              crop: "fill",
              gravity: "face", // Auto-detect face for better cropping
              quality: "auto",
              format: "auto",
            },
          ],
        },
        (error, result) => {
          clearTimeout(timeout);

          if (error) {
            console.error("Cloudinary profile upload error:", error);
            console.error(
              `Failed profile picture: ${fileName}, Size: ${fileSizeMB} MB`
            );
            reject(error);
          } else {
            console.log(`Successfully uploaded profile picture: ${fileName}`);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            });
          }
        }
      );

      // Handle stream errors
      uploadStream.on("error", (error) => {
        clearTimeout(timeout);
        console.error("Profile upload stream error:", error);
        reject(error);
      });

      bufferToStream(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error uploading profile picture to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public_id
 * @param {String} resourceType - Resource type ('image', 'video', 'raw', 'auto')
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    if (!publicId) {
      console.warn("No public_id provided for deletion");
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      console.log(`File deleted from Cloudinary: ${publicId}`);
    } else {
      console.warn(`File deletion result: ${result.result} for ${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    // Don't throw - deletion failures shouldn't break the app
  }
};

/**
 * Generate unique filename
 * @param {String} originalName - Original file name
 * @param {String} prefix - Optional prefix
 * @returns {String} Unique filename
 */
export const generateFileName = (originalName, prefix = "") => {
  const ext = originalName.split(".").pop();
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  return `${prefix}${uniqueSuffix}.${ext}`;
};
