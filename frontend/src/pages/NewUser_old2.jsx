import { useState, useEffect } from 'react';
//import { useNavigate } from "react-router-dom";

function App() {
  //const navigate = useNavigate();
  const [login, setLogin] = useState([]);

  const handleLogin = async () => {
  
    useEffect(() => {
      // Hämta användardata när komponenten laddas
      fetch('/login')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Hämta JSON-responsen
        })
        .then((responseData) => {
          setLogin(responseData.data); // Uppdatera login state
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }, []); // Effekt körs bara en gång vid initial rendering



    /*try {
      fetch('/login')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLogin(responseData.data); // Ensure this is the correct data structure
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });*/

      

    };

    useEffect(() => {
      if (login !== null) {
        console.log('Login data:', login); // Här får du den uppdaterade login-datan
      }
    }, [login]); // Kör när login-state ändras

      
/*

      const response = await fetch('/login', {
        method: "GET"}); // Använd POST om det krävs
        console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Hämta JSON-svaret som innehåller token
      const data = await response.json();
      const token = data.token; // Förutsätter att svaret innehåller ett `token`-fält

      if (token) {
        // Spara token i localStorage
        localStorage.setItem("github_token", token);
        console.log("Token sparad:", token);

        // Navigera användaren till en skyddad sida
        navigate("/maps");
      } else {
        console.error("Ingen token hittades i svaret.");
      }
    } catch (error) {
      
      
      console.error("Inloggningsfel:", error);
    }*/
  

  useEffect(() => {
    // Anropa handleLogin vid sidladdning för att hämta token
    handleLogin();

  },[]); // Kör endast en gång vid sidladdning

  return (
<div>
      <h1>Inloggningsdata</h1>
      {login ? (
        <pre>{JSON.stringify(login, null, 2)}</pre> // Visa login-datan
      ) : (
        <p>Laddar...</p> // Om login inte är laddad än
      )}
    </div>
  )};


export default App;

    //"http://localhost:5000/api/v1/login"

  /*  const eventSource = new EventSource('http://localhost:5000/api/v1/login');

    eventSource.onmessage = (event) => {
      console.log('Ny händelse:', event.data);
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE-fel:', error);
    };
*/











/*import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiKey, baseURL } from "../components/utils.jsx";
import React from "react";

const initialFormValues = {
  firstname: "",
  lastname: "",
  email: "",
};

// Funktion för att skapa användaren via ditt API
async function createUserInBackend(firstName, lastName, email) {
  const endpoint = `${baseURL}/login`; // Byt till rätt endpoint
  const body = {
    firstname: firstName,
    lastname: lastName,
    email: email,
    role: "admin",
    balance: 0,
    password_hash: "",
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Backend error:", error);
    throw new Error("Kunde inte skapa användaren i backend.");
  }
}

// Funktion för att bjuda in användaren till GitHub
async function inviteUserToGitHub(email) {
  const githubEndpoint = `http://localhost:5000/api/v1/login`;
  const githubBody = {
    email: email,
    firstname: "M",
    lastname: "A",
    role: "admin", // Eller "admin"
  };

  try {
    const response = await fetch(githubEndpoint, {
      method: "POST",
      headers: {
        
        //"Authorization": `Bearer <your_personal_access_token>`,
        //"Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(githubBody),
    });

    if (!response.ok) {
      throw new Error(`GitHub Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub error:", error);
    throw new Error("Kunde inte bjuda in användaren till GitHub.");
  }
}

function User() {
  const [formData, setFormData] = useState(initialFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const { firstname, lastname, email } = formData;

    // Validera inmatningsfälten
    if (!firstname || !lastname || !email) {
      toast.error("Vänligen fyll i alla fält korrekt!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Skapa användaren i backend
      await createUserInBackend(firstname, lastname, email);
      toast.success("Användaren skapades i backend!");

      // Bjud in användaren till GitHub
      await inviteUserToGitHub(email);
      toast.success("Användaren har bjudits in till GitHub!");

      // Återställ formuläret och navigera
      setFormData(initialFormValues);
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              setFormData({ ...formData, firstname: e.target.value })
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
              setFormData({ ...formData, lastname: e.target.value })
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
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Skickar..." : "Skapa användare"}
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
}

export default User;










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
  
  const endpoint = `${baseURL}/login`;
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
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/login'; // URL till backend-servern
  };


  const showToast = () => {
    toast.success("This is a success toast!", {
      position: toast.POSITION.TOP_RIGHT, // Customize position
    });
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
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
      <p><button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Logga in
      </button></p>
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

  
  export default User;*/