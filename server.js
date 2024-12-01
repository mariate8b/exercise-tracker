const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/exerciseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// Create a new user
app.post('/api/users', (req, res) => {
  const user = new User({ username: req.body.username });

  user.save((err, data) => {
    if (err) return res.status(400).send('Error creating user');
    res.json(data);
  });
});

// Create a new exercise log
app.post('/api/exercises', (req, res) => {
  const { username, description, duration, date } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err || !user) return res.status(400).send('User not found');
    
    const exercise = new Exercise({
      username,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    });

    exercise.save((err, data) => {
      if (err) return res.status(400).send('Error saving exercise');
      res.json(data);
    });
  });
});

// Get exercise logs for a user
app.get('/api/exercises', (req, res) => {
  const { username, from, to, limit } = req.query;

  User.findOne({ username }, (err, user) => {
    if (err || !user) return res.status(400).send('User not found');

    let query = { username };

    if (from) query.date = { $gte: new Date(from) };
    if (to) query.date = { $lte: new Date(to) };

    Exercise.find(query)
      .limit(limit ? parseInt(limit) : 0)
      .exec((err, exercises) => {
        if (err) return res.status(400).send('Error fetching exercises');

        const log = exercises.map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
        }));

        res.json({
          username,
          count: exercises.length,
          _id: user._id,
          log,
        });
      });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
