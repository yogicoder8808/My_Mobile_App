// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext'; // Assuming you have CartProvider too

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <App />
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   </React.StrictMode>
// );

import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import App from './App'; // Import App component

const theme = createTheme();

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root using createRoot

root.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <CartProvider>
        <Router>
          <App /> {/* Render App component, which contains all routes */}
        </Router>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);




