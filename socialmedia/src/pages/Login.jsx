import React, { useState, useContext } from "react";
import "./Login.css";
import { backendUrl } from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import UserContext
import cookie from "universal-cookie"; // Import universal-cookie
import { Alert } from "antd";

const cookies = new cookie(); // Initialize cookies

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get setUser from UserContext
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${backendUrl}/api/Users/LogIn`, {
          userName,
          password,
        })
        .then((response) => {
          navigate("/");
          cookies.set("token", response.data.token, { path: "/" }); // Set token in cookies
          cookies.set("refreshToken", response.data.refreshToken, {
            path: "/",
          }); // Set refreshToken in cookies
          setUser(response.data); // Set user information in context
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          setErrors(error.response.data);
        });

      // Handle successful login here
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure here
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className=" font-bold text-xl">Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <Link className=" text-green-700 underline" to="/register">
          Don't have an account? Register here
        </Link>
        {errors&&<Alert message="error" type="error" description={errors} showIcon/>}
      </form>
      
    </div>
  );
}

export default Login;
