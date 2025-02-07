import { useState, useEffect } from "react";
import "jwt-decode"; // Correct import statement
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CommentsContext } from "./context/CommentsContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Protected from "../src/utils/Protected";
import Sider from "./pages/MainSider";
import MyPosts from "./pages/MyPosts";
import Header from "./pages/MainHeader";
import Favorites from "./pages/Favorites";
import { useDispatch } from "react-redux";
import Profile from "./pages/Profile";
import { refreshUserAndToken } from "./features/userSlice";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const cookie = new Cookies();
  const refreshToken = cookie.get("refreshToken");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUserAndToken());
  }, [dispatch]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const decoded = jwtDecode(accessToken); // Correct usage
    const expiresAt = decoded.exp * 1000;
    const bufferTime = 60000; // Refresh 1 minute before expiration

    const timeoutId = setTimeout(() => {
      dispatch(refreshUserAndToken());
    }, expiresAt - Date.now() - bufferTime);

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <div style={{ height: "100vh" }}  >
      <WebSocketProvider>
        <CommentsContext.Provider value={{ comments, setComments }}>
          <Router>
            <Header />
            <Sider />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<Protected />}>
                <Route path="/Favorites" element={<Favorites />} />
                <Route path="/MyPosts" element={<MyPosts />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </Router>
        </CommentsContext.Provider>
      </WebSocketProvider>
    </div>
  );
}

export default App;
