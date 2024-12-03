const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exercises: [{
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now },
  }],
});

const User = mongoose.model('User', userSchema);

// POST /api/users - Create a new user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send('Username is required');

  const newUser = new User({ username });
  await newUser.save();
  res.json({
    username: newUser.username,
    _id: newUser._id,
  });
});

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST /api/users/:_id/exercises - Add an exercise for a user
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).send('User not found');

  const exercise = {
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  };

  user.exercises.push(exercise);
  await user.save();

  // Respond with the updated user object
  res.json(user);
});

// GET /api/users/:_id/logs - Get a user's exercise logs
app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const userId = req.params._id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).send('User not found');

  let logs = user.exercises;
  if (from) logs = logs.filter(exercise => new Date(exercise.date) >= new Date(from));
  if (to) logs = logs.filter(exercise => new Date(exercise.date) <= new Date(to));
  if (limit) logs = logs.slice(0, parseInt(limit));

  res.json({
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    })),
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
