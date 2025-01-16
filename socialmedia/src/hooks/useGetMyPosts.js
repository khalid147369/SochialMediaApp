import { useState, useEffect } from 'react';
import { backendUrl } from '../config';
import Cookies from 'universal-cookie'; // Import Cookies from universal-cookie

function useGetMyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const cookies = new Cookies();
        const token = cookies.get('token'); // Retrieve token from cookies
        const response = await fetch(`${backendUrl}/api/Posts/userPosts`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to request headers
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyPosts();
  }, []);

  return { posts, loading, error };
}

export default useGetMyPosts;
