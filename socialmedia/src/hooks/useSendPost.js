import { useState, useEffect } from 'react';
import {  w3cwebsocket as W3CWebSocket } from 'websocket';
import Cookies from 'universal-cookie';
import { backendUrlWs } from '../config';

const useSendPost = () => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const cookie = new Cookies();
  const token = cookie.get('token');

  useEffect(() => {
    const client = new W3CWebSocket(`${backendUrlWs}/api/websocket/connect?token=${token}`);

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      setConnected(true);
      setWs(client);
    };

    client.onclose = () => {
      console.log('WebSocket Client Disconnected');
      setConnected(false);
    };

    // Clean up the WebSocket connection on unmount
    return () => {
      client.close();
    };
  }, [token]);

  const sendPost = (post) => {
    if (ws && connected) {
        console.log(post)
      ws.send(JSON.stringify(post));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return { sendPost, connected, convertImageToBase64 };
};

export default useSendPost;
