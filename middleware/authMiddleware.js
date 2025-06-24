import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

function authenticateToken(req, res, next) {
  // 1. Ambil token dari cookie
  const token = req.cookies?.token;
  console.log('🔑 Token dari cookie:', token);
  // 2. Jika tidak ada, tolak akses
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token tidak ditemukan, silakan login.' });
  }

  try {
    // 3. Verifikasi token (synchronous)
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token valid, payload:', decoded);

    // 4. Lampirkan payload ke req.user
    req.user = decoded;
    return next();
  } catch (err) {
    // 5. Jika token tidak valid atau kadaluarsa: hapus cookie & tolak akses
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    console.log('❌ Token error:', err.message);
    return res
      .status(403)
      .json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
  }
}

export default authenticateToken;
