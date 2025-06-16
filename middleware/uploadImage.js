import multer from 'multer';
import path from 'path';

// Simpan di folder uploads/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  },
});

// Filter hanya file gambar (jpg, jpeg, png, gif)
function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png, gif) yang diizinkan'), false);
  }
}

const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
});

export default uploadImage;
