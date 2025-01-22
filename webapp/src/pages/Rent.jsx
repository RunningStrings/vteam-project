import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { apiKey, baseURL } from "../components/utils.jsx";

const Home = () => {
  let sessionId=sessionStorage.getItem('bikeid');
  const customerId=sessionStorage.getItem('id');
  const startPos=sessionStorage.getItem('startpos');
  const [bikes, setBikes] = useState([]);
  const navigate = useNavigate();
  
  async function createTrip() {
    const endpoint = `${baseURL}/trips/`;
    let token=sessionStorage.getItem('token');
    const body = {
      bike_id: sessionId,
      customer_id: customerId,
      location : {
        type: "point",  
        coordinates:startPos,
      },
        free_parking:false,
    };
   try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-access-token': `${token}`,
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      // Kontrollera om svaret innehåller JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        alert("Trip har skapats!");
        console.log(response.headers);
        return data;
      } else {
        alert("Trip har skapats");
        console.log(response.headers);
        return null;
      }
    } catch (error) {
      alert("Ett problem uppstod när trip skapades.");
      console.error("Error creating trip:", error);
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/bikes')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      //if (isMounted) {
        setBikes(responseData.data);
        const sessionId = sessionStorage.getItem('bikeid');
        console.log(sessionId);
        
        //console.log("Den här: "+responseData.data.id);
        
        //coordsFromSession = sessionStorage.getItem('bike_coords');
        if (sessionId) {
          const matchedBike = responseData.data.find((bike) => parseInt(bike.id) === parseInt(sessionId));
          if (matchedBike) {
            console.log(matchedBike);
            sessionStorage.setItem("startpos", matchedBike.location.coordinates);
            
            //setFormData(matchedBike);
          }
        }
      //}
    })
    .catch((error) => {
    console.error("Error fetching bikes:", error);
    });
  
    sessionStorage.setItem("renting", sessionId);
    createTrip();
    toast.success("Du hyr nu cykel: "+ sessionId, {
      onClose: () => {
        // Navigate or perform any action after the toast disappears
        navigate("/renting");
      },
      autoClose: 3000, // Auto close after 3 seconds
    });
  };

  
  return (
      <div className="full_width"  onSubmit={handleSubmit}>
        <h2>Hyr en elsparkcykel</h2>
        <br></br>
        <form className="form">
      
      <div className="form__group">
        <label htmlFor="id" className="form__label">
          Cykelns id-nummer:
        </label>
        <input 
        type="number" 
        id="id" 
        name="id"
        className="form__input"
        defaultValue={sessionId} 
        //onChange={(e) =>
        //  setFormData({ ...formData, id: e.target.value})
        //}
         />
      </div>
      <button className="full-button blue-button" type="submit">
          Hyr cykel
        </button>
        </form>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />      
      </div>
    );
  };
  
  export default Home;


/*  function Bikes() {
    
  
    const showToast = () => {
        toast.success("This is a success toast!", {
          position: toast.POSITION.TOP_RIGHT, // Customize position
        });
      };

  }  */
