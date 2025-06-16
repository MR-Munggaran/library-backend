import pool from '../db.js';
import fs from 'fs';
import path from 'path';

const EbookModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM ebooks ORDER BY created_at DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM ebooks WHERE id = ?', [id]);
    return rows[0];
  },

    create: async ({ title, author, publisher, year, page_count, cover_image, pdf_file }) => {
    const [result] = await pool.query(
        'INSERT INTO ebooks (title, author, publisher, year, page_count, cover_image, pdf_file) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, author, publisher, year, page_count, cover_image, pdf_file]
    );
    return result.insertId;
    },


    update: async (id, { title, author, publisher, year, page_count, cover_image, pdf_file }) => {
    const [result] = await pool.query(
        'UPDATE ebooks SET title=?, author=?, publisher=?, year=?, page_count=?, cover_image=?, pdf_file=? WHERE id=?',
        [title, author, publisher, year, page_count, cover_image, pdf_file, id]
    );
    return result.affectedRows;
    },


    delete: async (id) => {
    const [rows] = await pool.query(`SELECT cover_image, pdf_file FROM ebooks WHERE id = ?`, [id]);
    const book = rows[0];

    if (book?.cover_image) {
        const imagePath = path.join('uploads', 'images', book.cover_image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (book?.pdf_file) {
        const pdfPath = path.join('uploads', 'pdfs', book.pdf_file);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    const [result] = await pool.query(`DELETE FROM ebooks WHERE id = ?`, [id]);
    return result.affectedRows;
    },


    getCoverImageById: async (id) => {
        const [rows] = await pool.query('SELECT cover_image FROM ebooks WHERE id = ?', [id]);
        return rows[0]?.cover_image;
    },

  getPdfFileById: async (id) => {
    const [rows] = await pool.query('SELECT pdf_file FROM ebooks WHERE id = ?', [id]);
    return rows[0]?.pdf_file;
    },

};

export default EbookModel;
