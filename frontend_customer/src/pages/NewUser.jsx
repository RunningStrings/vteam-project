import { useState, useEffect } from 'react';
import { apiKey, baseURL } from "../components/utils.jsx";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import React from "react";

const initialFormValues = {
  firstname: "",
  lastname: "",
  email: "",
}

//const navigate = useNavigate();

async function createNewUser(firstName, lastName, email, navigate) {
  const endpoint = `${baseURL}/users`;
  const body = { 
    "firstname": firstName, 
    "lastname": lastName, 
    "email": email,
    "role": "customer",
    "balance": 0,
    "password_hash": "",
  };
  

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"x-api-key": apiKey, // Aktivera vid behov
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
   toast.success("Du är nu skapad som ny användare!", {
    onClose: () => {
      // Navigate or perform any action after the toast disappears
      navigate("/");
    },
    autoClose: 3000, // Auto close after 3 seconds
  });

   
   
   
   //console.log("Response data:", data);
   //alert("Användaren har skapats!");
   return data;
 } else {
  toast.success("Du är nu skapad som ny användare!", {
    onClose: () => {
      // Navigate or perform any action after the toast disappears
      navigate("/");
    },
    autoClose: 3000, // Auto close after 3 seconds
  });

  
  
  
  //console.warn("No JSON content in response.");
   //alert("Användaren har skapats, men inget data returnerades.");
   return null;
 }
} catch (error) {
 alert("Ett problem uppstod när användaren skapades.");
 console.error("Error creating user:", error);
}
}

function User() {
  const [formData, setFormData] = useState(initialFormValues);
  const navigate = useNavigate();

  const showToast = () => {
    toast.success("This is a success toast!", {
      position: toast.POSITION.TOP_RIGHT, // Customize position
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { firstname, lastname, email } = formData;

    // Kontrollera om fälten är ifyllda
    if (!firstname || !lastname || !email) {
      alert("Vänligen fyll i alla fält.");
      return;
    }

    createNewUser(firstname, lastname, email, navigate).then(() => {
      setFormData(initialFormValues); // Återställ formuläret
    });
  };



  return (
    //console.log(formData);
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Ny användare</h2>
      <form className="form" onSubmit={handleSubmit}>
      
        <div className="form__group">
          <label htmlFor="firstname" className="form__label">
            Förnamn
          </label>
          <input 
          type="text" 
          id="firstname" 
          name="firstname"
          value={formData.firstname}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, firstname: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="lastname" className="form__label">
            Efternamn
          </label>
          <input 
          type="text" 
          id="lastname" 
          name="lastname" 
          value={formData.lastname}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="email" className="form__label">
            E-post
          </label>
          <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value})
          }
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