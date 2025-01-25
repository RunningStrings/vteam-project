import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../components/utils.jsx";
import axios from "axios";

const Home = () => {
    let sessionId=sessionStorage.getItem("bikeid");
    const customerId=sessionStorage.getItem("id");
    const startPos=sessionStorage.getItem("startpos");
    const [bikes, setBikes] = useState([]);
    const navigate = useNavigate();
  
    async function createTrip() {
        const endpoint = `${baseURL}/trips/`;
        let token = sessionStorage.getItem("token");
        const body = {
            bike_id: sessionId,
            customer_id: customerId,
            location: {
                type: "point",
                coordinates: startPos,
            },
            free_parking: false,
        };
  
        try {
            const response = await axios.post(endpoint, body, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });
  
            // Kontrollera om svaret innehåller data
            if (response.data) {
                //alert("Trip har skapats!");
                if (response.data) sessionStorage.setItem("tripId",response.data.tripId);
                //console.log(response.data.tripId); // Eller hur tripId finns i svaret
                return response.data;
            } else {
                //alert("Trip har skapats!");
                console.warn("Inget data returnerades från servern.");
                return null;
            }
        } catch (error) {
            // Hantera fel, inklusive felmeddelanden från servern
            if (error.response) {
                console.error(
                    `Error: ${error.response.status} ${error.response.statusText}`
                );
                console.error("Server response:", error.response.data);
                alert("Ett problem uppstod när trip skapades. Serverfel.");
            } else if (error.request) {
                console.error("Ingen respons mottogs från servern:", error.request);
                alert("Ett problem uppstod när trip skapades. Ingen respons från servern.");
            } else {
                console.error("Ett fel uppstod:", error.message);
                alert("Ett oväntat fel uppstod.");
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("/bikes")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                //if (isMounted) {
                setBikes(responseData.data);
                const sessionId = sessionStorage.getItem("bikeid");
                console.log(sessionId);
                if (sessionId) {
                    const matchedBike = responseData.data.find((bike) => parseInt(bike.id) === parseInt(sessionId));
                    if (matchedBike) {
                        //console.log(matchedBike);
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
