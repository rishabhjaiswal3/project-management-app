import React from "react";
import { signIn, useSession } from "next-auth/react";
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

  const {data: session} =  useSession();
  React.useEffect(() => {
    if (session) {
      window.location.href = "/projects";
    }
  }, [session]);

  const onSubmit = async (data: FormData) => {
    try {
      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (loginRes?.error) {
        setError("email", { message: loginRes.error });
      } else {
        window.location.href = "/projects";
        localStorage.setItem("isAuthorized", "true");
      }
    } catch (e) {
      console.error("Error during login:", e);
      setError("email", { message: "Something went wrong!" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-xl font-bold">Login</h2>

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
          })}
        />
        {errors.password && (
          <p className="mb-2 text-sm text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-sm">
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
