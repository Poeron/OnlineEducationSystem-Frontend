import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import React from "react";

interface SignupCardProps {
  initialValues: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
  validationSchema: any;
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => void;
}

const SignupCard: React.FC<SignupCardProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  return (
    <Card className="w-[500px] relative bg-neutral-800 max-w-md text-white shadow-lg">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Sign up to get started</p>
      </CardHeader>

      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded"
                  as={Input}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border rounded"
                  as={Input}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded"
                  as={Input}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Role Selection (Radio Buttons) */}
              <div>
                <Label htmlFor="role">Select Your Role</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center text-gray-400">
                    <Field
                      type="radio"
                      name="role"
                      value="student"
                      className="mr-2 accent-blue-500"
                    />
                    Student
                  </label>
                  <label className="flex items-center text-gray-400">
                    <Field
                      type="radio"
                      name="role"
                      value="instructor"
                      className="mr-2 accent-blue-500"
                    />
                    Instructor
                  </label>
                </div>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <Button
                variant={"destructive"}
                size={"lg"}
                type="submit"
                className="w-full py-2 px-4"
                disabled={!(isValid && dirty)}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
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
