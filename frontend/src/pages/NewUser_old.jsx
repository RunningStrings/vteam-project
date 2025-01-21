import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
// Frontend code to handle the login flow (React)
window.addEventListener('DOMContentLoaded', async () => {
  // After user is redirected back to frontend
  try {
    // You may need to call the backend again to fetch the token, especially after redirect
    const response = await fetch('http://localhost:5000/api/v1/login', {
      method: 'GET'
    });

    const data = await response.json();

    if (data.token) {
      // Store token in localStorage or sessionStorage
      localStorage.setItem('auth_token', data.token);

      // Redirect to a dashboard or protected page
      window.location.href = '/maps';
    }
      // Handle the case where token is not received
      console.error('Failed to receive token');
  } catch (error) {
    console.error('Error during authentication flow:', error);
  }
});

  return (
    <div>
      <h1>GitHub-inloggning</h1>
    </div>
  );
}

export default App;
