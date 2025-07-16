const Book = require("../models/bookModel");

// Create book
exports.createBook = async (req, res) => {
  try {
    const { title, author, year, pageCount, readPage } = req.body;
    const finished = pageCount === readPage;

    const book = await Book.create({ title, author, year, pageCount, readPage, finished });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all books with optional search + pagination
exports.getBooks = async (req, res) => {
  try {
    const { title, author, page = 1, limit = 10 } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Book.countDocuments(query);

    const books = await Book.find(query).skip(skip).limit(parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / limit),
      data: books,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, year, pageCount, readPage } = req.body;
    const finished = pageCount === readPage;

    const book = await Book.findByIdAndUpdate(req.params.id, { title, author, year, pageCount, readPage, finished }, { new: true, runValidators: true });

    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
