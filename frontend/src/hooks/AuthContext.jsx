import React, { createContext, useEffect, useState } from "react";
import * as authService from "@/lib/api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.getToken()) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then(setUser)
      .catch(() => authService.logout())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      authService.logout();
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const fresh = await authService.getMe();
    setUser(fresh);
    return fresh;
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
