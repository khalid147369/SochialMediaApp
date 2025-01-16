import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PostsContext } from "./context/PostsContext";
import { CommentsContext } from "./context/CommentsContext";
import Protected from "../src/utils/Protected";
import Sider from "./pages/MainSider";
import MyPosts from "./pages/MyPosts";
import Header from "./pages/MainHeader";
import Favorites from "./pages/Favorites";
import { CommentsProvider } from "./context/CommentsContext";
import { FavoritesProvider } from "./context/FavoritesContext"; // Import FavoritesProvider

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  return (
    <div style={{ height: "100vh" }}>
      <PostsContext.Provider value={{ posts, setPosts }}>
        <CommentsContext.Provider value={{ comments, setComments }}>
          <FavoritesProvider> {/* Wrap with FavoritesProvider */}
            <Router>
              <Header />
              <Sider />
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/register" element={<Register />} />
                <Route element={<Protected />}>
                <Route path="/Favorites" element={<Favorites />} />
                <Route path="/MyPosts" element={<MyPosts />} />
                  <Route path="/" element={<Home />} />
                </Route>
              </Routes>
            </Router>
          </FavoritesProvider>
        </CommentsContext.Provider>
      </PostsContext.Provider>
    </div>
  );
}

export default App;
