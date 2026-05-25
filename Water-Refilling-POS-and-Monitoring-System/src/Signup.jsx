import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/App.css';
import loginBackground from './backgrounds/loginpcbackground.jpg';
import InputField from './components/InputField';
import Button from './components/Button';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [signupResponse, setSignupResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';

    if (formData.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
      if (!emailOk) newErrors.email = 'Email is not valid';
    }

    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        setSignupResponse(data);

        // If backend returns tokens like { access, refresh } keep behavior consistent with login.
        if (data && data.access && data.refresh) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          navigate('/dashboard');
          return;
        }

        // Otherwise go to login page.
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));

        // Common DRF patterns: { detail: "..." } or field errors.
        if (errorData.detail) {
          setErrors({ general: errorData.detail });
        } else {
          setErrors({ general: errorData.detail || 'Signup failed' });
          if (errorData.username) setErrors((prev) => ({ ...prev, username: Array.isArray(errorData.username) ? errorData.username[0] : errorData.username }));
          if (errorData.email) setErrors((prev) => ({ ...prev, email: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email }));
          if (errorData.password) setErrors((prev) => ({ ...prev, password: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password }));
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error' });
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <div className="login-box">
        <h2>User Signup</h2>

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
            label="Email"
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
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

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />

          {errors.general && <p style={{ color: 'red', marginTop: '10px' }}>{errors.general}</p>}

          {signupResponse && (
            <div className="login-response-box">
              <h4>Signup Response:</h4>
              <div>{JSON.stringify(signupResponse, null, 2)}</div>
            </div>
          )}

          <div className="login-button-wrapper">
            <Button type="submit" variant="primary" size="medium" disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="button" variant="secondary" size="medium" onClick={() => navigate('/') }>
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

