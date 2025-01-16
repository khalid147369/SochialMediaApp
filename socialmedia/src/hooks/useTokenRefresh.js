import { useEffect, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import cookie from 'universal-cookie';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const cookies = new cookie();

const useTokenRefresh = () => {
  const { setUser ,user } = useContext(UserContext); // Use UserContext
  const navigate = useNavigate();
  useEffect(() => {
    const refreshAuthToken = async () => {
    try { 
   

      const refreshToken = cookies.get('refreshToken');
      console.log(refreshToken);
      await axios.post(`${backendUrl}/api/refreshToken`, { refreshToken }, { headers: { Authorization: `Bearer ${cookies.get('token')}` } })
        .then((response) => {
          console.log(response.data);
          setUser(response.data.user); // Update user
          cookies.set('token', response.data.token, { path: '/' });
          setUser(response.data.user); // Update user context
        });
    } catch (error) {
      console.error('Token refresh failed:', error.response.status);
      if (error.response.status === 401) {
        // Handle token refresh failure here
        cookies.remove('token', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });
        setUser(null); // Update user context
        navigate('/login');
        // refreshAuthToken();
      }
    }
  };

 refreshAuthToken();
  const interval = setInterval(() => {
      console.log("refreshing");
      refreshAuthToken();
    }, 15 * 60 * 1000); // Refresh token every 15 minutes
    return () => clearInterval(interval);

  
}, []);

return { useTokenRefresh };

};

export default useTokenRefresh;
