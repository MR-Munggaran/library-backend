import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import bookController from '../controllers/bookController.js';


// Pasang middleware di semua route books agar wajib login
router.use(authenticateToken);


router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;