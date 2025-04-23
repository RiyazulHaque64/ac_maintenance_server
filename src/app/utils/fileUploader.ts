import multer from "multer";

const storage = multer.memoryStorage();

const multipleUploadThroughApi = multer({ storage });

const multipleUpload = multer({ storage }).fields([
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
