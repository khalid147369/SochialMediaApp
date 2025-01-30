import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import "./Login.css";
import { backendUrl } from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie"; // Import universal-cookie
import { Alert } from "antd";

const cookies = new Cookies(); // Initialize cookies

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        },{ withCredentials: true })
        .then((response) => {
          
          cookies.set("token", response.data.token, { path: "/" }); // Set token in cookies
          dispatch(setUser(response.data)) ; // Set user information in context
          console.log(response.data);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setErrors(error.response);
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
