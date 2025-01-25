import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { baseURL } from "../components/utils.jsx";
const token = sessionStorage.getItem("token");
const id = sessionStorage.getItem("id");

const Trips = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
      // Fetch trips from the backend API
      fetch(`${baseURL}/trips/`,{headers: {'x-access-token': `${token}`},})
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          const filteredTrips = responseData.data.filter((trip) => trip.customer_id === id);
          setTrips(filteredTrips); // Store all filtered trips
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }, []);

    // Function for convert timestamp
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
  };

    // Calculate timedifference
const calculateTimeDifference = (startTimestamp, endTimestamp) => {
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);
  const differenceInMs = end - start; 
  const minutes = Math.floor(differenceInMs / 60000); 
  const seconds = Math.floor((differenceInMs % 60000) / 1000);
  return `${minutes} min ${seconds} sek`;
};

  

    return (
        <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
            <h2>Resehistorik</h2>
            <table>
                <thead>
                    <tr>
                        <th>Bike id</th>
                        <th>Starttid</th>
                        <th>Sluttid</th>
                        <th>Resans tid</th>
                        <th>Kostnad</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trips, index) => (
                        
                        <tr key={index}>
                            <td>{trips.bike_id}</td>
                            <td>{formatTimestamp(trips.start.timestamp)}</td>
                            <td>{formatTimestamp(trips.end.timestamp)}</td>
                            <td>{calculateTimeDifference(trips.start.timestamp, trips.end.timestamp)}</td>
                            <td>{trips.cost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Trips;
