import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface user {
  name: string;
}

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const user: user = jwtDecode(token!);
  const navigate = useNavigate();

  return (
    <nav className="relative flex items-center p-4 bg-gradient-to-r from-red-800 to-blue-900 shadow-2xl">
      {/* Sol Taraf (İkonlar) */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          size={"lg"}
          variant="ghost"
          className="text-white hover:text-gray-400 transition-all"
          aria-label="Geri Git"
        >
          <FaArrowLeft size={24} />
        </Button>
        <Button
          onClick={() => navigate(1)}
          size={"lg"}
          variant="ghost"
          className="text-white hover:text-gray-400 transition-all"
          aria-label="İleri Git"
        >
          <FaArrowRight size={24} />
        </Button>
        <Button
          onClick={() => navigate("/")}
          size={"lg"}
          variant="ghost"
          className="text-white hover:text-gray-400 transition-all"
          aria-label="Ana Sayfa"
        >
          <FaHome size={24} />
        </Button>
      </div>

      {/* Ortadaki Metin */}
      <h1 className="text-3xl font-bold mx-auto pr-20">
        Hoşgeldin,{" "}
        <span className="font-extrabold text-yellow-500">
          {user ? user.name : "Kullanıcı"}
        </span>
        !
      </h1>

      {/* Sağ Taraf (Çıkış Yap İkonu) */}
      <div className="flex items-center gap-4">
        <Button
          size={"lg"}
          onClick={logout}
          variant="ghost"
          className="text-white hover:text-red-500 transition-all"
          aria-label="Çıkış Yap"
        >
          <FaSignOutAlt />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
