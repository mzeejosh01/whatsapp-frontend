import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/me");
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Error loading user:", error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (name, email, password, whatsappNumber) => {
    const res = await axios.post("/auth/register", {
      name,
      email,
      password,
      whatsappNumber,
    });

    setToken(res.data.token);
    return res.data;
  };

  // Login user
  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", {
      email,
      password,
    });

    setToken(res.data.token);
    return res.data;
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    const res = await axios.put("/api/auth/me", userData);
    setCurrentUser(res.data);
    return res.data;
  };

  // Upgrade to premium
  const upgradeToPremium = async () => {
    const res = await axios.post("/api/auth/upgrade-premium");
    setCurrentUser(res.data);
    return res.data;
  };

  const value = {
    currentUser,
    isAuthenticated: !!token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    upgradeToPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
