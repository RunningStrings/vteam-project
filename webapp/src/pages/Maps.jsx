/* global L */
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { useState, useEffect } from 'react';
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import L, { LatLng } from "leaflet";

import { useMap } from "../hooks";

  const Maps = () => {

    
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);
    const [parkings, setParking] = useState([]);

  useEffect(() => {
    // Fetch bikes from the backend API
    fetch('/cities')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error fetching cities:', error));

    // Fetch bikes from the backend API
    fetch('/parking_zones')
      .then(response => response.json())
      .then(data => setParking(data))
      .catch(error => console.error('Error fetching parking:', error));

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

    const bikeRed = new L.Icon({
      iconUrl: './src/assets/scooter_red.png',
    iconSize:[25,25]  
    });

    const bikeGreen = new L.Icon({
      iconUrl: './src/assets/scooter_green.png',
    iconSize:[25,25]  
    });

    const bikeOrange = new L.Icon({
      iconUrl: './src/assets/scooter_orange.png',
    iconSize:[25,25]  
    });

    const bikeEmpty = new L.Icon({
      iconUrl: './src/assets/scooter_empty.png',
    iconSize:[25,25]  
    });



    //const cityBorder = new L.polygon;
    //console.log(stations);    
for (let index = 0; index < cities.length; index++) {
  const element = cities[index];
  //console.log(element);
  
}
  //const {position} = useMap();//L.GeoJson.coordsToLatLngs() ;
  return (
<div>
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
        <Polygon
        positions={city.geometry.coordinates} //LatLng.wrap(
          key={index}
          color="blue"
          fillColor="blue"
          fill="true"
          fillOpacity={0.15}
          >
        </Polygon>
       ))}

{parkings.map((parking, index) => (
        <Polygon
        positions={parking.location.coordinates} //LatLng.wrap(
          key={index}
          color="red"
          fillColor="red"
          fill="true"
          >
        <Popup>
         <br />
          </Popup>
        </Polygon>
 
      ))}

<MarkerClusterGroup>
{stations.map((station, index) => (
      <Marker 
        position={station.location.coordinates}
        key={index}
        icon={stationIcon}
        >
      <Popup>
       Station nr: {index} <br />
       Hagagatan
        </Popup>
      </Marker>
    ))}
</MarkerClusterGroup>
<MarkerClusterGroup>
{bikes.map((bike, index) => (
    //{charging_stations.map((charging_stations, index) => (
      <Marker 
        position={bike.location.coordinates}
        key={index}
        icon={bike.status === "available" ? bikeGreen: bike.status === "charging" ? bikeRed: bikeEmpty} 
        >
      <Popup>
      
      Cykel nr: {index}<br /> 
      Batteri: {bike.battery_level}% <br /> 
      {bike.status} 
        </Popup>
      </Marker>
    ))}
</MarkerClusterGroup>
</MapContainer>
    </div>
  );  
  };
  
  export default Maps;
