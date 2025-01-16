import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import Cookies from 'universal-cookie';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/SavedPosts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, error ,setFavorites}}>
      {children}
    </FavoritesContext.Provider>
  );
};
