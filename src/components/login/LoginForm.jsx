import React, { useState } from "react";
import api from "../../api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginForm() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const primary = "var(--color-primary)";
  const pageBg = "var(--color-page)";
  const cardBg = "var(--color-card)";
  const text = "var(--color-text)";
  const muted = "var(--color-muted)";
  const errColor = "var(--color-status-red)";

  // Validation
  const runValidation = () => {
    const e = {};

    if (!email) e.email = "Email is required.";
    else if (!validateEmail(email)) e.email = "Enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Password must be at least 8 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!runValidation()) return;

    setSubmitting(true);

    try {
      const payload = { email: email.trim(), password };

      const res = await axios.post(api.Auth.Login, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (!data.user || !data.token) throw new Error("Invalid login response.");

      // Save user & token in global store + cookies
      loginToStore({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      });

      // Navigate according to role
      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "agent":
          navigate("/agentDashboard");
          break;
        case "teamhead":
          navigate("/teamHeadDashboard");
          break;
        case "subadmin":
          navigate("/subAdminDashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: pageBg }}
    >
      <div className="w-full max-w-md mx-4">
        <div
          className="rounded-2xl shadow-md p-6 sm:p-8"
          style={{ background: cardBg }}
        >
          <div className="mb-4 text-center">
            <div
              className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-3"
              style={{ background: primary }}
            >
              <span className="text-white font-semibold">N</span>
            </div>
            <h1 className="text-xl font-semibold" style={{ color: text }}>
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: muted }}>
              Sign in to your CRM account
            </p>
          </div>

          {errors.form && (
            <div
              role="alert"
              className="mb-3 text-sm"
              style={{ color: errColor }}
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-1"
                style={{ color: text }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={runValidation}
                placeholder="you@company.com"
                className="block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none"
                style={{
                  borderColor: errors.email ? errColor : "#E6E8EE",
                }}
              />
              {errors.email && (
                <p
                  className="mt-2 text-xs"
                  role="alert"
                  style={{ color: errColor }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium mb-1"
                style={{ color: text }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={runValidation}
                  placeholder="Enter your password"
                  className="block w-full rounded-md border px-3 py-2 text-sm pr-10 placeholder-gray-400 focus:outline-none"
                  style={{
                    borderColor: errors.password ? errColor : "#E6E8EE",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-1 my-1 px-2 rounded text-sm focus:outline-none"
                >
                  <span style={{ color: muted }}>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p
                  className="mt-2 text-xs"
                  role="alert"
                  style={{ color: errColor }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-md text-white font-medium shadow-sm focus:outline-none"
              style={{
                background: primary,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs" style={{ color: muted }}>
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-medium"
              style={{ color: primary }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
