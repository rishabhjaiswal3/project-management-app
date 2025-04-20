import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [error,setError] =  useState<string | null>(null);

  const signup = api.user.signup.useMutation();
  const onSubmit = async (data: FormData) => {
    try {
      const res = await signup.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res) {
        localStorage.setItem("isAuthorized", "true");
        // window.location.href = "/project";
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded mb-2"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
