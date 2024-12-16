/* global L */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from 'react';

import { useMap } from "../hooks";

/*function Maps() {
  const [charging_stations, setStations] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cities, setCities] = useState([]);


  }*/
  const Maps = () => {

    const [stations, setStations] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
  

  useEffect(() => {
    // Fetch stations from the backend API
    fetch('/charging_stations')
    .then(response => {
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);



      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response);
      
      return response.json();
    })
    .then(data => {
      console.log("Fetched stations:", data); // Log data to verify it
      setStations(data);
    })
    .catch(error => console.error('Error fetching stations:', error));



    /*fetch('/charging_stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));*/
    
    
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

  

  const {position} = useMap();
  return (
    <div style={{ marginLeft: "150px", marginBottom: "100px", width: "100px", padding: "20px" }}>
    <h2>Karta</h2>
    <MapContainer
      center={[57.18219, 16.59094]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw"}}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
{stations.map((station, index) => (
    //{charging_stations.map((charging_stations, index) => (
      <Marker 
        position={station.location.coordinates}>

      <Popup>
      
      {index} Station. <br /> Easily customizable.
        </Popup>
      </Marker>
  

    ))}
{bikes.map((bike, index) => (
    //{charging_stations.map((charging_stations, index) => (
      <Marker 
        position={bike.location.coordinates}>

      <Popup>
      
      {index} Bike. <br /> Easily customizable.
        </Popup>
      </Marker>
  

    ))}


    </MapContainer>
    </div>
  );  
  
  
  
  };
  
  export default Maps;


  
  
  /*return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Kartor</h1>
        <p>Welcome to the home page.</p>
      </div>
    );*/