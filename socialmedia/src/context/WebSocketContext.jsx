import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext(null);
import {sendPostAction}from '../features/postsSlice'
import { useDispatch, useSelector } from 'react-redux';
import { backendUrlWs } from "../config";
import Cookies from "universal-cookie";
import { addPostToAuthorPosts } from "../features/userSlice";
export const WebSocketProvider = ({ children  }) => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
 const dispatch = useDispatch();
   const cookie = new Cookies();
  const { user } = useSelector((state) => state.user);
 const token = cookie.get('token');

  useEffect(() => {
    if (!token) {
        console.log("Token not available yet. WebSocket connection will not be created.");
        return;
      }
    // Only create a connection if one doesn't already exist.
    if (!wsRef.current) {
        console.log(user)
        console.log(token)
        
      wsRef.current = new WebSocket(`${backendUrlWs}/api/websocket/connect?token=${token}`);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        console.log("Received message:", event.data);
        
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
          dispatch(sendPostAction(data))
          dispatch(addPostToAuthorPosts(data))
          
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
    }

    // Do not return a cleanup function here if you want to keep the connection alive for the lifetime of the app.
  }, [dispatch,token]);

  return (
    <WebSocketContext.Provider value={{ ws: wsRef.current, connected, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};