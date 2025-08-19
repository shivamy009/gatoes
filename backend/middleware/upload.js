import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storageDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
