import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();

  function handleClick() {
    navigate('/user');
  }
  


  
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

    // Fetch cities from the backend API
    fetch('/cities')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error fetching cities:', error));

    }, []);

  return (
    <div className="App" style={{ marginLeft: "200px", padding: "20px" }}>
      <h2>Användare</h2>
      <table>
        <thead>
          <tr>
            <th>Förnamn</th>
            <th>Efternamn</th>
            <th>Telefonnummer</th>
            <th>E-post</th>
            <th>Saldo</th>
            <th>Roll</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
            <tr key={index} onClick={() => {handleClick()}}>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>555-545434</td>
            <td>{user.email}</td>
            <td>{user.balance}</td>
            <td>{user.role}</td>
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