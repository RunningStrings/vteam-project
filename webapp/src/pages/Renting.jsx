import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { apiKey, baseURL } from "../components/utils.jsx";


const Home = () => {
  let bikeid=sessionStorage.getItem('bikeid');
  let token=sessionStorage.getItem('token');
  const customerId=sessionStorage.getItem('id');
  const startPos=sessionStorage.getItem('startpos');
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]); // Deklarerar trips

  useEffect(() => {
    fetch('/trips')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      if (responseData && responseData.data) {
        setTrips(responseData.data);
        // Resterande logik här
      } else {
        console.error("Data är tom eller felaktig:", responseData);
      }  
      
      
      
      //setTrips(responseData.data);

        if (customerId) {
          const matchedTrip = responseData.data.find((trip) => trip.customer_id === customerId);
          if (matchedTrip) {
            console.log(matchedTrip._id);
          }
        }
    })
    .catch((error) => {
    console.error("Error fetching trips:", error);
    });

  }, []);













  async function createTrip() {
    const endpoint = `${baseURL}/trips/`;
    let token=sessionStorage.getItem('token');
    const body = {
      bike_id: bikeid,
      customer_id: customerId,
      location : {
        type: "point",  
        coordinates:[startPos[0]+0.005,startPos[1]+0.004],
      },
        free_parking:true,
    };
   try {
      const response = await fetch(endpoint, {
        method: "PATCH",
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
        return data;
      } else {
        alert("Trip har skapats");
        return null;
      }
    } catch (error) {
      alert("Ett problem uppstod när trip skapades.");
      console.error("Error creating trip:", error);
    }
  }
  

  function Bikes() {
    const [users, setUsers] = useState([]);
  
    const showToast = () => {
        toast.success("This is a success toast!", {
          position: toast.POSITION.TOP_RIGHT, // Customize position
        });
      };
    


  }
    const handleSubmit = (event) => {
      event.preventDefault();
      sessionStorage.setItem("renting", -1);
      createTrip();
      toast.success("Du har nu lämnat tillbaka: "+ bikeid, {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });

  };

    
  
  return (
      <div className="full_width">
        <h2>Lämna tillbaka en elsparkcykel</h2>
        <br></br>
        <form className="form"  onSubmit={handleSubmit}>
      
      <div className="form__group">
        <label htmlFor="id" className="form__label">
          Cykelns id-nummer:
        </label>
        <input 
        type="number" 
        id="id" 
        name="id"
        className="form__input"
        defaultValue={bikeid} 
        readOnly
        //onChange={(e) =>
        //  setFormData({ ...formData, id: e.target.value})
        //}
         />
      </div>
      <button id="fri" className="full-button blue-button" type="submit">
          Fri parkering
        </button>
        <button id="park" className="full-button blue-button" type="submit">
          Parkeringsplats/Laddning
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
       <img src="./src/assets/scooter.gif" width="420" height="320"></img>     
      </div>
    );
  };
  
  export default Home;