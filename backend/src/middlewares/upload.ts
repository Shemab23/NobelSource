import multer from "multer";

const storage = multer.memoryStorage();

const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (allowed.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
