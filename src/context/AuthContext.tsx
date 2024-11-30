import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  user: { name: string; role: string } | null;
  login: (name: string, role: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      setToken(storedToken);
      setUser({ name: decodedToken.name, role: decodedToken.role });
    }
  }, []);

  const login = (name: string, role: string, token: string) => {
    setToken(token);
    setUser({ name, role });
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
