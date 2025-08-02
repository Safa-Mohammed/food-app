import React, { useContext } from 'react'
import { AuthContext } from '../../../../context/authContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute(props) {
  let {userData}  = useContext(AuthContext)
  if(localStorage.getItem('userToken')|| userData){
    return props.children
  } else {
    return <Navigate to="/login" />;
  }
}
