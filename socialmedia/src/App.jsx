import { useState, useEffect } from "react";
import "jwt-decode"; // Correct import statement
import { BrowserRouter as Router  } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { CommentsContext } from "./context/CommentsContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import { useDispatch } from "react-redux";
import { refreshUserAndToken } from "./features/userSlice";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";
import { WebSocketChatProvider} from "./hooks/useOpenChat"
function App() {
  const [comments, setComments] = useState([]);




  return (
<div style={{ height: "100vh" }}>
  <WebSocketProvider>
    <WebSocketChatProvider>
    <CommentsContext.Provider value={{ comments, setComments }}>
      <Router>
        <Layout/>
      </Router>
    </CommentsContext.Provider>
    </WebSocketChatProvider>
  </WebSocketProvider>
</div>
  );
}

export default App;