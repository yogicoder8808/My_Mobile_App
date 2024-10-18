import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const ProductForm = () => {
  const { productId } = useParams();
  const { createProduct, updateProduct, products } = useContext(AdminContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({ 
    name: '', 
    price: '', 
    description: '',
    imageUrl: '' 
  });
  const [initialProduct, setInitialProduct] = useState(product); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (productId) {
      const productToEdit = products.find((p) => p.id === Number(productId));
      if (productToEdit) {
        setProduct(productToEdit);
        setInitialProduct(productToEdit); 
      }
    }
  }, [productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (JSON.stringify(initialProduct) === JSON.stringify(product)) {
        setSnackbarMessage('No changes made');
        setSnackbarSeverity('error');
        setSnackbarOpen(true); 
      } else if (productId) {
        await updateProduct(productId, product);
        setSnackbarMessage('Product updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
      } else {
        await createProduct(product);
        setSnackbarMessage('Product added successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate('/admin/products');
  };

  return (
    <Container>
      <Typography variant="h5">{productId ? 'Edit Product' : 'Add New Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Price"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Image URL"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate('/admin/products')} sx={{ mt: 2, ml: 2 }}>
          Back
        </Button>
      </form>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductForm;










