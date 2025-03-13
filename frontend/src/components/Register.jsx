import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'financial_planner',
    security_question: 'What is your mother’s maiden name?',
    security_answer: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccessMessage(res.data.message);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'financial_planner',
        security_question: 'What is your mother’s maiden name?',
        security_answer: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="financial_planner">Financial Planner</option>
            <option value="mortgage_broker">Mortgage Broker</option>
          </select>

          {/* Security Question Dropdown */}
          <select
            name="security_question"
            value={formData.security_question}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
            <option value="What was the make and model of your first car?">What was the make and model of your first car?</option>
            <option value="What is your favorite book?">What is your favorite book?</option>
            <option value="What is the name of the city where you were born?">What is the name of the city where you were born?</option>
            <option value="Who was your childhood hero?">Who was your childhood hero?</option>
          </select>

          <input
            name="security_answer"
            placeholder="Security Answer"
            value={formData.security_answer}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />

          <button
            type="submit"
            className={`w-full p-3 rounded-md text-white font-bold ${
              loading ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
