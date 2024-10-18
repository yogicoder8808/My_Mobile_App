import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MyShop
        </Typography>
        {user && (
          <Typography 
            variant="body1" 
            sx={{ 
              marginLeft: '25px', 
              fontSize: { xs: '0.8rem', sm: '1rem' } 
            }}
          >
            Welcome, {user.username}
          </Typography>
        )}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {user ? (
          <>
            {user.roles.includes('ROLE_ADMIN') ? (
              <>
                <Button color="inherit" component={Link} to="/admin">
                  Admin Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/cart">
                  Cart
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
