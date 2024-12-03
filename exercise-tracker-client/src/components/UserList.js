import React from 'react';

const UserList = ({ users }) => (
  <div>
    <h2>Users</h2>
    <ul>
      {users.map(user => (
        <li key={user._id}>{user.username} - {user._id}</li>
      ))}
    </ul>
  </div>
);

export default UserList;
