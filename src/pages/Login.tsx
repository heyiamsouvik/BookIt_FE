import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

interface ApiErrorResponse {
  message?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
    console.log(`${baseURL}/user/login`);

    try {
      const response = await axios.post(
        `${baseURL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      localStorage.setItem("userLoggedIn", "yes");
      navigate("/");
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;

      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response?.data
          : err.response?.data?.message || "Something went wrong";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-4xl font-bold text-black-800">Welcome Back!</h1>
        <h3 className="text-sm font-semibold text-zinc-900 mt-2">
          Login with highway delite
        </h3>
      </div>

      <div className="w-full max-w-md">
        <form
          onSubmit={login}
          className="flex flex-col gap-4 bg-white p-6 rounded shadow-md"
        >
          <input
            type="email"
            required
            placeholder="email"
            className="border rounded-2xl px-4 py-1 border-zinc-400 outline-none w-full"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="password"
            className="border rounded-2xl px-4 py-1 border-zinc-400 outline-none w-full"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-yellow-400 text-white font-semibold py-2 rounded-2xl w-full 
            hover:bg-yellow-500 duration-300 hover:scale-105"
          >
            Login
          </button>

          <p className="text-center font-semibold text-gray-900">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
