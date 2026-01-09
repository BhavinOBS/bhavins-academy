"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // npm install react-icons

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result?.error) {
      router.push("/");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96 border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Welcome Back
        </h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Email/Password Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        {/* Microsoft Azure Sign-In */}
        <button
          type="button"
          onClick={() => signIn("azure-ad")}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition mt-3"
        >
          <img
            src="/microsoft-logo.svg"
            alt="Microsoft logo"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Continue with Microsoft</span>
        </button>

        {/* Optional: Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </main>
  );
}

