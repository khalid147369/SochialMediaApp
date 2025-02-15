import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketChatContext = createContext(null);
import { setMessages } from "../features/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { backendUrlWs } from "../config";
import Cookies from "universal-cookie";
export const WebSocketChatProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessage] = useState([]);
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const { user } = useSelector((state) => state.user);
  const token = cookie.get("token");

  useEffect(() => {
    if (!token) {
      console.log(
        "Token not available yet. WebSocket connection will not be created."
      );
      return;
    }
    // Only create a connection if one doesn't already exist.
    console.log(user);
    // if (!wsRef.current) {
      
      console.log(token);

      wsRef.current = new WebSocket( 
        `${backendUrlWs}/api/chat/ws/${user.userId}?token=${token}`
        // `ws://localhost:5184/api/chat/ws/1856bdea-e4df-469c-bc12-4986a1d73556?token=${token}`
      );

      wsRef.current.onopen = () => {
        console.log("WebSocket connected from contact");
        setConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        console.log("Received message:", event.data);

        try {
          const data = JSON.parse(event.data);
          setMessage((prev) => [...prev, data]);
          dispatch(setMessages(data));
        } catch (event) {
          console.error("Failed to parse message", event.data);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        // You can implement reconnection logic here if desired.
      };
    // }

    // Do not return a cleanup function here if you want to keep the connection alive for the lifetime of the app.
  }, [dispatch, token, user]);

  return (
    <WebSocketChatContext.Provider
      value={{ ws: wsRef.current, connected, messages }}
    >
      {children}
    </WebSocketChatContext.Provider>
  );
};

export const useOpenChat = () => {
  return useContext(WebSocketChatContext);
};
