// src/components/Checkout/Checkout.js
import React, { useContext, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../../context/CartContext'; 
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
  const { cart, removeFromCart } = useContext(CartContext); 
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setNotification({ open: true, message: 'Stripe is not loaded', severity: 'error' });
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setNotification({ open: true, message: error.message, severity: 'error' });
      setLoading(false);
      return;
    }

    console.log('Payment Method:', paymentMethod);
    console.log('Shipping Info:', shippingInfo);

    setNotification({ open: true, message: 'Payment successful! Order confirmed.', severity: 'success' });
    
    try {

      const username = user.username; 
      for (const item of cart) {
      await removeFromCart(username, item.id); 
    }
  } catch (error) {
    console.error("Error clearing the cart:", error);
}

setLoading(false);

setTimeout(() => {
  navigate('/');
}, 3000);
};

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          name="name"
          label="Full Name"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={shippingInfo.name}
          onChange={handleChange}
        />
        <TextField
          name="address"
          label="Shipping Address"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={shippingInfo.address}
          onChange={handleChange}
        />
        
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <CardElement style={{ margin: '20px 0' }} />
        
        <Typography variant="h6" gutterBottom>
          Total Amount: ${calculateTotalAmount()}
        </Typography>
        
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
