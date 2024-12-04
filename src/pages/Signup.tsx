import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SignupCard from "../components/SignupCard"; // Import edilen Card

interface SignupFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
  role?: string; // Role opsiyonel olarak tanımlandı
}

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (!data.role) {
        data.role = "student"; // Varsayılan olarak Student atanıyor
      }

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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex relative">
        {/* Gradient Çerçeve */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-spin-slow blur-sm"></div>

        {/* Signup Card */}
        <SignupCard
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default Signup;
