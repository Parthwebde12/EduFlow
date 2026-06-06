import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('Eduflow_token'));

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('Eduflow_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();  //eslint error not react error app works in prod
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('Eduflow_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const register = async (name, email, password, college) => {
    const res = await api.post('/auth/register', { name, email, password, college });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('Eduflow_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('Eduflow_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {  //same here too
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
