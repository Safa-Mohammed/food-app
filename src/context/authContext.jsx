// import React, { useState, useEffect, createContext } from 'react';
// import { jwtDecode } from 'jwt-decode';  

// export const AuthContext = createContext(null);

// export default function AuthContextProvider({ children }) {
//   const [userData, setUserData] = useState(null);

//   const saveUserData = () => {
//     const encodedToken = localStorage.getItem('userToken');
//     if (encodedToken) {
//       const decodedToken = jwtDecode(encodedToken);  
//       setUserData(decodedToken);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem('userToken')) {
//       saveUserData();
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userData, saveUserData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
