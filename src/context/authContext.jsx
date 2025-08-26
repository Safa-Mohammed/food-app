// // AuthContext.js
// import { createContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [loginData, setLoginData] = useState(null);

//   const login = (token) => {
//     try {
//       const decoded = jwtDecode(token); // decode JWT
//       setLoginData({
//         userId: decoded.userId,
//         userName: decoded.userName,  
//         roles: decoded.roles,
//       });
//       localStorage.setItem("token", token);  
//     } catch (error) {
//       console.error("Invalid token:", error);
//     }
//   };

//   const logout = () => {
//     setLoginData(null);
//     localStorage.removeItem("token");
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setLoginData({
//           userId: decoded.userId,
//           userName: decoded.userName,
//           roles: decoded.roles,
//         });
//       } catch (error) {
//         console.error("Invalid token:", error);
//       }
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ loginData, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [loginData, setLoginData] = useState(null);

  // Save login data after decoding token
  const saveLoginData = () => {
    const encodedToken = localStorage.getItem("userToken"); 
    if (encodedToken) {
      try {
        const decodedToken = jwtDecode(encodedToken);
        setLoginData(decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
        logout(); 
      }
    }
  };

  // Logout function: clear token and reset state
  const logout = () => {
    localStorage.removeItem("userToken");
    setLoginData(null);
  };

  // Auto-load login data if token exists
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveLoginData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loginData, saveLoginData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
