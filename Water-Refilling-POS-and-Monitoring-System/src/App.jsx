import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./styles/App.css";
import loginBackground from "./backgrounds/loginpcbackground.jpg";
import Dashboard from "./Dashboard"; 

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
 
    navigate("/dashboard"); 
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="login-box">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;