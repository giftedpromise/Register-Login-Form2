// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Add route for Profile */}
      <Route path="/" element={<Register />} />
    </Routes>
  );
};

export default App;
