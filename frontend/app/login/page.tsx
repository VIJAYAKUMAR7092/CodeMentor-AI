"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      router.push("/chat");
    }
  }, [router]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        router.push("/chat");
      } else {
        alert(data.detail || "Invalid Username or Password");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 w-[400px] rounded-xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          CodeMentor AI 💻
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-3 rounded font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </main>
  );
}