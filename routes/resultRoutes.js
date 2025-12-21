import express from "express";
import Result from "../models/Result.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save quiz result
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { score, totalQuestions, level } = req.body;

    // Validate
    if (
      score === undefined ||
      totalQuestions === undefined ||
      !level
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Cast to Number
    score = Number(score);
    totalQuestions = Number(totalQuestions);

    if (isNaN(score) || isNaN(totalQuestions)) {
      return res.status(400).json({ message: "Score and totalQuestions must be numbers" });
    }

    const result = new Result({
      userId: req.userId,
      score,
      totalQuestions,
      level
    });

    await result.save();

    res.status(201).json({ message: "Result saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving result" });
  }
});


router.get("/leaderboard", async (req, res) => {
  try {
    const { level } = req.query;

    const matchStage = level ? { level } : {};

    const leaderboard = await Result.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: {
            userId: "$userId",
            level: "$level"
          },
          maxScore: { $max: "$score" },
          totalQuestions: { $max: "$totalQuestions" }
        }
      },

      { $sort: { maxScore: -1 } },
      { $limit: 10 },

      {
        $lookup: {
          from: "users",
          localField: "_id.userId",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },

      {
        $project: {
          _id: 0,
          name: "$user.name",
          email: "$user.email",
          level: "$_id.level",
          score: "$maxScore",
          accuracy: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$maxScore", "$totalQuestions"] },
                  100
                ]
              },
              1
            ]
          }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Leaderboard error" });
  }
});



// Get logged-in user's quiz history
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const { level } = req.query; // optional filter

    const query = { userId: req.userId };

    if (level) {
      query.level = level; // easy | medium | hard
    }

    const results = await Result.find(query)
      .sort({ createdAt: -1 }) // latest first
      .select("level score totalQuestions createdAt");

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quiz history" });
  }
});


export default router;
