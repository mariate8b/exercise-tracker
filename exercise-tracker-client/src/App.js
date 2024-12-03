import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('There was an error!', error));
  }, []);

  const handleCreateUser = () => {
    axios.post('http://localhost:3000/api/users', { username })
      .then(response => {
        setUsers([...users, response.data]);
        setUsername('');
      })
      .catch(error => console.error('Error creating user:', error));
  };

  const handleAddExercise = (userId) => {
    const exerciseData = {
      description,
      duration,
      date
    };
    axios.post(`http://localhost:3000/api/users/${userId}/exercises`, exerciseData)
      .then(response => {
        alert('Exercise added!');
        setDescription('');
        setDuration('');
        setDate('');
      })
      .catch(error => console.error('Error adding exercise:', error));
  };

  return (
    <div>
      <h1>Exercise Tracker</h1>
      <h2>Create a new user</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleCreateUser}>Create User</button>

      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => setSelectedUserId(user._id)}>Add Exercise</button>
          </li>
        ))}
      </ul>

      {selectedUserId && (
        <div>
          <h3>Add Exercise</h3>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={() => handleAddExercise(selectedUserId)}>Add Exercise</button>
        </div>
      )}
    </div>
  );
};

export default App;
