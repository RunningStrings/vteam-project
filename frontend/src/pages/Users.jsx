import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [users, setUsers] = useState([]);
  //const [bikes, setBikes] = useState([]);
  //const [cities, setCities] = useState([]);

  const navigate = useNavigate();

  function handleClick(email) {
    sessionStorage.setItem("email",email)
    navigate('/user');
  }
  


  
  useEffect(() => {
    // Fetch users from the backend API
    fetch('/users')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      setUsers(responseData.data); // Ensure this is the correct data structure
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
   



    }, []);

  return (
    <div className="App" style={{ marginLeft: "200px", padding: "20px" }}>
      <h2>Användare</h2>
      <table>
        <thead>
          <tr>
          <th>E-post</th>
            <th>Förnamn</th>
            <th>Efternamn</th>
            <th>Saldo</th>
            <th>Roll</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
            <tr key={index}>
            <td onClick={() => {handleClick(user.email)}} style={{ cursor: "pointer", color: "blue" }}>{user.email}</td>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
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