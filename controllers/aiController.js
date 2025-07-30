const { GoogleGenerativeAI } = require("@google/generative-ai");
const Book = require("../models/bookModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAI = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user?._id;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // --- LANGKAH DEBUGGING ---
    console.log("Mencari buku untuk User ID:", userId);

    const books = await Book.find({ createdBy: userId });

    // --- LANGKAH DEBUGGING ---
    console.log("Buku yang ditemukan di database:", books);

    let bookList;

    // --- LOGIKA PENTING ---
    // Cek apakah ada buku yang ditemukan atau tidak
    if (books.length > 0) {
      bookList = books.map((book) => `- ${book.title} oleh ${book.author} (genre: ${book.genre})`).join("\n");
    } else {
      // Jika tidak ada buku, berikan pesan ini ke AI
      bookList = "User ini belum memiliki buku di dalam koleksinya.";
    }

    const fullPrompt = `Kamu adalah asisten buku yang cerdas. Jawab pertanyaan user berdasarkan koleksi buku yang mereka miliki.
Koleksi buku user:
${bookList}

---
Pertanyaan User: "${prompt}"

Jawabanmu:`;

    // --- LANGKAH DEBUGGING ---
    console.log("===================================");
    console.log("Prompt yang dikirim ke AI:", fullPrompt);
    console.log("===================================");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ error: "AI Assistant failed to respond." });
  }
};

module.exports = { askAI };
