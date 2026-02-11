import React from "react";
import "./styles/App.css";
import loginBackground from "./backgrounds/loginpcbackground.jpg";

function App() {
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
        <form>
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

export default App;
