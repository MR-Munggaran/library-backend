import pool from '../db.js';

const BookModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  },

  create: async ({ title, author, publisher, year, page_count }) => {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, publisher, year, page_count) VALUES (?, ?, ?, ?, ?)',
      [title, author, publisher, year, page_count]
    );
    return result.insertId;
  },

  update: async (id, { title, author, publisher, year, page_count }) => {
    const [result] = await pool.query(
      'UPDATE books SET title=?, author=?, publisher=?, year=?, page_count=? WHERE id=?',
      [title, author, publisher, year, page_count, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

export default BookModel;
