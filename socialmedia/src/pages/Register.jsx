import React, { useState } from "react";
import "./Login.css";
import { backendUrl } from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UploadButton from "../components/UploadButton";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {  Input } from "antd";
import { Alert } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(false);
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("email", email);
    form.append("userName", userName);
    form.append("passWord", password);
    form.append("avatar", avatar);
    try {
      const response = await axios
        .post(`${backendUrl}/api/Users/Regester`, form)
        .then((response) => {
          if (response.status === 200) navigate("/login");
        })
        .catch((error) => {
          console.log(error);
          setErrors(error.response.data);
        });
      console.log("Registration successful:", response.data);
      // Clear input fields upon successful registration
      setEmail("");
      setUserName("");
      setPassword("");
      // Handle successful registration here
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration failure here
    }
  };
  const getAvatar = (avatar) => {
    setAvatar(avatar);
  };
  console.log(errors);
  return (
    <div className="login-container overflow-auto">
      <form className="login-form " onSubmit={handleSubmit}>
     
        <div className="flex justify-around items-center">
          <h2>Register</h2>
          <UploadButton getImage={getAvatar} UploadDescreption="Upload avatar" />
        </div>

        <div className="">
          <label htmlFor="email">Email:</label>
          <Input
            type="email"
          placeholder="enter an email.."
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="username">Username:</label>
          <Input
            type="text"
            id="username"
          placeholder="enter a username.."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <Input.Password
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="enter a password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <button type="submit">Register</button>
        <Link className=" text-green-700 underline" to="/login">
          Already have an account? Login here
        </Link>
        {errors &&
          errors.map((errs, index) => (
            
             
              <Alert className=" mt-2" key={index} severity="error" >{errs.description}</Alert>
            
          ))}
      </form>
    </div>
  );
}

export default Register;
