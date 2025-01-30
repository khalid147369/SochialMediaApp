import React from 'react'
import { Outlet ,Navigate ,useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'


function Protected() {
  const cookie = new Cookies()
  const token = cookie.get('token')



  return (
    token?<Outlet/>:<Navigate to={'/login'}/> 
  )
}

export default Protected