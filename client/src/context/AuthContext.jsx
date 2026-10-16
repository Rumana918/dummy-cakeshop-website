import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sw_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.me();
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('sw_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('sw_token', res.data.token);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 🍰`);
      return res.data.user;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register(data);
      localStorage.setItem('sw_token', res.data.token);
      setUser(res.data.user);
      toast.success(`Welcome to Sweet Whisk, ${res.data.user.name}! 🧁`);
      return res.data.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('sw_token');
      setUser(null);
      toast.success('Logged out safely. See you soon!');
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
