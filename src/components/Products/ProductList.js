
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Snackbar, Alert } from '@mui/material';
import api from '../../services/api';
import ProductCard from './ProductCard';

const ProductList = ({ searchQuery = '' }) => { 
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCartNotification = (message) => {
    setNotification({ open: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard 
                product={product} 
                onAddToCartNotification={handleAddToCartNotification} 
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" gutterBottom>No products found.</Typography>
        )}
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '300px' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductList;
