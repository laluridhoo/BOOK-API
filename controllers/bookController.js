const Book = require("../models/bookModel");
const errorResponse = require("../utils/errorResponse");

// Create book
exports.createBook = async (req, res) => {
  try {
    const { title, author, year, pageCount, readPage, genre, description } = req.body;
    const finished = pageCount === readPage;

    const book = await Book.create({
      title,
      author,
      year,
      pageCount,
      readPage,
      finished,
      genre,
      description,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    errorResponse(res, 400, err.message, "VALIDATION_ERROR");
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

    const mappedBooks = books.map((book) => ({
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      description: book.description || "",
      userId: book.user,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,

      readPage: book.readPage ?? 0,
      pageCount: book.pageCount ?? 0,
      finished: book.finished ?? false,
    }));

    res.status(200).json({
      success: true,
      data: {
        books: mappedBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: parseInt(page) < Math.ceil(total / limit),
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};

exports.getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return errorResponse(res, 404, "Book not found", "BOOK_NOT_FOUND");
    res.json(book);
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, year, pageCount, readPage, genre, description } = req.body;
    const finished = pageCount === readPage;

    const book = await Book.findByIdAndUpdate(req.params.id, { title, author, year, pageCount, readPage, finished, genre, description }, { new: true, runValidators: true });

    if (!book) return errorResponse(res, 404, "Book not found", "BOOK_NOT_FOUND");
    res.json(book);
  } catch (err) {
    errorResponse(res, 400, err.message, "VALIDATION_ERROR");
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return errorResponse(res, 404, "Book not found", "BOOK_NOT_FOUND");
    res.json({ message: "Book deleted" });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct("genre", { genre: { $ne: "" } });
    res.status(200).json({
      success: true,
      data: {
        genres,
      },
    });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Book.distinct("author", { author: { $ne: "" } });
    res.status(200).json({
      success: true,
      data: {
        authors,
      },
    });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};
