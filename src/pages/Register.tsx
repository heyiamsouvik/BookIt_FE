import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

interface ApiErrorResponse {
  message?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

    try {
      const response = await axios.post(
        `${baseURL}/user/register`,
        { name, email, password }
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Registration failed";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-00">Sign Up</h1>
        <h3 className="text-lg font-semibold text-zinc-900 mt-2">
          Register with highway delite
        </h3>
      </div>

      <div className="w-full max-w-md">
        <form
          onSubmit={register}
          className="flex flex-col gap-4 bg-white p-6 rounded shadow-md"
        >
          <input
            type="text"
            required
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-2xl px-4 py-2 border-zinc-400 outline-none w-full"
          />

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-2xl px-4 py-2 border-zinc-400 outline-none w-full"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-2xl px-4 py-2 border-zinc-400 outline-none w-full"
          />

          <button
            type="submit"
            className="bg-yellow-400 text-white font-semibold py-2 rounded-2xl w-full hover:bg-yellow-500 duration-300 hover:scale-105"
          >
            Register
          </button>

          <p className="text-center font-semibold text-gray-900">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
