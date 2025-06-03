import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username harus diisi'),
    body('password').notEmpty().withMessage('Password harus diisi'),
  ],
  authController.login
);

router.post('/logout', authController.logout);

export default router;
