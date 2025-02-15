import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Protected from "../src/utils/Protected";
import Sider from "./pages/MainSider";
import Header from "./pages/MainHeader";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import MainProfile from "./pages/MainProfile";
import Contacts from "./pages/Contacts";
import Notifications from "./pages/Notifications"
function Layout() {

  const location = useLocation();

  const hideHeaderOnRoutes = ["/login", "/register", "/Contacts", "/Profile"]; // Add routes where you don't want the header




  return (
    <>
      {!hideHeaderOnRoutes.includes(location.pathname) && <Header />}
      <Sider />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Protected />}>
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/MainProfile/:id" element={<MainProfile />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default Layout;
