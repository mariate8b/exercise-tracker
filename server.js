const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/exercise-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, default: new Date().toISOString() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// POST route to create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  const newUser = new User({ username });

  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to add exercise to a user
app.post('/api/users/:userId/exercises', (req, res) => {
  const { userId } = req.params;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required.' });
  }

  const newExercise = new Exercise({
    description,
    duration,
    date: date || new Date().toISOString(),
    user: userId
  });

  newExercise.save()
    .then(exercise => {
      User.findById(userId)
        .then(user => {
          user.exercises.push(exercise);
          user.save()
            .then(() => res.json(exercise))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('User not found'));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to get all users
app.get('/api/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to get exercises of a user
app.get('/api/users/:userId/logs', (req, res) => {
  const { userId } = req.params;
  const { from, to, limit } = req.query;

  const query = { user: userId };

  if (from) query.date = { $gte: new Date(from) };
  if (to) query.date = { $lte: new Date(to) };

  Exercise.find(query)
    .limit(parseInt(limit) || 100)
    .then(exercises => {
      res.json({
        userId,
        log: exercises.map(ex => ({
          description: ex.description,
          duration: ex.duration,
          date: ex.date.toDateString()
        })),
        count: exercises.length
      });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

