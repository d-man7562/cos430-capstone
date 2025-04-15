import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [screen, setScreen] = useState("welcome"); // Tracks which screen to display
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [userRole, setUserRole] = useState(""); // Tracks if the user is a doctor or patient

  const handleScreenChange = (newScreen) => {
    setScreen(newScreen);
  };

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      alert("All fields are required!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    try {
      // **Replace the setTimeout with an actual API call**
      const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'; // Use environment variable for production

      const response = await axios.post(`${backendURL}/api/users`, userData);

      console.log("Signup successful:", response.data);
      alert(response.data.message); // Show the message from the backend
      setScreen("roleSelection");
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Signup failed: ${error.response.data.message}`);
      } else {
        alert("Something went wrong! Please try again.");
      }
    }
  };

  // Handle role selection submission
  const handleRoleSubmit = async () => {
    if (!userRole) {
      alert("Please select your role!");
      return;
    }

    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

    try {
      if (userRole === "doctor") {
        const response = await axios.post(`${backendURL}/api/doctors`, {}); // You might send more doctor-specific data here
        console.log("Doctor role submitted:", response.data);
        alert(response.data.message);
        // Navigate to doctor-specific area
      } else if (userRole === "patient") {
        const response = await axios.post(`${backendURL}/api/patients`, {}); // You might send more patient-specific data here
        console.log("Patient role submitted:", response.data);
        alert(response.data.message);
        // Navigate to patient-specific area
      }
    } catch (error) {
      console.error(`Error submitting ${userRole} role:`, error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to submit role: ${error.response.data.message}`);
      } else {
        alert("Failed to submit role. Please try again.");
      }
    }
  };

  return (
    <div className="app-container">
      {screen === "welcome" && (
        <div className="welcome-screen">
          <h1 className="welcome-title">Welcome To My Med App!</h1>
          <p className="welcome-subtitle">Choose an option below:</p>
          <div className="button-group">
            <button
              className="option-button"
              onClick={() => handleScreenChange("login")}
            >
              Log In
            </button>
            <button
              className="option-button"
              onClick={() => handleScreenChange("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {screen === "login" && (
        <div className="form-screen">
          <h2 className="form-title">Log In</h2>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="submit-button">
              Log In
            </button>
            <button
              className="back-button"
              onClick={() => handleScreenChange("welcome")}
            >
              Go Back
            </button>
          </form>
        </div>
      )}

      {screen === "signup" && (
        <div className="form-screen">
          <h2 className="form-title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Enter your first name"
                value={userData.first_name}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Enter your last name"
                value={userData.last_name}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email. This will be your username to login."
                value={userData.email}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password. Make it unique!"
                value={userData.password}
                onChange={handleInput}
              />
            </div>
            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Sign Up
            </button>
            <button
              className="back-button"
              onClick={() => handleScreenChange("welcome")}
            >
              Go Back
            </button>
          </form>
        </div>
      )}

      {screen === "roleSelection" && (
        <div className="role-selection-screen">
          <h2>Are you a Doctor or a Patient?</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={userRole === "doctor"}
                  onChange={(e) => setUserRole(e.target.value)}
                />
                Doctor
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={userRole === "patient"}
                  onChange={(e) => setUserRole(e.target.value)}
                />
                Patient
              </label>
            </div>
            <button type="button" className="submit-button" onClick={handleRoleSubmit}>
              Submit Role
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;