import express from "express";
import Result from "../models/Result.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save quiz result
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { score, totalQuestions, level } = req.body;

    const result = new Result({
      userId: req.userId,
      score,
      totalQuestions,
      level
    });

    await result.save();

    res.status(201).json({ message: "Result saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving result" });
  }
});

router.get("/leaderboard", async (req, res) => {
  const leaderboard = await Result.aggregate([
    {
      $group: {
        _id: "$userId",
        maxScore: { $max: "$score" }
      }
    },
    { $sort: { maxScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        score: "$maxScore"
      }
    }
  ]);

  res.json(leaderboard);
});


export default router;
