/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface SignupCardProps {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
}

const SignupCard: React.FC<SignupCardProps> = ({
  onSubmit,
  register,
  errors,
}) => {
  return (
    <Card className="w-[500px] relative bg-neutral-800 max-w-md text-white shadow-lg">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Sign up to get started</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role Selection (Radio Buttons) */}
          <div>
            <Label htmlFor="role">Select Your Role</Label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  value="student"
                  {...register("role")}
                  className="mr-2 accent-blue-500"
                  defaultChecked
                />
                Student
              </label>
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  value="instructor"
                  {...register("role")}
                  className="mr-2 accent-blue-500"
                />
                Instructor
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant={"destructive"}
            size={"lg"}
            type="submit"
            className="w-full py-2 px-4"
          >
            Sign Up
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupCard;
