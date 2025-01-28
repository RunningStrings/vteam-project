import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../components/utils.jsx";


const Home = () => {
    let bikeid=sessionStorage.getItem("bikeid");
    let tripid=sessionStorage.getItem("tripId");
    let token=sessionStorage.getItem("token");
    const customerId=sessionStorage.getItem("id");
    const startPos=sessionStorage.getItem("startpos");
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]); // Deklarerar trips

    const updateUser = async (balance, cost) => {
        const endpoint = `${baseURL}/users/${customerId}`;
        //let token=sessionStorage.getItem("token");
        balance=balance-cost;
        const body = {
            "balance": balance,
        };
        try {
            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                //alert("Användaren har uppdaterats!");
                return data;
            } else {
                //alert("Användaren har uppdaterats");
                return null;
            }
        } catch (error) {
            alert("Ett problem uppstod när saldo uppdaterades.");
            console.error("Error creating user:", error);
        }
    };
    const fixCost = async (tripId) => {
        try {
            const tripResponse = await fetch(`${baseURL}/trips`, {
                headers: { "x-access-token": token },
            });

            if (!tripResponse.ok) {
                throw new Error(`Error: ${tripResponse.status} ${tripResponse.statusText}`);
            }

            const tripData = await tripResponse.json();
            const filteredTrip = tripData.data.find((trip) => trip._id === tripId);

            if (!filteredTrip) {
                throw new Error("Trip not found");
            }

            const userResponse = await fetch(`${baseURL}/users`, {
                headers: { "x-access-token": token },
            });

            if (!userResponse.ok) {
                throw new Error(`Error: ${userResponse.status} ${userResponse.statusText}`);
            }

            const userData = await userResponse.json();
            const user = userData.data.find((user) => user._id === customerId);

            if (!user) {
                throw new Error("User not found");
            }

            // Uppdate customers balance
            await updateUser(user.balance, filteredTrip.cost);
        } catch (error) {
            toast.error("Ett problem uppstod vid kostnadsberäkningen.");
            console.error("Error fixing cost:", error);
        }
    };
    
   
    async function createTrip(parking) {
        const endpoint = `${baseURL}/trips/${tripid}`;
        //let token=sessionStorage.getItem("token");
        const body = {
            end: 
       {
           location:startPos,
           free_parking:parking,
       },
            is_active:false,
        };
        try {
            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${token}`,
                },
                body: JSON.stringify(body),
            });
  
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                fixCost(tripid);
                return data;
            } else {
                fixCost(tripid);
                return null;
            }
        } catch (error) {
            alert("Ett problem uppstod när trip skapades.");
            console.error("Error creating trip:", error);
        }
    }
  

    const handleSubmit = (event) => {
        event.preventDefault();
        const buttonId = event.target.id; // Hämta vilken knapp som trycktes
        let parking = {};

        if (buttonId === "fri") {
            parking=true;
        } else if (buttonId === "park") {
            parking=false;
        }
        sessionStorage.setItem("renting", -1);
        createTrip(parking);
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