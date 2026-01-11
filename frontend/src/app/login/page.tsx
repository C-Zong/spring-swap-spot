"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/login",
        { username, password }
      );

      setCode(res.data.code);
      if (res.data.code === 0) {
        setMessage("Login successful");
        router.push("/");
        router.refresh();
      } else {
        setMessage(res.data.message);
      }
    } catch (err: any) {
      setMessage("Network error, please try again later");
    }
  };

  return (
    <div className="flex items-center justify-center h-[88vh]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
          {message && (
            <p className={`text-center ${code === 0 ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
          <p className="text-center mt-4 text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}