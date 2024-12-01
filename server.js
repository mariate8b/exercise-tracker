const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/exerciseTracker", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Define Exercise and User models
const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: String,
  exercises: [exerciseSchema],
});

const User = mongoose.model("User", userSchema);

// Create a new user
app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const newUser = new User({ username });

  newUser.save()
    .then(user => res.json({ _id: user._id, username: user.username }))
    .catch(err => res.status(400).json({ error: "Error creating user" }));
});

// Add exercise to a user
app.post("/api/users/:userId/exercises", (req, res) => {
  const userId = req.params.userId;
  const { description, duration, date } = req.body;
  const newExercise = { description, duration, date: date ? new Date(date) : new Date() };

  User.findById(userId)
    .then(user => {
      user.exercises.push(newExercise);
      user.save()
        .then(() => res.json({
          _id: user._id,
          username: user.username,
          description,
          duration,
          date: newExercise.date.toDateString(),
        }))
        .catch(err => res.status(400).json({ error: "Error adding exercise" }));
    })
    .catch(err => res.status(400).json({ error: "User not found" }));
});

// Get exercise log
app.get("/api/users/:userId/logs", (req, res) => {
  const userId = req.params.userId;
  const { from, to, limit } = req.query;

  let filter = {};
  if (from) filter.date = { $gte: new Date(from) };
  if (to) filter.date = { $lte: new Date(to) };

  User.findById(userId)
    .then(user => {
      const exercises = user.exercises.filter(exercise => {
        if (from && new Date(exercise.date) < new Date(from)) return false;
        if (to && new Date(exercise.date) > new Date(to)) return false;
        return true;
      });

      const result = exercises.slice(0, limit);
      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: result,
      });
    })
    .catch(err => res.status(400).json({ error: "User not found" }));
});

// Get all users
app.get("/api/users", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json({ error: "Error fetching users" }));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
