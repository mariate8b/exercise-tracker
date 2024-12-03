import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({
    description: '',
    duration: '',
    date: '',
  });

  const apiUrl = 'http://localhost:5001'; // Update API base URL to 5001

  // Fetch all users
  useEffect(() => {
    axios.get(`${apiUrl}/api/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Handle user creation
  const createUser = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/users`, { username: newUser });
      setUsers([...users, response.data]);
      setNewUser('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Fetch exercises for a user
  const getUserExercises = async (userId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/users/${userId}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Handle exercise creation
  const createExercise = async (userId) => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/${userId}/exercises`, exerciseDetails);
      setExercises([...exercises, response.data]);
      setExerciseDetails({ description: '', duration: '', date: '' });
    } catch (error) {
      console.error('Error creating exercise:', error);
    }
  };

  return (
    <div>
      <h1>Exercise Tracker</h1>

      <div>
        <h2>Create New User</h2>
        <input
          type="text"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button onClick={createUser}>Create User</button>
      </div>

      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.username}
              <button onClick={() => getUserExercises(user._id)}>View Exercises</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Exercises</h2>
        <input
          type="text"
          placeholder="Description"
          value={exerciseDetails.description}
          onChange={(e) => setExerciseDetails({ ...exerciseDetails, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (in minutes)"
          value={exerciseDetails.duration}
          onChange={(e) => setExerciseDetails({ ...exerciseDetails, duration: e.target.value })}
        />
        <input
          type="date"
          value={exerciseDetails.date}
          onChange={(e) => setExerciseDetails({ ...exerciseDetails, date: e.target.value })}
        />
        <button onClick={() => createExercise(users[0]._id)}>Add Exercise</button>

        <ul>
          {exercises.map(exercise => (
            <li key={exercise._id}>{exercise.description} - {exercise.duration} min</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

