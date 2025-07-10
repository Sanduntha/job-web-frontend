// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- track loading

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error parsing stored user", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // finished loading
    }
  }, []);

// Example in AuthContext.jsx login function:
const login = (userData) => {
  setUser({
    id: userData.id,
    email: userData.email,
    role: userData.role,
  });
  setToken(userData.token);
  localStorage.setItem("user", JSON.stringify({
    id: userData.id,
    email: userData.email,
    role: userData.role,
  }));
  localStorage.setItem("token", userData.token);
};



  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
