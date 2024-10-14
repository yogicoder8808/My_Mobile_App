import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); 
        setUser({
          id: decodedToken.id, 
          username: decodedToken.sub, 
          roles: decodedToken.roles,
          token
        });
      } catch (error) {
        console.error('Token decoding error', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
    const decodedUser = jwtDecode(token);
    setUser({
      id: decodedUser.id, 
      username: decodedUser.sub, 
      roles: decodedUser.roles, 
      token
    });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



// import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Auto login if token exists
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         console.log("Decoded Token:", decodedToken); // Log the decoded token to verify its structure
//         setUser({ 
//           id: decodedToken.id, // Assuming 'id' is in the token
//           username: decodedToken.sub, 
//           roles: decodedToken.roles, 
//           token 
//         });
//       } catch (error) {
//         console.error('Token decoding error', error);
//         localStorage.removeItem('token');
//       }
//     }
//   }, []);

//   // Login function
//   const login = (token) => {
//     if (!token) {
//       throw new Error('No token provided');
//     }
//     const decodedUser = jwtDecode(token); // Decoding the token directly
//     setUser({ 
//       id: decodedUser.userId, 
//       username: decodedUser.sub, 
//       roles: decodedUser.roles, 
//       token 
//     });
//     localStorage.setItem('token', token);
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;