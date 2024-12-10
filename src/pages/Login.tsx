import * as Yup from "yup";

import React, { useEffect } from "react";

import LoginCard from "../components/LoginCard"; // LoginCard bileşenini import ediyoruz
import { jwtDecode } from "jwt-decode";
import { post } from "../services/ApiHelper";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      switch (decodedToken.role) {
        case "student":
          navigate("/student/home");
          break;
        case "instructor":
          navigate("/instructor/home");
          break;
        case "admin":
          navigate("/admin/home");
          break;
        default:
          navigate("/login");
          break;
      }
    }
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçersiz email adresi")
      .max(50, "Email en fazla 50 karakter olmalı")
      .required("Email gerekli"),
    password: Yup.string()
      .min(4, "Minimum 4 karakter olmalı")
      .max(50, "Şifre en fazla 50 karakter olmalı")
      .required("Şifre gerekli"),
  });

  const handleLogin = async (values: typeof initialValues) => {
    try {
      const response = await post("/Auth/login", values);

      if (response.token) {
        login(response.token);
        switch (response.role) {
          case "student":
            navigate("/student/home");
            break;
          case "instructor":
            navigate("/instructor/home");
            break;
          case "admin":
            navigate("/admin/home");
            break;
          default:
            navigate("/login");
            break;
        }
      } else {
        alert("Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex relative">
        {/* Gradient Çerçeve */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-spin-slow blur-sm"></div>

        {/* Login Card */}
        <LoginCard
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
};

export default Login;
