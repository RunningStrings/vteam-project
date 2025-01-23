import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
const token=sessionStorage.getItem('token');
const id=sessionStorage.getItem('id');

const Trips = () => {
  const [trips, setTrips] = useState([]);

useEffect(() => {
    // Fetch users from the backend API
    axios.get('/trips', {
      headers: { 'x-access-token': `${token}` },
    })
      .then((response) => {
        console.log('Response:', response); // Logga hela response-objektet
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          console.log('Fetched data:', response.data); // Parsar data direkt
        } else {
          throw new Error('Felaktig Content-Type: ' + contentType);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });



    /*    fetch('/trips',{headers: {'x-access-token': `${token}`}})
  .then((response) => {
    console.log('Response:', response); // Logga response-objektet
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json(); // Parsar JSON om Content-Type är korrekt
    } else {
      throw new Error('Felaktig Content-Type: ' + contentType);
    }
  })
  .then((data) => {
    console.log('Fetched data:', data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });*/
  }, []);

/*useEffect(() => {
    Promise.all([fetch('/trips',{headers: {'x-access-token': `${token}`}})])
      .then(([tripsRes]) => 
        Promise.all([tripsRes.json()])
      )
      .then(([tripsData]) => {
        setTrips(tripsData.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  */








 /* useEffect(() => {
    // Fetch trips från backend
    fetch('/trips', { headers: { 'x-access-token': `${token}` } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData && responseData.data) {
          setTrips(responseData.data); // Spara alla trips i state
  
          if (id) {
            // Filtrera trips som matchar `customer_id`
            const matchedTrips = responseData.data.filter(
              (trip) => String(trip.customer_id) === String(id) // Jämför som strängar för att säkerställa matchning
            );
  
            if (matchedTrips.length > 0) {
              console.log('Matched Trips:', matchedTrips);
  
              // Exempel: Använd första trip för att fylla formuläret
              setFormData(matchedTrips[0]); 
  
              // Om du behöver spara en specifik trip i sessionStorage
              sessionStorage.setItem('tripId', matchedTrips[0]._id);
            } else {
              console.log('Inga trips matchade customer_id.');
            }
          }
        } else {
          console.error('Response data är tomt eller felaktigt:', responseData);
        }
      })
      .catch((error) => {
        console.error('Error fetching trips:', error);
      });
  }, [token, id]); // Lägg till beroenden
*/




/*useEffect(() => {
    // Fetch users from the backend API
    fetch('/trips',{headers: {'x-access-token': `${token}`},})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setTrips(responseData.data); // Store all trips
        if (emailFromSession) {
          const matchedTrips = responseData.data.find((trips) => trips.customer_id === id);
          if (matchedTrips) {
            console.log(matchedTrips);
            //userId = matchedTrips._id;
            //sessionStorage.setItem("userId","_id")
            setFormData(matchedUser); // Populate the form with the matched user's data
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);*/


  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Resehistorik</h2>
      <table>
        <thead>
          <tr>
            <th>Bike id</th>
            <th>Tid</th>
            <th>Start</th>
            <th>Slut</th>
            <th>Kostnad</th>
          </tr>
        </thead>
        <tbody>
        {trips.map((trips, index) => (
            <tr key={index}>
            <td>{trips.bike_id}</td>
            <td>{trips.start.timestamp}</td>
            <td>{trips.start.location.coordinates}</td>
            <td>{trips.end.location.coordinates}</td>
            <td>{trips.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


  export default Trips;