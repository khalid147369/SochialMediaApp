import axios from 'axios';
import { useState,useContext } from 'react';
import { backendUrl } from '../config';
import { PostsContext } from "../context/PostsContext";
import useTokenRefresh from './useTokenRefresh';

const useSendComment = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);



  const sendComment = async (token, title, content,avatar,postId) => {
    try {
      console.log(title, content, avatar, postId);
      const response = await axios.post(`${backendUrl}/api/comments`, {
        title: title,
        content: content,
        avatar: avatar,
        postId: postId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      setData(response.data);
      console.log(response.data);
     return {data : response.data};
    } catch (error) {
      console.error('Error sending post:', error);
      setError(error); // Set the error state
    }
    
  };

  return { data, error, sendComment };
};

export default useSendComment ;