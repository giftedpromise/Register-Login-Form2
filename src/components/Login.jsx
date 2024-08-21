import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailImg from "../assets/email.png";
import passwordImg from "../assets/password.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      axios
        .post(
          "http://localhost:3001/login",
          { email, password },
          { withCredentials: true }
        )
        .then((result) => {
          if (result.data === "Success") {
            axios
              .get("http://localhost:3001/user", { withCredentials: true })
              .then((response) => {
                if (response.data.user) {
                  navigate("/home", { state: { user: response.data.user } });
                }
              });
          } else {
            alert("Login failed");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border-none outline-none"
            />
            <img src={emailImg} alt="Email" className="w-6 h-6 p-2" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-4 py-2 border-none outline-none"
            />
            <img src={passwordImg} alt="Password" className="w-6 h-6 p-2" />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          <div className="flex justify-between">
            <button
              type="submit"
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

export default Login;
