import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const navigate = useNavigate();
  //const [isLoading, setIsLoading] = useState(true);

  function handleClick(bike_id,bike_coords) {
    sessionStorage.setItem("bike",bike_id)
    sessionStorage.setItem("bike_coords",bike_coords)
    navigate('/bike');
  }



  useEffect(() => {

fetch('/bikes')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((responseData) => {
    setBikes(responseData.data); // Ensure this is the correct data structure
  })
  .catch((error) => {
    console.error('Error fetching bikes:', error);
  });
});   
    /*  if (isLoading) {
        return <p>Loading...</p>;
      }*/




    // Fetch bikes from the backend API
/*    fetch('/bikes')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching bikes:', error));
  }, []);*/

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Elsparkcyklar</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Stad</th>
            <th>Position</th>
            <th>Batteri</th>
            <th>Status</th>
            <th>Fart</th>
          </tr>
        </thead>
        <tbody>
        {bikes.map((bike, index) => (
            <tr key={index}>
            <td onClick={() => {handleClick(bike.id,bike.location.coordinates)}} style={{ cursor: "pointer", color: "blue" }}>{bike.id}</td>
            <td>{bike.city_name}</td>
            <td>{bike.location.coordinates}</td>
            <td>{bike.battery}</td>
            <td>{bike.status}</td>
            <td>{bike.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}













/*const Bikes = () => {
    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Cykelsida</h1>
        <p>Welcome to the home page.</p>
      </div>
    );
  };*/
  
  export default Bikes;