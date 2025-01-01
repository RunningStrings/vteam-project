import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [stations, setStations] = useState([]);

  const navigate = useNavigate();

 
  
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

    // Fetch stations from the backend API
      fetch('/charging_stations')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setStations(responseData.data); // Ensure this is the correct data structure
      })
      .catch((error) => {
        console.error('Error fetching stations:', error);
      });




  }, []);

  return (
    <div className="App" style={{ marginLeft: "120px", padding: "20px" }}>
      <h2>Laddningsstationer</h2>
      <table>
      
        <thead>
          <tr>
            <th>Id</th>
            <th>Namn</th>
            <th>Stad</th>
            <th>Position</th>
            <th>Antal cyklar nu</th>
            <th>Kapacitet</th>
          </tr>
        </thead>
        <tbody>
        {stations.map((station, index) => (
            <tr>
            <td>{index}</td>
            <td>{station.name}</td>
            <td>{station.city_name}</td>
            <td>{station.location.coordinates[0].toFixed(4)} {station.location.coordinates[1].toFixed(4)}</td>
            <td>{station.bikes.length}</td>
            <td>{station.capacity}</td>
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