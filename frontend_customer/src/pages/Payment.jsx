import { useState, useEffect } from 'react';
import { baseURL } from "../components/utils.jsx";
import { ToastContainer, toast } from "react-toastify";
//import { useNavigate } from 'react-router-dom';
import React from "react";

let userId = "";

const initialFormValues = {

  id: "",
  firstname: "",
  lastname: "",
  balance: "",
  
}

async function updateUser(balance,paying) {
  const endpoint = `${baseURL}/users/${userId}`;
  
  let token=sessionStorage.getItem('token');
  console.log(userId);
  
  const body = {
    "balance": (Number(balance)+Number(paying)),
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
      toast.success("Du är nu gjort en insättning!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          //const navigate = useNavigate();
          //navigate("/user");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });
      //console.log("Response data:", data);
      //alert("Användaren har uppdaterats!");
      return data;
    } else {
      toast.success("Du är nu gjort en insättning!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          //navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });
      //alert("Användaren har uppdaterats");
      return null;
    }
  } catch (error) {
    alert("Ett problem uppstod när betalningen gjordes.");
    //console.error("Error creating user:", error);
  }
}

function User() {
  const [formData, setFormData] = useState(initialFormValues);
  const [users, setUsers] = useState([]); // Deklarerar users
  const [selectedUserId, setSelectedUserId] = useState([]); // Deklarerar users
  let token=sessionStorage.getItem('token');
  let paying=0;

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //console.log(formData);
    const { firstname, lastname, email, role, balance,paying } = formData;
    updateUser(balance,paying);
    //setFormData(initialFormValues);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Fetch users from the backend API
    fetch('/users',{headers: {'x-access-token': `${token}`},})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setUsers(responseData.data); // Store all users
        userId = sessionStorage.getItem('id'); // Get email from sessionStorage
        if (userId) {
          const matchedUser = responseData.data.find((user) => user._id === userId);
          if (matchedUser) {
            //console.log(matchedUser);
            //userId = matchedUser._id;
            //sessionStorage.setItem("userId","_id")
            setFormData(matchedUser); // Populate the form with the matched user's data
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleUserSelect = (evt) => {
    const userId = evt.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (user) {
      setFormData(user); // Populate formData with the selected user's data
    }
  };

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En användare</h2>
      <form className="form" onSubmit={handleSubmit}>

        <div className="form__group">
          <label htmlFor="name" className="form__label">
            Namn på kort
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.firstname+" "+formData.lastname}
            className="form__input"
            onChange={handleChange}
          />
        </div>
        <div className="form__group">
          <label htmlFor="date" className="form__label">
            Kortnummer
          </label>
          <input
            type="text"
            id="cardnumber"
            name="cardnumber"
            value="1235 4568 5987 4563"
            className="form__input"
            onChange={handleChange}
          />
        </div>
        <div className="form__group">
          <label htmlFor="date" className="form__label">
            Utgångsdatum
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value="04-27"
            className="form__input"
            onChange={handleChange}
          />
        </div>
        <div className="form__group">
          <label htmlFor="cvc" className="form__label">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            name="cvc"
            value="321"
            className="form__input"
            onChange={handleChange}
          />
        </div>
        <div className="form__group">
          <label htmlFor="balance" className="form__label">
            Önskad insättning
          </label>
          <input
            type="number"
            id="paying"
            name="paying"
            defaultValue={paying}
            className="form__input"
            onChange={handleChange}
          />
        </div>
        <button className="button" type="submit">
          Submit
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

export default User;
