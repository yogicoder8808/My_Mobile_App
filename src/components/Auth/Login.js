import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';
import api from '../../services/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', credentials);
      const token = response.data; 
      if (token) {
        login(token);
        navigate('/');
      } else {
        setError('Login failed, no token received.');
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        if (error.response.status === 403) {
          setError('Invalid credentials, please try again.');
        } else if (error.response.status === 404) {
          setError('User not found. Redirecting to registration.');
          setTimeout(() => {
            navigate('/register');
          }, 2000);
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        console.error('Login error', error);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleOAuth2Login = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/facebook'; 
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={() => navigate('/register')} variant="contained" color="secondary" fullWidth>
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleOAuth2Login} variant="contained" color="success" fullWidth>
                Login with Facebook
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
