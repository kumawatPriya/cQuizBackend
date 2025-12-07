import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import questionRoutes from "./routes/questionRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
  res.send("Quiz Backend Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
