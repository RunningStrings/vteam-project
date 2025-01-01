import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [parkings, setParkings] = useState([]);

  const navigate = useNavigate();

 
  
  useEffect(() => {

    // Fetch parkings from the backend API
    fetch('/parking_zones')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      setParkings(responseData.data); // Ensure this is the correct data structure
    })
    .catch((error) => {
      console.error('Error fetching parkerings:', error);
    });


  }, []);

  return (
    <div className="App" style={{ marginLeft: "120px", padding: "20px" }}>
      <h2>Parkeringar</h2>
      <table>
      
        <thead>
          <tr>
            <th>Id</th>
            <th>Stad</th>
            <th>Position</th>
            <th>Antal cyklar nu</th>
          </tr>
        </thead>
        <tbody>
        {parkings.map((parking, index) => (
            <tr>
            <td>{index}</td>
            <td>{parking.city_name}</td>
            <td>{parking.location.coordinate}</td> 
            <td>0</td>
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