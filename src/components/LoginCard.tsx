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

interface LoginCardProps {
  initialValues: { email: string; password: string };
  validationSchema: any;
  onSubmit: (values: { email: string; password: string }) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  return (
    <Card className="w-[500px] relative bg-neutral-800 max-w-md text-white shadow-lg border border-black-600">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to access your dashboard</p>
      </CardHeader>

      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-6">
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

              {/* Submit Button */}
              <Button
                variant={"destructive"}
                size={"lg"}
                type="submit"
                className="w-full py-2 px-4"
                disabled={!(isValid && dirty)}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
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
