import { useState, useEffect } from 'react';

function Users() {
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
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Användare</h2>
      <table>
        <thead>
          <tr>
            <th>Kundnummer</th>
            <th>Namn</th>
            <th>Telefonnummer</th>
            <th>E-post</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
            <tr key={index}>
            <td>xxxx</td>
            <td>{user.name}</td>
            <td>555-545434</td>
            <td>{user.email}</td>
            <td>542 kr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*const Users = () => {
    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Användare</h1>
        <p>Welcome to the home page.</p>
      </div>
    );
  };*/
  
  export default Users;