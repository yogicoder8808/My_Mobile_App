import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, CircularProgress, Snackbar, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

const UserList = () => {
  const { users, deleteUser, fetchUsers } = useContext(AdminContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true); 
      await fetchUsers();
      setLoading(false); 
    };
    loadUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      await deleteUser(userId);
      setSnackbarMessage('User deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const userList = Array.from(users.values());

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>User List</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5', '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Roles</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : userList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              userList.map((user) => (
                <TableRow 
                  key={user.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell sx={{ padding: 2 }}>{user.id}</TableCell>
                  <TableCell sx={{ padding: 2 }}>{user.username}</TableCell>
                  <TableCell sx={{ padding: 2 }}>{user.roles.join(', ')}</TableCell>
                  <TableCell sx={{ padding: 2 }}>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      variant="contained"
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
          onClick={() => navigate(-1)}
          variant="outlined"
          color="secondary"
          sx={{ mr: 25 }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default UserList;
