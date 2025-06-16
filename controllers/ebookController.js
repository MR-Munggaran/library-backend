import BookModel from '../models/ebookModel.js';
import fs from 'fs';
import path from 'path';

const bookController = {
  getAllBooks: async (req, res) => {
    try {
      const books = await BookModel.getAll();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getBookById: async (req, res) => {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createBook: async (req, res) => {
    const { title, author, publisher, year, page_count } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const coverImage = req.files?.coverFile?.[0]?.filename || null;
    const pdfFile = req.files?.pdfFile?.[0]?.filename || null;

    try {
      const insertId = await BookModel.create({
        title,
        author,
        publisher,
        year,
        page_count,
        cover_image: coverImage,
        pdf_file: pdfFile
      });

      res.status(201).json({
        id: insertId,
        message: 'Book added successfully',
        cover_image: coverImage,
        pdf_file: pdfFile
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  updateBook: async (req, res) => {
    const id = req.params.id;

    try {
      const book = await BookModel.getById(id);
      if (!book) return res.status(404).json({ message: 'Book not found' });

      // Pakai nilai lama jika tidak ada input baru
      const {
        title = book.title,
        author = book.author,
        publisher = book.publisher,
        year = book.year,
        page_count = book.page_count,
      } = req.body;

      let cover_image = book.cover_image;
      let pdf_file = book.pdf_file;

      // Update cover jika ada
      if (req.files?.coverFile?.[0]) {
        const oldImagePath = path.join('uploads', 'images', book.cover_image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        cover_image = req.files.coverFile[0].filename;
      }

      // Update pdf jika ada
      if (req.files?.pdfFile?.[0]) {
        const oldPdfPath = path.join('uploads', 'pdfs', book.pdf_file);
        if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath);
        pdf_file = req.files.pdfFile[0].filename;
      }

      const affectedRows = await BookModel.update(id, {
        title,
        author,
        publisher,
        year,
        page_count,
        cover_image,
        pdf_file,
      });

      if (affectedRows === 0) return res.status(404).json({ message: 'No changes or book not found' });

      res.json({ message: 'Book partially updated successfully (PATCH)' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteBook: async (req, res) => {
    const id = req.params.id;

    try {
      const affectedRows = await BookModel.delete(id);
      if (affectedRows === 0) return res.status(404).json({ message: 'Book not found' });

      res.json({ message: 'Book deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default bookController;
