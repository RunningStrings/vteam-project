import { useState, useEffect } from "react";
import { baseURL } from "../components/utils.jsx";
//import { ToastContainer, toast } from "react-toastify";
//import React from "react";

let userId = "";
const initialFormValues = {

    id: "",
    firstname: "",
    lastname: "",
    email: "",
    balance: "",
    admin: ""

};

async function updateUser(firstName, lastName, email, role, balance) {
    const endpoint = `${baseURL}/users/${userId}`;
    let token=sessionStorage.getItem("token");
    const body = {
        "firstname": firstName,
        "lastname": lastName,
        "email": email,
        "role": role,
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

        // Kontrollera om svaret innehåller JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            /* toast.success("Du är nu uppdaterat en användare!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });*/




            //console.log("Response data:", data);
            alert("Användaren har uppdaterats!");
            return data;
        } else {
            /*toast.success("Du är nu updaterat en användare!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });*/




            //console.warn("No JSON content in response.");
            alert("Användaren har uppdaterats");
            return null;
        }
    } catch (error) {
        alert("Ett problem uppstod när användaren skapades.");
        console.error("Error creating user:", error);
    }
}





function User() {
    const [formData, setFormData] = useState(initialFormValues);
    const [users, setUsers] = useState([]); // Deklarerar users
    const [selectedUserId, setSelectedUserId] = useState([]); // Deklarerar users
    let token=sessionStorage.getItem("token");

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
                const emailFromSession = sessionStorage.getItem("email"); // Get email from sessionStorage
                if (emailFromSession) {
                    const matchedUser = responseData.data.find((user) => user.email === emailFromSession);
                    if (matchedUser) {
                        //console.log(matchedUser);
                        userId = matchedUser._id;
                        //sessionStorage.setItem("userId","_id")
                        setFormData(matchedUser); // Populate the form with the matched user's data
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, [token]);

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
                    <label htmlFor="firstname" className="form__label">
            Förnamn
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        className="form__input"
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                    />
                </div>

                <div className="form__group">
                    <label htmlFor="balance" className="form__label">
            Saldo
                    </label>
                    <input
                        type="number"
                        id="balance"
                        name="balance"
                        value={formData.balance}
                        className="form__input"
                        onChange={handleChange}
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