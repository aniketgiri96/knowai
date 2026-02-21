"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[2.5rem]";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const btnPrimary =
  "min-h-[2.5rem] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const btnSecondary =
  "min-h-[2.5rem] cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDone("");
    const url = isRegister ? `${API}/auth/register` : `${API}/auth/login`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || res.statusText);
        return;
      }
      if (isRegister) {
        setDone("Registered. You can log in now.");
      } else {
        localStorage.setItem("knowai_token", data.access_token);
        setDone("Logged in.");
        setTimeout(() => router.push("/upload"), 500);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {isRegister ? "Register" : "Login"}
      </h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>
          <button type="submit" className={btnPrimary}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setDone("");
            }}
            className={btnSecondary}
          >
            {isRegister ? "Already have an account? Log in" : "Need an account? Register"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}
      {done && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
          {done}
        </div>
      )}
    </div>
  );
}
