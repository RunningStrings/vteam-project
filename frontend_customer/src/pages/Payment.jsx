import { useState, useEffect } from "react";
import { apiKey, baseURL, toast } from "../components/utils.jsx";

async function updateUserBalance(userId, newBalance) {
  const endpoint = `${baseURL}/users/${userId}`;
  const body = { "balance": newBalance+"" };

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

    const data = await response.json();
    toast("Balance successfully updated!");
    return data;
  } catch (error) {
    toast("An error occurred while updating balance.");
    console.error("Error updating balance:", error);
  }
}

function DynamicForm() {
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    fetch(`${baseURL}/users`,{
      headers: {
        "Content-Type": "application/json",
        //"x-api-key": apiKey,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUsers(data.data || []))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = "6775634df665dfbf9f5bf389"; // Ersätt med riktig användar-ID
    updateUserBalance(userId, balance);
  };

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Betalning</h2>
      <p>Du kan ha olika typer av betalning.</p>
      <p>Antingen betalar du direkt med kreditkort eller så väljer du månadsinbetalning.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="category" className="form__label">Välj typ av betalning:</label>
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

        {selectedOption === "onetime" && (
          <div>
            <div className="form__group">
              <label htmlFor="name" className="form__label">Namn på kreditkortet:</label>
              <input type="text" id="name" name="name" className="form__input" />
            </div>
            <div className="form__group">
              <label htmlFor="saldo" className="form__label">Belopp:</label>
              <input
                type="text"
                id="saldo"
                name="saldo"
                className="form__input"
                onChange={(e) => setBalance(e.target.value)}
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
                type="text"
                id="money"
                name="money"
                className="form__input"
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </div>
        )}

        <button type="submit" className="form__button">Skicka</button>
      </form>
    </div>
  );
}

export default DynamicForm;
