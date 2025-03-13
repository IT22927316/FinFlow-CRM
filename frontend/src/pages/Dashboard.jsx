import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (!userRole) {
      navigate('/'); // Redirect to login if not authenticated
    } else {
      setRole(userRole);

      // Set a custom welcome message based on the role
      switch (userRole) {
        case 'admin':
          setWelcomeMessage("Welcome Admin! 👑 You can manage users and settings.");
          break;
        case 'financial_planner':
          setWelcomeMessage("Welcome Financial Planner! 📊 Manage client tickets.");
          break;
        case 'mortgage_broker':
          setWelcomeMessage("Welcome Mortgage Broker! 🏡 Review and approve applications.");
          break;
        default:
          setWelcomeMessage("Welcome to your dashboard!");
      }
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Dashboard</h1>
        
        <p className="text-lg text-gray-700">{welcomeMessage}</p>

        <button
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
