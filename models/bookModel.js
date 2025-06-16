import pool from '../db.js';
import fs from 'fs';
import path from 'path';

const BookModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  },

  create: async ({ title, author, publisher, year, page_count, cover_image }) => {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, publisher, year, page_count, cover_image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, publisher, year, page_count, cover_image]
    );
    return result.insertId;
  },

  update: async (id, { title, author, publisher, year, page_count, cover_image }) => {
    const [result] = await pool.query(
      'UPDATE books SET title=?, author=?, publisher=?, year=?, page_count=?, cover_image=? WHERE id=?',
      [title, author, publisher, year, page_count, cover_image, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    // Ambil nama file cover terlebih dahulu
    const [rows] = await pool.query(`SELECT cover_image FROM books WHERE id = ?`, [id]);
    const book = rows[0];

    // Hapus file jika ada
    if (book?.cover_image) {
      const imagePath = path.join('uploads', 'images', book.cover_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Hapus dari database
    const [result] = await pool.query(`DELETE FROM books WHERE id = ?`, [id]);
    return result.affectedRows;
  },

  getCoverImageById: async (id) => {
    const [rows] = await pool.query('SELECT cover_image FROM books WHERE id = ?', [id]);
    return rows[0]?.cover_image;
  }
};

export default BookModel;
