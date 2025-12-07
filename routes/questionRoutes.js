import express from "express";
import Question from "../models/question.js";

const router = express.Router();

// GET questions by difficulty level
router.get("/", async (req, res) => {
  try {
    const level = req.query.level; // easy / medium / hard
    const questions = await Question.find({ level });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// POST API to create a new question
router.post("/", async (req, res) => {
  try {
    const { question, options, answer, level } = req.body;

    if (!question || !options || answer === undefined || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuestion = new Question({
      question,
      options,
      answer,
      level
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully", question: newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating question" });
  }
});


export default router;
