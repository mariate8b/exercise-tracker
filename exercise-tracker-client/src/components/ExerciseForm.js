import React, { useState } from 'react';
import axios from 'axios';

const ExerciseForm = () => {
  const [userId, setUserId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3000/api/users/${userId}/exercises`, { description, duration, date })
      .then(response => alert('Exercise logged!'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
        placeholder="User ID" 
        required 
      />
      <input 
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Exercise Description" 
        required 
      />
      <input 
        type="number" 
        value={duration} 
        onChange={(e) => setDuration(e.target.value)} 
        placeholder="Duration (minutes)" 
        required 
      />
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
      />
      <button type="submit">Log Exercise</button>
    </form>
  );
};

export default ExerciseForm;
