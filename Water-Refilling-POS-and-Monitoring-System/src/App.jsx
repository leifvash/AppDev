import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./styles/App.css";
import loginBackground from "./backgrounds/loginpcbackground.jpg";
import Dashboard from "./Dashboard";
import InputField from "./components/InputField";
import Button from "./components/Button";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginResponse, setLoginResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          setLoginResponse(data);

          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
        } else {
          const errorData = await response.json();
          console.error('Login failed:', errorData);
          setErrors({ general: errorData.detail || 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Network error:', error);
        setErrors({ general: 'Network error' });
      }
    } else {
      setErrors(newErrors);
    }
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
          <InputField
            label="Username"
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          {/* handle errors */}
          {errors.general && (
            <p style={{ color: "red", marginTop: "10px" }}>{errors.general}</p>
          )}

          {/* display login response from backend */}
          {loginResponse && (
            <div className="login-response-box">
              <h4>Login Response tokens from backend API:</h4>
              <div>{JSON.stringify(loginResponse, null, 2)}</div>
              <Button onClick={() => navigate("/dashboard")} >Continue to Dashboard</Button>
            </div>
          )}
          
          <div className="login-button-wrapper">
            <Button
              type="submit"
              variant="primary"
              size="medium"
            >
              Login
            </Button>
          </div>
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