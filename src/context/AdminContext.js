import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState({ open: false, message: '' });

  const fetchProducts = useCallback(async () => {
    if (user && user.token) {
      try {
        const response = await api.get('/api/admin/products', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }, [user]);

  const fetchUsers = useCallback(async () => {
    if (user && user.token) {
      try {
        const response = await api.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }, [user]);

  const createProduct = async (productData) => {
    try {
      const response = await api.post('/api/admin/products', productData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setNotification({ open: true, message: 'Product created successfully!' });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const response = await api.put(`/api/admin/products/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? response.data : product))
      );
      setNotification({ open: true, message: 'Product updated successfully!' });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };


  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setNotification({ open: true, message: 'Product deleted successfully!' });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setNotification({ open: true, message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        users,
        fetchProducts,
        fetchUsers,
        createProduct,
        updateProduct,
        deleteProduct,
        deleteUser,
        notification,
        setNotification,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
