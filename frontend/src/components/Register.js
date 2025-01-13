import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Call the backend API to create a new user
      const response = await axios.post('http://localhost:8000/user/create', {
        username,
        email,
        password
      });

      console.log('Registration successful:', response.data);
      // Redirect to sign in page after successful registration
      navigate('/signin');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Error registering user');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/signin" className="text-blue-500">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 