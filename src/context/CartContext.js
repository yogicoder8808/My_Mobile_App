import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState({ open: false, message: '' });

  const fetchCart = useCallback(async (username) => {
    if (user && user.token) {
      try {
        const response = await api.get(`/api/customer/${username}/cart`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setCart(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  }, [user]);
  const addToCart = async (username, productId, quantity) => {
    try {
      const response = await api.post(`/api/customer/${username}/add`, { productId, quantity }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const newItem = response.data;
      setCart((prevCart) => [...prevCart, newItem]);

      setNotification({ open: true, message: 'Product added to cart successfully!' });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (username, itemId) => {
    try {
      await api.delete(`/api/customer/${username}/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item from cart:", error.response?.data || error.message);
    }
  };

  const updateQuantity = async (username, itemId, quantity) => {
    try {
      await api.put(`/api/customer/${username}/cart/${itemId}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCart((prevCart) => 
        prevCart.map((item) => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity in cart:", error.response?.data || error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, updateQuantity, notification, setNotification }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;




// import React, { createContext, useState, useContext, useCallback } from 'react';
// import api from '../services/api';
// import { AuthContext } from './AuthContext';

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const { user } = useContext(AuthContext);
//   const [notification, setNotification] = useState({ open: false, message: '' });


//   // Fetch Cart
//   const fetchCart = useCallback(async (username) => {
//     try {
//       const response = await api.get(`/api/customer/${username}/cart`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       setCart(response.data.cart);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     }
//   }, [user]);

//   // Add to Cart
//   const addToCart = async (username, productId, quantity) => {
//     try {
//       const response = await api.post(`/api/customer/${username}/add`, { productId, quantity }, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       // Update cart locally instead of refetching
//       const newItem = response.data;
//       setCart((prevCart) => [...prevCart, newItem]);

//       // Trigger notification for successful addition
//       setNotification({ open: true, message: 'Product added to cart successfully!' });
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     }
//   };

//   // Remove from Cart
//   const removeFromCart = async (username, itemId) => {
//     try {
//       await api.delete(`/api/customer/${username}/remove/${itemId}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
//     } catch (error) {
//       console.error("Error removing item from cart:", error.response?.data || error.message);
//     }
//   };

//   // Update Quantity
//   const updateQuantity = async (username, itemId, quantity) => {
//     try {
//       await api.put(`/api/customer/${username}/cart/${itemId}`, { quantity }, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       setCart((prevCart) => 
//         prevCart.map((item) => 
//           item.id === itemId ? { ...item, quantity } : item
//         )
//       );
//     } catch (error) {
//       console.error("Error updating quantity in cart:", error.response?.data || error.message);
//     }
//   };


//   return (
//     <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, updateQuantity, notification, setNotification}}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;
