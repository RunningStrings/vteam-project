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
      <pre>{JSON.stringify(users, null, 2)}</pre>

      <h2>Bikes</h2>
      <pre>{JSON.stringify(bikes, null, 2)}</pre>
    </div>
  );
}

export default App
