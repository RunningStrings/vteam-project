/* global L */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useMap } from "../hooks";

const Maps = () => {
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
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  );  
  
  
  
  
  /*return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Kartor</h1>
        <p>Welcome to the home page.</p>
      </div>
    );*/
  };
  
  export default Maps;