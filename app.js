// Handle creating a user
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
  
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
  
    const data = await response.json();
    alert('User created: ' + data.username);
  });
  
  // Handle adding an exercise
  document.getElementById('addExerciseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('exerciseUsername').value;
    const description = document.getElementById('description').value;
    const duration = document.getElementById('duration').value;
    const date = document.getElementById('date').value;
  
    const response = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        description,
        duration,
        date,
      })
    });
  
    const data = await response.json();
    alert('Exercise added: ' + data.description);
  });
  
  // Handle viewing exercises
  document.getElementById('viewExercisesForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('viewUsername').value;
  
    const response = await fetch(`/api/exercises?username=${username}`);
    const data = await response.json();
  
    const exerciseLog = document.getElementById('exerciseLog');
    exerciseLog.innerHTML = '';
    data.log.forEach(exercise => {
      const li = document.createElement('li');
      li.textContent = `${exercise.date} - ${exercise.description} (${exercise.duration} minutes)`;
      exerciseLog.appendChild(li);
    });
  });
  