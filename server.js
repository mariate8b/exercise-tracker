const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/exercise-tracker', {
  
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  exercises: [{
    description: String,
    duration: Number,
    date: String
  }]
});

const User = mongoose.model('User', userSchema);

// Routes

// Create a new user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  try {
    const newUser = new User({ username });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Log an exercise for a user
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const exercise = {
      description,
      duration,
      date: date || new Date().toDateString() // default to current date
    };

    user.exercises.push(exercise);
    await user.save();

    res.json({
      username: user.username,
      _id: user._id,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date
    });
  } catch (err) {
    res.status(500).send('Error logging exercise');
  }
});

// Get user's exercise log
app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    let logs = user.exercises;

    // Filter by date range
    if (from || to) {
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      logs = logs.filter(exercise => {
        const exerciseDate = new Date(exercise.date);
        return (!fromDate || exerciseDate >= fromDate) && (!toDate || exerciseDate <= toDate);
      });
    }

    // Limit the number of logs
    if (limit) {
      logs = logs.slice(0, Number(limit));
    }

    res.json({
      _id: user._id,
      username: user.username,
      count: logs.length,
      log: logs.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
      }))
    });
  } catch (err) {
    res.status(500).send('Error fetching logs');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


