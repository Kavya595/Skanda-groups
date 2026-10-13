import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminGetMe, adminLogout as apiLogout, adminLogin as apiLogin } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('skandha_admin_token');
      if (token) {
        try {
          const res = await adminGetMe();
          if (res.success && res.user) {
            setAdminUser(res.user);
          } else {
            localStorage.removeItem('skandha_admin_token');
          }
        } catch (err) {
          localStorage.removeItem('skandha_admin_token');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (identifier, password) => {
    const res = await apiLogin(identifier, password);
    if (res.success && res.user) {
      setAdminUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await apiLogout();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, setAdminUser, login, logout, loading, isAuthenticated: !!adminUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
