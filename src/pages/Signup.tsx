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
import { post } from "@/services/ApiHelper";

interface SignupFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
  role?: string; // Role opsiyonel olarak tanımlandı
}

const Signup: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<SignupFormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (!data.role) {
        data.role = "student";
      }

      await post("/Auth/register", data);
      alert("Signup successful. Please login to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", (error as Error)?.message || error);
      alert("Signup failed. Please try again.");
    } finally {
      reset();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-gray-600">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
            </div>
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
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
