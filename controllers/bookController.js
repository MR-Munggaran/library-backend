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
        // Ambil filename cover dari uploadImage middleware
    const coverImage = req.file ? req.file.filename : null;

    try {
      const insertId = await BookModel.create({ title, author, publisher, year, page_count, cover_image: coverImage });
      res.status(201).json({ id: insertId, message: 'Book added successfully', cover_image: coverImage });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateBook: async (req, res) => {
    const id = req.params.id;

    try {
      const book = await BookModel.getById(id);
      if (!book) return res.status(404).json({ message: 'Book not found' });

      // Ambil data dari body, kalau tidak ada tetap pakai data lama
      const {
        title = book.title,
        author = book.author,
        publisher = book.publisher,
        year = book.year,
        page_count = book.page_count,
      } = req.body;

      let cover_image = book.cover_image;

      // Kalau ada file cover baru, hapus yang lama
      if (req.file) {
        const oldImagePath = path.join('uploads', 'images', book.cover_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        cover_image = req.file.filename;
      }

      const affectedRows = await BookModel.update(id, {
        title,
        author,
        publisher,
        year,
        page_count,
        cover_image,
      });

      if (affectedRows === 0) return res.status(404).json({ message: 'Book not found or no change' });

      res.json({ message: 'Book partially updated (PATCH) successfully' });
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
