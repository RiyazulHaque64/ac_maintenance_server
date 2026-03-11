import multer from "multer";

const storage = multer.memoryStorage();

const multipleUploadThroughApi = multer({ storage });

const multipleUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).fields([
  {
    name: "files",
    maxCount: 10,
  },
]);

const singleUpload = multer({ storage });

export const fileUploader = {
  singleUpload,
  multipleUpload,
  multipleUploadThroughApi
};
