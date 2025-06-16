import multer from 'multer';
import path from 'path';

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverFile') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'pdfFile') {
      cb(null, 'uploads/pdfs');
    } else {
      cb(new Error('Field tidak dikenali'), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// Filter file
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverFile') {
    const allowed = /jpeg|jpg|png|gif/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya gambar (jpg, jpeg, png, gif) yang diizinkan'), false);
    }
  } else if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file PDF yang diizinkan'), false);
    }
  } else {
    cb(new Error('Field file tidak dikenali'), false);
  }
};

const uploadBoth = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}).fields([
  { name: 'coverFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 },
]);

export default uploadBoth;
