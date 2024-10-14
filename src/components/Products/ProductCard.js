import React, { useContext, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext'; 
import { AuthContext } from '../../context/AuthContext'; 

const ProductCard = ({ product, onAddToCartNotification }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  const { addToCart } = useContext(CartContext); 
  const [quantity, setQuantity] = useState(1); 

  const handleAddToCart = async () => {
    if (user) {
      try {
        await addToCart(user.username, product.id, quantity); 
        onAddToCartNotification('Product added to cart successfully!'); 
      } catch (error) {
        console.error('Error adding product to cart:', error);
        onAddToCartNotification('Failed to add product to cart.'); 
      }
    } else {
   
      onAddToCartNotification('Please log in to add products to your cart.'); 
      console.error('User is not logged in');
    }
  };

  const handleViewProduct = () => {
    navigate(`/products/${product.id}`);
  };


  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardMedia
        component="img"
        style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
        image={product.imageUrl} 
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical',
            maxHeight: '4.5em', 
            lineHeight: '1.5em', 
            wordWrap: 'break-word', 
          }}
        >
          {product.description}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.price}
        </Typography>
      </CardContent>

      <Box sx={{ padding: 2 }}> 
        {user && !user.roles.includes('ROLE_ADMIN') && (  
          <Box display="flex" justifyContent="center" mt={2}>
            <TextField
              type="number"
              label="Quantity" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))} 
              inputProps={{ min: 1 }} 
              sx={{ width: '100px', marginRight: '10px' }} 
            />
            <Button variant="contained" color="primary" onClick={handleAddToCart} sx={{ height: '56px' }}>
              Add to Cart
            </Button>
          </Box>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={handleViewProduct}>
            View Product
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;


