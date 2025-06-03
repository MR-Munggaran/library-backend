import BookModel from '../models/bookModel.js';

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

    try {
      const insertId = await BookModel.create({ title, author, publisher, year, page_count });
      res.status(201).json({ id: insertId, message: 'Book added successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateBook: async (req, res) => {
    const id = req.params.id;
    const { title, author, publisher, year, page_count } = req.body;

    try {
      const affectedRows = await BookModel.update(id, { title, author, publisher, year, page_count });
      if (affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
      res.json({ message: 'Book updated successfully' });
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
