"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const login = api.user.login.useMutation();
  const onSubmit = async (data: FormData) => {
    try {
      const res = await login.mutateAsync({
        email: data.email,
        password: data.password,
      });
      console.log("my response is ",res);
      if (res) {
        // localStorage.setItem("isAuthorized", "true");
        // console.log("my location is ",res);
        // window.location.href = "/project";
      }
    } catch(e) {
      console.error("Error during login:", e);
      setError("email", { message: "Something went wrong!" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

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
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
