import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  name: string;
}

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const user: DecodedToken | null = token
    ? jwtDecode<DecodedToken>(token)
    : null;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1>Hoşgeldin {user ? user.name : "Kullanıcı"}!</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="px-4 py-2 bg-gray-700 rounded">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button onClick={logout} className="px-4 py-2 bg-red-600 rounded">
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
