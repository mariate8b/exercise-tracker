import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ setUsers }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/users', { username })
      .then(response => {
        setUsers(prevUsers => [...prevUsers, response.data]);
        setUsername('');
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Enter username" 
        required 
      />
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
