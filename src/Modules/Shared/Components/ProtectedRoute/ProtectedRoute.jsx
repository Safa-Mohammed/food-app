// import React, { useContext } from 'react'
// import { AuthContext } from '../../../../context/authContext'
// import { Navigate } from 'react-router-dom'

// export default function ProtectedRoute(props) {
//   let {userData}  = useContext(AuthContext)
//   if(localStorage.getItem('userToken')|| userData){
//     return props.children
//   } else {
//     return <Navigate to="/login" />;
//   }
// }


// Modules/Shared/Components/ProtectedRoute/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// props: loginData (object or null), children (JSX to protect)
export default function ProtectedRoute({ loginData, children }) {
  const token = localStorage.getItem("userToken");

  if (token || loginData) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
