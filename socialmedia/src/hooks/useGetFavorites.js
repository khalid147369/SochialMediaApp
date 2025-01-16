import { useState, useEffect,useContext } from "react";
import { backendUrl } from "../config";
import Cookies from "universal-cookie"; // Import Cookies from universal-cookie
import { FavoritesContext } from "../context/FavoritesContext";

function useGetFavorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setFavorites } = useContext(FavoritesContext);

  const getFavorites = async () => {
    async function fetchFavorites() {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token"); // Retrieve token from cookies
        const response = await fetch(`${backendUrl}/api/SavedPosts`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFavorites(data);
        console.log(data);
        setPosts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  };
  useEffect(() => {
    getFavorites();
  }, []);

  return { posts, loading, error, getFavorites };
}

export default useGetFavorites;
