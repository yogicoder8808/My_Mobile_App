import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CardMedia, Typography, Snackbar, Alert, Box } from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const ProductList = () => {
  const { products, fetchProducts, deleteProduct } = useContext(AdminContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      await deleteProduct(productId);
      setSnackbarMessage('Product deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Product List</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5', '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id}
                sx={{
                  '&:hover': { backgroundColor: '#f0f0f0' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell sx={{ padding: 2 }}>{product.name}</TableCell>
                <TableCell sx={{ padding: 2, maxWidth: '300px', width: '300px' }}>
                <Typography
                  variant="body2"
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
            </TableCell>
                <TableCell sx={{ padding: 2 }}>${product.price}</TableCell>
                <TableCell sx={{ padding: 2 }}>
                  {product.imageUrl ? (
                    <CardMedia
                      component="img"
                      alt={product.name}
                      height="100"
                      image={product.imageUrl}
                      title={product.name}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ height: '100px', width: '100px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span>No Image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell sx={{ padding: 2 }}>
                  <Button component={Link} to={`/admin/products/edit/${product.id}`} variant="contained">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(product.id)} color="error" variant="contained" sx={{ ml: 2 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          component={Link}
          to="/admin/products/add" 
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
        >
          Add Product
        </Button>
        <Button
          component={Link}
          to="/admin" 
          variant="outlined"
          color="secondary" 
          sx={{ mr: 48 }} 
        >
          Back
        </Button>
      </Box>
    </div>
  );
};

export default ProductList;







