import React, { useState } from 'react';
import { Container, Typography, TextField } from '@mui/material';
import ProductList from './Products/ProductList';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom align="center">
        Welcome to Our Shop!
      </Typography>
      
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        onChange={handleSearchChange}
        value={searchQuery}
        sx={{ marginBottom: '20px', bgcolor: 'white' }} 
      />
      
      <ProductList searchQuery={searchQuery} />
    </Container>
  );
};

export default Home;

