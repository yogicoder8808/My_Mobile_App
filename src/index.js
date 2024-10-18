import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import App from './App'; 

const theme = createTheme();

const container = document.getElementById('root'); 
const root = createRoot(container); 

root.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <CartProvider>
        <Router>
          <App /> 
        </Router>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);




