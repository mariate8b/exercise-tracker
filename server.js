const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/exercise-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
}));

// Exercise Model
const Exercise = mongoose.model('Exercise', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
}));

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user');
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving users');
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving user');
  }
});

// Create a new exercise for a user
app.post('/api/users/:userId/exercises', async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const userId = req.params.userId;

    // Create a new exercise record
    const newExercise = new Exercise({
      userId,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    });

    // Save the exercise
    const savedExercise = await newExercise.save();
    res.json(savedExercise);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving exercise');
  }
});

// Get all exercises for a specific user
app.get('/api/users/:userId/exercises', async (req, res) => {
  try {
    const userId = req.params.userId;
    const exercises = await Exercise.find({ userId });

    if (!exercises) {
      return res.status(404).send('No exercises found for this user');
    }

    res.json(exercises);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving exercises');
  }
});

// Listen on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
