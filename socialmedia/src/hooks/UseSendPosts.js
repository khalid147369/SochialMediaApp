import axios from 'axios';
import { useState,useContext } from 'react';
import { backendUrl } from '../config';
import { PostsContext } from "../context/PostsContext";
import useTokenRefresh from './useTokenRefresh';

const useSendPosts = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { posts, setPosts } = useContext(PostsContext);

  const tokenRefresh = useTokenRefresh();

  const sendPost = async (token, description, image) => {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('imagePost', image);

      const response = await axios.post(`${backendUrl}/api/Posts`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setData(response);
      const newPosts = [...posts, response.data];
      setPosts(newPosts);
      console.log(newPosts);

    } catch (error) {
      console.error('Error sending post:', error);
        
      if (error.response.status === 401) {
        tokenRefresh();
      }
    }
  };

  return { data, error, sendPost };
};

export { useSendPosts };
