import cloudinary from "cloudinary";
import { env } from "./env.js";
import { CLOUDINARY } from "../constants/indexConstants.js";
import fs from "fs/promises";

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.CLOUD_API_KEY),
  api_secret: env(CLOUDINARY.CLOUD_API_SECRET),
});

export const uploadToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return result.secure_url;
};
