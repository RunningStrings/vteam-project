/* global L */
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { useState, useEffect } from 'react';
import L, { LatLng } from "leaflet";

import { useMap } from "../hooks";

/*function Maps() {
  const [charging_stations, setStations] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cities, setCities] = useState([]);


  }*/
  const Maps = () => {

    
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);

  useEffect(() => {
    // Fetch bikes from the backend API
    fetch('/cities')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error fetching cities:', error));

    // Fetch stations from the backend API
    fetch('/charging_stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));
    
    // Fetch bikes from the backend API
    fetch('/bikes')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching bikes:', error));
    }, []);

    const stationIcon = new L.Icon({
      iconUrl: './src/assets/location.png',
    iconSize:[32,32]  
    });

    
    const bikeIcon = new L.Icon({
      iconUrl: './src/assets/kick-scooter.png',
    iconSize:[25,25]  
    });

    //const cityBorder = new L.polygon;
    //console.log(stations);    
for (let index = 0; index < cities.length; index++) {
  const element = cities[index];
  console.log(element);
  
}
  //const {position} = useMap();//L.GeoJson.coordsToLatLngs() ;
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



{cities.map((city, index) => (
  //if(city.geometry && city.geometry.coordinates && city.geometry.coordinates.length > 0) {
    // Transform GeoJSON-style coordinates ([longitude, latitude]) to Leaflet-compatible ([latitude, longitude])
    //const positions = city.geometry.coordinates[0].map(([longitude, latitude]) => [latitude, longitude]);
      //L.marker({station.location.coordinates}, {icon: stationIcon}).addTo(map);
  //L.polygon({city.geometry.coordinates}).addTo(L.map);
        //if(city.geometry.coordinates!=0) {
          //positions = city.geometry.coordinates[0].map(([longitude, latitude]) => [latitude, longitude]);    
        <Polygon
          
        positions={city.geometry.coordinates} //LatLng.wrap(
          key={index}
          color="blue"
          fillColor="blue"
          fill="true"
          >
          
          
        <Popup>
        
        {city.name} <br />
          </Popup>
        </Polygon>
      //}
  
      ))}


{stations.map((station, index) => (
      
    //L.marker({station.location.coordinates}, {icon: stationIcon}).addTo(map);

      <Marker 
        position={station.location.coordinates}
        key={index}
        icon={stationIcon}
        >
        
        
      <Popup>
      
      {index} Station. <br />
        </Popup>
      </Marker>
  

    ))}
{bikes.map((bike, index) => (
    //{charging_stations.map((charging_stations, index) => (
      <Marker 
        position={bike.location.coordinates}
        key={index}
        icon={bikeIcon}
        >
      <Popup>
      
      {index}. Batteri:{bike.battery_level}% <br /> {bike.status} 
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