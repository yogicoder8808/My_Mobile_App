
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Dashboard
      </Typography>
      <Button variant="contained" component={Link} to="/products">
        View Products
      </Button>
      <Button variant="contained" component={Link} to="/cart">
        View Cart
      </Button>
    </Container>
  );
};

export default CustomerDashboard;
