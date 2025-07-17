const Book = require("../models/bookModel");

// Create book
exports.createBook = async (req, res) => {
  try {
    const { title, author, year, pageCount, readPage } = req.body;
    const finished = pageCount === readPage;

    const book = await Book.create({
      title,
      author,
      year,
      pageCount,
      readPage,
      finished,
      user: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all books with optional search + pagination + sorting
exports.getBooks = async (req, res) => {
  try {
    const { title, author, page = 1, limit = 10, sortBy = "createdAt", order = "desc", finished } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    if (finished === "true") {
      query.finished = true;
    } else if (finished === "false") {
      query.finished = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Book.countDocuments(query);

    // Tentukan arah pengurutan: asc = 1, desc = -1
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = {};
    sortField[sortBy] = sortOrder;

    const books = await Book.find({ user: req.user._id, ...query })
      .sort(sortField)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalData: total,
      totalPages: Math.ceil(total / limit),
      sortBy,
      order,
      filter: { finished },
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
