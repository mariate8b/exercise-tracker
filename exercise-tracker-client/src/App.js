import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm';
import ExerciseForm from './components/ExerciseForm';
import UserList from './components/UserList';

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Exercise Tracker</h1>
      <UserForm setUsers={setUsers} />
      <ExerciseForm />
      <UserList users={users} />
    </div>
  );
};

export default App;
