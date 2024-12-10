import * as Yup from "yup";

import React from "react";
import SignupCard from "../components/SignupCard";
import { post } from "../services/ApiHelper";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "student",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .max(50, "Email must be at most 50 characters")
      .required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(50, "Password must be at most 50 characters")
      .required("Password is required"),
    role: Yup.string().oneOf(["student", "instructor"], "Invalid role"),
  });

  const handleSignup = async (values: typeof initialValues) => {
    try {
      await post("/Auth/register", values);
      alert("Signup successful. Please login to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", (error as Error)?.message || error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex relative">
        {/* Gradient Çerçeve */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-spin-slow blur-sm"></div>

        {/* Signup Card */}
        <SignupCard
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        />
      </div>
    </div>
  );
};

export default Signup;
