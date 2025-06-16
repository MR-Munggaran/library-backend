import multer from 'multer';
import path from 'path';

// Simpan di folder uploads/pdfs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/pdfs'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  },
});

// Filter hanya file PDF
function fileFilter(req, file, cb) {
  const isPdf = path.extname(file.originalname).toLowerCase() === '.pdf' && file.mimetype === 'application/pdf';
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan'), false);
  }
}

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

export default uploadPdf;
