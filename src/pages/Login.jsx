import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";
import { useStore } from "../assets/stores/useStore";

export default function Login() {
  const { setUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data);
      navigate("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <span className="font-extrabold tracking-tighter text-3xl text-ink">
              SEMINAR
            </span>
            <span className="font-light opacity-40 tracking-tighter text-3xl ml-0.5 text-ink">
              HUB
            </span>
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
            Secure Access Terminal
          </p>
        </div>

        <div className="bg-surface p-8 border border-line shadow-2xl rounded-none relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-ink"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 border border-red-100 text-[11px] font-bold uppercase tracking-tight">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                Authentication Index (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-line focus:bg-surface focus:ring-1 focus:ring-accent transition-all outline-none text-xs font-mono"
                placeholder="USER@COLLEGE.EDU"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                Access Key (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-line focus:bg-surface focus:ring-1 focus:ring-accent transition-all outline-none text-xs font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-ink text-white font-black hover:bg-neutral-800 transition-all flex items-center justify-center text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {isPending ? "Validating..." : "Establish Session"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
              New User?{" "}
              <Link to="/register" className="text-accent hover:underline ml-1">
                Request Registration
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
