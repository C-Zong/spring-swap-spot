"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const rules = [
    {
      name: "Lowercase letters",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      name: "Uppercase letters",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      name: "Numbers",
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      name: "Special characters",
      test: (pwd: string) => /[\W_]/.test(pwd),
    },
    {
      name: "At least 8 characters",
      test: (pwd: string) => pwd.length >= 8,
    },
  ];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 20) {
      setMessage("Username must be 3–20 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const allPass = rules.every((rule) => rule.test(password));
    if (!allPass) {
      setMessage("Password does not meet all requirements");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`,
        { username, password }
      );
      setMessage(res.data.message || "Signup successful");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-lg p-3
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Username must be 3–20 characters
            </p>
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="text-sm text-gray-500 mt-1">
              <p className="font-md font-bold mb-1">
                Password must include:
              </p>
              <ul className="space-y-1">
                {rules.map((rule, idx) => {
                  const passed = rule.test(password);
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      <span className={`font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
                        {passed ? "✓" : "✗"}
                      </span>
                      <span className={passed ? "text-green-700" : "text-gray-500"}>
                        {rule.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>

          {message && (
            <p className={`text-center ${message.includes("Success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
