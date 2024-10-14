import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Dashboard
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 2 }} 
      >
        <Button 
          variant="contained" 
          component={Link} 
          to="/admin/users" 
          sx={{ width: '250px' }} 
        >
          Manage Users
        </Button>
        <Button 
          variant="contained" 
          component={Link} 
          to="/admin/products" 
          sx={{ width: '250px' }} 
        >
          Manage Products
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;


