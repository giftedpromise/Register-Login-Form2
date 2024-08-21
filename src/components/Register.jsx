import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailImg from "../assets/email.png";
import personImg from "../assets/person.png";
import passwordImg from "../assets/password.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios;
    axios
      .post("http://localhost:3001/register", { name, email, password })

      .then((result) => {
        if (result.status === 201) {
          console.log("User created successfully");
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exists. Please use a different email.");
        } else {
          console.log(err);
        }
      });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with form submission
      console.log("Form submitted:", { name, email, password });
      // Navigate or perform other actions
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2 border-none outline-none"
            />
            <img src={personImg} alt="person-image" className="w-6 h-6 p-2" />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border-none outline-none"
            />
            <img src={emailImg} alt="Email-image" className="w-6 h-6 p-2" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-2 border-none outline-none"
            />
            <img
              src={passwordImg}
              alt="password-image"
              className="w-6 h-6 p-2"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
