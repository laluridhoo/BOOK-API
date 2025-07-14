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

// Get all books
exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
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
