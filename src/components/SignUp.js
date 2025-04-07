import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOTP, registerUser } from '../services/auth';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Get auth parameter from URL on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authParam = urlParams.get("auth");
      setUserRole(authParam || 'customer');
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !name || !phone) {
      setError('All fields are required');
      return;
    }
    
    try {
      // Generate OTP - this will console log the OTP
      const otp = generateOTP();
      // OTP is already logged in the generateOTP function
      
      // Store user data temporarily
      const userData = {
        email,
        password,
        name,
        phone,
        role: userRole || 'customer',
      };
      
      // Register user in local storage
      registerUser(userData);
      
      // Log OTP to console for testing
      console.log(`OTP for ${email}: ${otp}`);
      
      // Navigate to OTP verification page
      navigate('/verify-otp');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Sign Up {userRole ? `as ${userRole}` : ''}</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;