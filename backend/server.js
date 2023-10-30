const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Get all flashcards
app.get("/flashcards", async (req, res) => {
  const flashcards = await prisma.flashcard.findMany();
  res.json(flashcards);
});

// Add a new flashcard
app.post("/flashcards", async (req, res) => {
  const { question, answers } = req.body;
  const newFlashcard = await prisma.flashcard.create({
    data: {
      question,
      answers,
    },
  });
  res.json(newFlashcard);
});

// Update a flashcard
app.put("/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  const { question, answers } = req.body;
  const updatedFlashcard = await prisma.flashcard.update({
    where: { id: parseInt(id) },
    data: {
      question,
      answers,
    },
  });
  res.json(updatedFlashcard);
});

// Delete a flashcard
app.delete("/flashcards/:id", async (req, res) => {
  console.log("delete: ", req.params);
  const { id } = req.params;
  await prisma.flashcard.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Flashcard deleted" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
