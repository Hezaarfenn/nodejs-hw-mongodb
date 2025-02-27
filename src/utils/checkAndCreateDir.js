import fs from "fs/promises";
import { TEMP_UPLOAD_DIR } from "../constants/indexConstants.js";

// TEMP_UPLOAD_DIR klasörünün var olup olmadığını kontrol et ve yoksa oluştur
export async function checkAndCreateDir() {
  let errorMsg; // Hata mesajını tutmak için bir değişken

  try {
    await fs.access(TEMP_UPLOAD_DIR); // Klasörün varlığını kontrol et
  } catch (error) {
    errorMsg = error; // Hata mesajını değişkene ata
    await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true }); // Klasör yoksa, oluştur
  }
  return errorMsg; // Hata mesajını döndür
}

export async function initializeStorage() {
  const errorMsg = await checkAndCreateDir();
  if (errorMsg) {
    throw new Error(errorMsg); // Hata varsa hata fırlat
  }
}

await initializeStorage(); // Klasörü kontrol et ve oluştur
