import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const initialFormValues = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    saldo: "",
    role: ""
};

function User() {
    const [formData, setFormData] = useState(initialFormValues);
    const [users, setUsers] = useState([]); // Deklarerar users
    let token=sessionStorage.getItem("token");
    const id=sessionStorage.getItem("id");

    const updateUser = async (firstname, lastname, email, role, balance) => {
        try {
            const response = await fetch(`/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    role,
                    balance
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            //console.log("User updated:", result);
            toast.success("Dina uppgifter är uppdaterade!", {
                onClose: () => {
                },
                autoClose: 3000, // Auto close after 3 seconds
            });

        } catch (error) {
            toast.error("Ett problem uppstod! Uppgifterna uppdaterades inte.", {
                onClose: () => {
                    //navigate("/");
                },
                autoClose: 3000, // Auto close after 3 seconds
            });
            console.error("Error updating user:", error);
        }
    };



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
                const id = sessionStorage.getItem("id"); // Get id from sessionStorage
                //console.log(responseData.data);
        
                if (id) {
                    const matchedUser = responseData.data.find((user) => user._id === id.trim());
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
        <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
            <h2>En användare</h2>
            <form className="form" onSubmit={handleSubmit}>
      
                <div className="form__group">
                    <label htmlFor="id" className="form__label">
            Id
                    </label>
                    <input 
                        type="string" 
                        id="id" 
                        name="id"
                        value={formData._id || ""}
                        className="form__input" 
                        onChange={handleChange}
                    />
                </div>
                <div className="form__group">
                    <label htmlFor="firstname" className="form__label">
            Förnamn
                    </label>
                    <input 
                        type="text" 
                        id="firstname" 
                        name="firstname"
                        value={formData.firstname || ""}
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
                        value={formData.lastname || ""}
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
                        value={formData.email || ""}
                        className="form__input" 
                        onChange={handleChange}
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
                        value={formData.balance || ""}
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