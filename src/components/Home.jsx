import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set user from location state when component mounts
    setUser(location.state?.user || null);
  }, [location.state]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3001/logout");
      console.log("Logout Response:", response.data); // Log response data
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="bg-blue-600 w-full py-4 text-white text-center text-2xl font-bold">
        Welcome to the Home Page!
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          Hello, {user ? user.name : "User"}!
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          This is your home page after a successful login.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </main>
      <footer className="bg-gray-800 w-full py-2 text-white text-center text-sm">
        &copy; 2024 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
