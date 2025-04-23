import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { api } from "@/utils/api";
import {  useSession, signIn } from "next-auth/react";
import AuthWrapper from "@/wrapper/AuthWrapper";
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

  const [error, setError] = useState<string | null>(null);
  
  const { data: session } = useSession();
  React.useEffect(() => {
    if (session) {
      window.location.href = "/projects";
    }
  }, []);

  const signup = api.user.signup.useMutation();
  const onSubmit = async (data: FormData) => {
    try {
      const res = await signup.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res) {
        const loginRes = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (loginRes?.error) {
          setError(loginRes.error ?? "Unknown Error");
        } else {
          window.location.href = "/projects";
          localStorage.setItem("isAuthorized", "true");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <AuthWrapper isPublicPage={true}>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="mb-4 text-center text-xl font-bold">Sign Up</h2>

          <input
            type="text"
            placeholder="Name"
            className="mb-2 w-full rounded border p-2"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mb-2 text-sm text-red-500">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="mb-2 w-full rounded border p-2"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mb-2 text-sm text-red-500">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="mb-2 w-full rounded border p-2"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mb-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded bg-green-600 py-2 text-white transition hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <p className="mb-2 text-center text-sm text-red-500">{error}</p>
        )}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-600 hover:underline">Login here</span>
          </Link>
        </p>
      </div>
    </div>
    </AuthWrapper>
  );
};

export default Signup;
