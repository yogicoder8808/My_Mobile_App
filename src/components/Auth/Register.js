import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import api from '../../services/api';

const Register = () => {
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await api.post('/auth/register', userData);
        setNotification({ open: true, message: 'User registered successfully!', severity: 'success' }); 
        setTimeout(() => {
            navigate('/login');
        }, 2000); 
    } catch (error) {
        console.error('Registration error', error);

        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message; 
            if (errorMessage === 'Username is already taken!') {
                setNotification({ open: true, message: errorMessage, severity: 'error' }); 
            } else {
                setNotification({ open: true, message: 'Registration failed. Please try again.', severity: 'error' });
            }
        } else {
            setNotification({ open: true, message: 'Registration failed. Please try again.', severity: 'error' });
        }
    }
};

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button 
                onClick={() => navigate('/login')} 
                variant="contained" 
                color="secondary" 
                fullWidth
              >
                Back to Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '300px' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;


