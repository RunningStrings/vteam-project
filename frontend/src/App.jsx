import { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    // Fetch users from the backend API
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch bikes from the backend API
    fetch('/bikes')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching bikes:', error));
  }, []);

  return (
    <div className="App">
      <h1>Hittar vi databasen?</h1>

      <h2>Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            Name: {user.name}, Email: {user.email}
          </li>
        ))}
      </ul>

      <h2>Bikes</h2>
      <ul>
        {bikes.map((bike, index) => (
          <li key={index}>
            Model: {bike.model}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
