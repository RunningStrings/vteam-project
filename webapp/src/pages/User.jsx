import { useState, useEffect } from "react";
//import React from "react";

const initialFormValues = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    saldo: "",
    admin: ""
};

function User() {
    const [formData, setFormData] = useState(initialFormValues);
    const [users, setUsers] = useState([]); // Deklarerar users
    let token=sessionStorage.getItem("token");
    //const id=sessionStorage.getItem("id");

    const handleSubmit = (evt) => {
        evt.preventDefault();
        //console.log(formData);
        const { firstname, lastname, email, role, balance } = formData;
        updateUser(firstname, lastname, email, role, balance);
    //setFormData(initialFormValues);
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
    // Fetch users from the backend API
        fetch("/users",{headers: {"x-access-token": `${token}`},})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setUsers(responseData.data); // Store all users
                //console.log(responseData.data);
        
                const id = sessionStorage.getItem("id"); // Get id from sessionStorage
                if (id) {
                    const matchedUser = responseData.data.find((user) => user._id === id);
                    if (matchedUser) {
                        //console.log(matchedUser);
                        //userId = matchedUser._id;
                        //sessionStorage.setItem("userId","_id")
                        setFormData(matchedUser); // Populate the form with the matched user's data
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, [token]);

    return (
        <div className="App">
            <h2>Dina användaruppgifter</h2>
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
                        readOnly
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
                        readOnly
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
                        readOnly
                        className="form__input" 
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value})
                        }
                    />
                </div>

                <div className="form__group">
                    <label htmlFor="saldo" className="form__label">
            Saldo
                    </label>
                    <input
                        type="number"
                        id="saldo"
                        name="saldo"
                        value={formData.balance}
                        readOnly
                        className="form__input"
                        onChange={(e) =>
                            setFormData({ ...formData, saldo: e.target.value})
                        }
                    />
                </div>
                <div className="form__group">
                    <label htmlFor="role" className="form__label">
            Roll
                    </label>
                    <select
                        name="role"
                        id="role"
                        className="form__select"
                        readOnly
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="city_manager">Stadschef</option>
                        <option value="admin">Administratör</option>
                        <option value="customer">Kund</option>
                    </select>
                </div>
                <button className="button" type="submit">
          Submit
                </button>
            </form>
        </div>
    );
};
  
export default User;