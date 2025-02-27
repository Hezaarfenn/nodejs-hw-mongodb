import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constants/indexConstants.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Dosya yükleniyor, kaydedilecek klasör:", TEMP_UPLOAD_DIR);
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    console.log(
      "Yüklenen dosyanın adı:",
      `${uniqueSuffix}_${file.originalname}`,
    );
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const uploadMulter = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default uploadMulter;
