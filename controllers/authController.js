import 'dotenv/config';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userId = await UserModel.createUser({ username, passwordHash });
      res.status(201).json({ message: 'User berhasil didaftarkan', userId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      const user = await UserModel.findByUsername(username);
      if (!user) return res.status(400).json({ message: 'Username atau password salah' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Username atau password salah' });

      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.cookie('token', token, {
        httpOnly: true,         // tidak bisa diakses JS client
        secure: false, // hanya HTTPS di prod
        sameSite: "lax", // CSRF attacks cross-site request forgery attacks
        maxAge: 1000 * 60 * 60, // 1 jam, sama dengan expiresIn
      });

      res.json({ message: 'Login berhasil', user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    res.json({ message: 'Logout berhasil, cookie token dihapus' });
  },

  me: (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // bisa ambil data user dari database jika perlu, misalnya:
    res.json({ user: req.user });
  }
};

export default authController;
