import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { StyledPage } from "../styles/StyledPage";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // successful -> redirect to protected home
      navigate("/home");
    } catch (err: any) {
      setMessage(err.message || "Signup failed");
    }
  };

  return (
    <StyledPage>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <div>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="border p-2 rounded"
              />
            </div>
            <button className="bg-blue-500 text-white p-2 rounded">
              Create account
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          {/* 🔹 Switch to login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </StyledPage>
  );
}
