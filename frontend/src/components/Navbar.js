import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, username } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-500 p-4 text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-xl hover:text-blue-200">
            Weather App
          </Link>
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-blue-200">Welcome, {username}!</span>
              <Link 
                to="/dashboard" 
                className="hover:text-blue-200 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 