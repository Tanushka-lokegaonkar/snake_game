const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Define Score Schema
const scoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  score: { type: Number, required: true },
  gameName: { type: String, default: "snakegame" },
  date: { type: Date, default: Date.now },
});

// Create Score Model
const Score = mongoose.model("Score", scoreSchema);

// API endpoint to save score
app.post('/api/save_score', async (req, res) => {
  try {
    const { userId, password, score, gameName } = req.body;

    // Validate data
    if (!userId || !password || typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Save to database
    const newScore = new Score({ userId, password, score, gameName });
    await newScore.save();

    res.status(201).json({ message: "Score saved successfully!" });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
