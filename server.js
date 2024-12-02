const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/exercise-tracker", {
 
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

// POST route to create a new user
app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  await user.save();
  res.json(user);
});

// GET route to retrieve all users
app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// POST route to add an exercise to a user
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  
  const exercise = new Exercise({
    description,
    duration,
    date: date ? new Date(date) : new Date()
  });

  await exercise.save();

  const user = await User.findById(_id);
  user.exercises = user.exercises || [];
  user.exercises.push(exercise);
  await user.save();

  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  });
});

// GET route to retrieve exercise logs for a user
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = await User.findById(_id);
  const query = Exercise.find({ user: _id });

  if (from) {
    query.where("date").gte(new Date(from));
  }
  if (to) {
    query.where("date").lte(new Date(to));
  }
  if (limit) {
    query.limit(parseInt(limit));
  }

  const exercises = await query.exec();

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log: exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }))
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


