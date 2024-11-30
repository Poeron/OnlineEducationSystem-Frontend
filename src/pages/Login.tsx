import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { post } from "../services/ApiHelper";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // API'ye istek yap
      const response = await post("/Auth/login", data);

      // Eğer token varsa (başarılı login)
      if (response.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem("token", response.token);

        // Kullanıcının rolüne göre yönlendirme yap
        switch (response.role) {
          case "student":
            navigate("/student/home");
            break;
          case "teacher":
            navigate("/teacher/home");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600">Please sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
