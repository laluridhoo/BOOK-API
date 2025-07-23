const openai = require("../utils/openai");
const Book = require("../models/bookModel");

const askAI = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user?._id; // jika autentikasi dipakai

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Ambil buku-buku milik user (atau semua jika publik)
    const books = await Book.find({ createdBy: userId });

    const bookList = books.map((book) => `- ${book.title} oleh ${book.author} (genre: ${book.genre})`).join("\n");

    const fullPrompt = `
Kamu adalah asisten buku. Berikut adalah koleksi buku dari user:

${bookList}

Pertanyaan user: ${prompt}
Berikan jawaban yang relevan berdasarkan daftar buku di atas.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Kamu adalah asisten cerdas untuk aplikasi Book API." },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ error: "AI Assistant failed to respond." });
  }
};

module.exports = { askAI };
