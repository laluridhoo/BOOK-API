const express = require("express");
const router = express.Router();
const { createBook, getBooks, getMyBooks, getBookById, updateBook, deleteBook, getGenres, getAuthors } = require("../controllers/bookController");
const protect = require("../middleware/authMiddleware");

router.use(protect); // Semua route berikut wajib login

router.post("/", createBook);
router.get("/", getBooks);
router.get("/my-books", getMyBooks);
router.get("/genres", getGenres);
router.get("/authors", getAuthors);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
