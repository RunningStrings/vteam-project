import { useState, useEffect  } from "react";
import { apiKey, baseURL } from "../components/utils.jsx";
import { ToastContainer, toast } from "react-toastify";


async function updateUserBalance(userId, newBalance) {
  const endpoint = `${baseURL}/users/${userId}`;
  const body = { "balance": newBalance };

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        //"x-api-key": apiKey, // Aktivera vid behov
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Hantera tomt svar (t.ex., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response data:", data);
      toast("Pengarna är insatta på kontot!");
      return data;
    } else {
      console.warn("No JSON content in response.");
      toast("Pengarna är insatta på kontot!");
      return null;
    }
  } catch (error) {
    toast("Ett problem uppstod när pengarna sattes in");
    console.error("Error updating balance:", error);
  }
}
function DynamicForm() {
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState("");

  const showToast = () => {
    toast.success("This is a success toast!", {
      position: toast.POSITION.TOP_RIGHT, // Customize position
    });
  };


  useEffect(() => {
    fetch(`${baseURL}/users`, {
      headers: {
        "Content-Type": "application/json",
        //"x-api-key": apiKey, // Om API-nyckel behövs
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data?.data) {
          setUsers(data.data);
        } else {
          console.warn("No users found in response.");
          setUsers([]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!balance) {
      toast("Please enter a valid balance.");
      return;
    }

    const userId = "6775634df665dfbf9f5bf389"; // Uppdatera med dynamiskt användar-ID om möjligt
    updateUserBalance(userId, balance)
      .then((data) => {
        if (data) {
          console.log("Update successful:", data);
          toast.success("This is a success message!");
        }
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  };

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Betalning</h2>
      <p>Välj din betalningstyp:</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="category" className="form__label">Betalningstyp:</label>
          <select
            id="category"
            name="category"
            className="form__select"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="">-- Välj --</option>
            <option value="onetime">Engångsbetalning</option>
            <option value="month">Månadsbetalning</option>
          </select>
        </div>

        {/* Dynamiska fält */}
        {selectedOption === "onetime" && (
          <div>
            <div className="form__group">
              <label htmlFor="name" className="form__label">Namn på kreditkortet:</label>
              <input type="text" id="name" name="name" className="form__input" />
            </div>
            <div className="form__group">
              <label htmlFor="saldo" className="form__label">Belopp:</label>
              <input
                type="number"
                id="saldo"
                name="saldo"
                className="form__input"
                onChange={(e) => setBalance(e.target.value)}
                value={balance}
              />
            </div>
          </div>
        )}

        {selectedOption === "month" && (
          <div>
            <div className="form__group">
              <label htmlFor="account" className="form__label">Kontonummer:</label>
              <input type="text" id="account" name="account" className="form__input" />
            </div>
            <div className="form__group">
              <label htmlFor="money" className="form__label">Belopp:</label>
              <input
                type="number"
                id="money"
                name="money"
                className="form__input"
                onChange={(e) => setBalance(e.target.value)}
                value={balance}
              />
            </div>
          </div>
        )}

        <button type="submit" className="form__button">Skicka</button>
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

export default DynamicForm;

