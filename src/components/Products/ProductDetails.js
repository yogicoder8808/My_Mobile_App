
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, Snackbar, Alert, Box } from '@mui/material';
import api from '../../services/api'; 
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext'; 

const ProductDetails = () => {
  const { productId } = useParams(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext); 
  const { user } = useContext(AuthContext); 
  const [notification, setNotification] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (product && user) { 
      try {
        await addToCart(user.username, product.id, 1);
        setNotification({ open: true, message: 'Product added to cart successfully!' });
      } catch (error) {
        console.error('Error adding product to cart:', error);
        setNotification({ open: true, message: 'Failed to add product to cart.' });
      }
    } else {
      setNotification({ open: true, message: 'Please log in to add products to your cart.' });
      console.error('User is not logged in or product is undefined');
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
        <CardMedia
          component="img"
          sx={{ height: 400, objectFit: 'contain' }} 
          image={product.imageUrl} 
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 5, 
            WebkitBoxOrient: 'vertical',
            maxHeight: '7.5em',
            lineHeight: '1.5em', 
            wordWrap: 'break-word', 
          }}
        >
        {product.description}
          </Typography>
          <Typography variant="h6" color="primary">
            Price: ${product.price}
          </Typography>
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            {user && !user.roles.includes('ROLE_ADMIN') && (
              <Button variant="contained" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success">
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;

