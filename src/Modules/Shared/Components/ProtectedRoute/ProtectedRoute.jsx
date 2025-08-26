import  { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";

export default function ProtectedRoute({ children }) {
  const { loginData } = useContext(AuthContext); 
  const token = localStorage.getItem("userToken");

  if (token || loginData) {
    return children; // user is logged in
  } else {
    return <Navigate to="/login" />; // user is not logged in
  }
}
