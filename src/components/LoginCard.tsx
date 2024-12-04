import React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface LoginCardProps {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  register,
  errors,
}) => {
  return (
    <Card className="w-[500px] relative bg-neutral-800 max-w-md text-white shadow-lg border border-black-600">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to access your dashboard</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant={"destructive"}
            size={"lg"}
            type="submit"
            className="w-full py-2 px-4"
          >
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
