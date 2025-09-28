import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { StyledPage } from "../styles/StyledPage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // if we were redirected here by RequireAuth, go back to original page
      const from = location?.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    }
  };

  return (
    <StyledPage>
      <h2 className="font-bold text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
        <button className="bg-blue-500 text-white p-2 rounded">Log in</button>
      </form>
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      {/* 🔹 Switch to signup */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </StyledPage>
  );
}
