import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData) {
      // Redirect to login if no user is found
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>Welcome, {user.name}!</h2>
        </div>
        <div className="card-body">
          <p>You have successfully logged in.</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;