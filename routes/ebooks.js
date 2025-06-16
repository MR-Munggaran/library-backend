import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import bookController from '../controllers/ebookController.js';
import uploadBoth from '../middleware/uploadBoth.js'; // ganti ini

router.use(authenticateToken);

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', uploadBoth, bookController.createBook);   // cukup 1 middleware
router.patch('/:id', uploadBoth, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
