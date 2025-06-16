import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import bookController from '../controllers/bookController.js';
import uploadImage from '../middleware/uploadImage.js';


// Pasang middleware di semua route books agar wajib login
router.use(authenticateToken);

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', uploadImage.single('coverFile'),bookController.createBook);
router.patch('/:id', uploadImage.single('coverFile'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;