import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate ,useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { refreshUserAndToken , setRefreshFaild } from '../features/userSlice';
import { jwtDecode } from 'jwt-decode';
// import your action to fetch user data if available
// import { fetchUser } from '../path/to/your/actions';

function Protected() {
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()
  // Adjust this selector if your state structure is different
  const { user ,refreshFaild } = useSelector((state) => state.user);
  const token =cookie.get('token')

  useEffect(() => {
    if (token && (!user || user.length === 0)) {
     
        dispatch(refreshUserAndToken());
    }
  }, [token, user, dispatch]);


useEffect(()=>{
if (location.pathname ==="/login") {
  dispatch(setRefreshFaild())
}
},[dispatch , location])

useEffect(()=>{
     if ( refreshFaild ) {
      navigate("/login")
  }
},[navigate , refreshFaild])
  
useEffect(() => {
  const isTokenExpired = () => {
    const token = cookie.get('token'); // Get token from cookies
    if (!token) return true; // No token means it's expired or not logged in

    try {
      const decoded = jwtDecode(token); // Decode JWT
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

      return decoded.exp < currentTime; // True if token is expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If there's an error, assume token is invalid
    }
  };

  if (isTokenExpired()) {
    cookie.remove('token');
  }
}, [cookie]);
  // Otherwise, render the protected content
  if (token){
  return <Outlet />;

  }else{
   return <Navigate to={"/login"} replace/>  
   
  }

}

export default Protected;