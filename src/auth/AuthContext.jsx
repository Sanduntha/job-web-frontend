// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");

      // Avoid parsing invalid values
      if (!stored || stored === "undefined" || stored === "null") {
        return null;
      }

      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") return null;

      return parsed;
    } catch (err) {
      console.error("Invalid user JSON in localStorage:", err);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => {
    if (userData && typeof userData === "object") {
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
