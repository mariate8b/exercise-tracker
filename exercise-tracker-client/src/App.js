import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [limit, setLimit] = useState('');
  const [log, setLog] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/users', { username });
      setUserId(response.data._id);
      getUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const addExercise = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/users/${userId}/exercises`,
        { description, duration, date }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLog = async () => {
    try {
      const params = { from: fromDate, to: toDate, limit: limit };
      const response = await axios.get(
        `http://localhost:5001/api/users/${userId}/logs`,
        { params }
      );
      setLog(response.data.log);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Exercise Tracker</h1>

      <h2>Create User</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={createUser}>Create User</button>

      <h2>Add Exercise</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={addExercise}>Add Exercise</button>

      <h2>Log Exercises</h2>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Limit"
      />
      <button onClick={getLog}>Get Log</button>

      <h2>Users</h2>
      {users.map((user) => (
        <div key={user._id}>
          <h3>{user.username}</h3>
          <button onClick={() => setUserId(user._id)}>Select User</button>
        </div>
      ))}

      <h2>Exercise Log</h2>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>
            {entry.description} - {entry.duration} minutes on {entry.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


