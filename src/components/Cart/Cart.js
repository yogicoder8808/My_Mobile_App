
import React, { useContext, useEffect, useState } from 'react';
import {Container,Typography,Button,TextField,Snackbar,Alert,Grid,Card,CardContent,CardMedia,CircularProgress, Box} from '@mui/material';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateQuantity, notification, setNotification } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const fetchUserCart = async () => {
      if (user && user.username) {
        try {
          setLoading(true);
          await fetchCart(user.username);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false); 
        }
      }
    };
    fetchUserCart();
  }, [user, fetchCart]);

  useEffect(() => {
    if (Array.isArray(cart)) {
      const initialQuantities = cart.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleRemoveFromCart = async (itemId) => {
    if (user) {
      try {
        await removeFromCart(user.username, itemId);
        await fetchCart(user.username); 
        setNotification({ open: true, message: 'Product removed from cart.' });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (user && newQuantity >= 0) {
      setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
      try {
        await updateQuantity(user.username, itemId, newQuantity);
        setNotification({ open: true, message: 'Quantity updated successfully!' });
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  const calculateTotalAmount = (item) => {
    return item.product ? (item.quantity * item.product.price).toFixed(2) : '0.00';
  };

  const calculateGrandTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, totalPrice: calculateGrandTotal() } });
  };
  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Your Cart
      </Typography>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {Array.isArray(cart) && cart.length === 0 ? (
            <Typography align="center">No items in your cart.</Typography>
          ) : Array.isArray(cart) ? (
            cart.map((item) => (
              <Card key={item.id} variant="outlined" style={{ marginBottom: '20px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    {item.product?.imageUrl ? (
                      <CardMedia
                        component="img"
                        alt={item.product.name || 'Unnamed Product'}
                        height="140"
                        image={item.product.imageUrl}
                        title={item.product.name || 'Unnamed Product'}
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ height: '140px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography>No Image</Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '140px' }}>
                      <div>
                        <Typography variant="h6" gutterBottom>
                          {item.product?.name || 'Unnamed Product'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Price: ${item.product?.price?.toFixed(2) || '0.00'}
                        </Typography>
                        <TextField
                          type="number"
                          value={quantities[item.id] || 0}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          label="Quantity"
                          variant="outlined"
                          size="small"
                          style={{ width: '100px', marginTop: '10px' }}
                        />
                        <Typography variant="body1" style={{ marginTop: '10px' }}>
                          Total: ${calculateTotalAmount(item)}
                        </Typography>
                      </div>
                      <Button variant="contained" color="error" onClick={() => handleRemoveFromCart(item.id)} style={{ alignSelf: 'flex-end', top:'-65%' }}>
                        Remove from Cart
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))
          ) : (
            <Typography align="center">There was an error loading your cart.</Typography>
          )}
          <Typography variant="h6" align="right" style={{ marginTop: '20px' }}>
            Grand Total: ${calculateGrandTotal()}
          </Typography>
          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleCheckout} style={{ marginRight: '10px' }}>
              Proceed to Checkout
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleBack} >
              Back
            </Button>
          </Box>
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success">
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default Cart;



