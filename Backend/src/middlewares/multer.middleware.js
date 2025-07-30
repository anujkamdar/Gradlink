import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.parse(file.originalname).name;
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

export const upload = multer({ storage });
