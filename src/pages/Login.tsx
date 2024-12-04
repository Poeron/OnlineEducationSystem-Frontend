import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiHelper";
import { useAuth } from "../hooks/useAuth";
import LoginCard from "../components/LoginCard"; // LoginCard bileşenini import ediyoruz
import { jwtDecode } from "jwt-decode";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await post("/Auth/login", data);

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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex relative">
        {/* Gradient Çerçeve */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-spin-slow blur-sm"></div>

        {/* Login Card */}
        <LoginCard
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default Login;
