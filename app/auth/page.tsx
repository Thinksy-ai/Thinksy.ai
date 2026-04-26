"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  async function submitForm() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (mode === "login") {
        alert("Logged in successfully");
      } else {
        alert("Account created successfully");
      }
    }, 1200);
  }

  async function googleLogin() {
    alert("Connect Google Auth in Supabase next step");
  }

  return (
    <main className="authWrap">
      {/* Background */}
      <div className="bgGlow glow1" />
      <div className="bgGlow glow2" />
      <div className="gridLayer" />

      {/* Card */}
      <section className="card">
        {/* Brand */}
        <div className="brandRow">
          <div className="logo">T</div>
          <div>
            <h1>Thinksy</h1>
            <p>Premium AI Workspace</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setMode("login")}
            className={mode === "login" ? "active" : ""}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className={mode === "signup" ? "active" : ""}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="head">
          <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <span>
            {mode === "login"
              ? "Access your Thinksy workspace"
              : "Join Thinksy in seconds"}
          </span>
        </div>

        {/* Google */}
        <button className="googleBtn" onClick={googleLogin}>
          <Chrome size={18} />
          Continue with Google
        </button>

        <div className="divider">
          <span>or continue with email</span>
        </div>

        {/* Form */}
        <div className="formArea">
          {mode === "signup" && (
            <div className="field">
              <User size={18} />
              <input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <Mail size={18} />
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <Lock size={18} />
            <input
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <button
              className="eyeBtn"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === "signup" && (
            <div className="field">
              <Lock size={18} />
              <input
                placeholder="Confirm password"
                type={showPass2 ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button
                className="eyeBtn"
                onClick={() => setShowPass2(!showPass2)}
              >
                {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {mode === "login" && (
            <button className="miniLink">Forgot password?</button>
          )}

          <button
            className="submitBtn"
            onClick={submitForm}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}

            {!loading && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Footer */}
        <div className="switchText">
          {mode === "login"
            ? "New to Thinksy?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </section>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Inter, sans-serif;
          background: #000;
          color: #fff;
        }

        .authWrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .bgGlow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.22;
          animation: float 8s ease-in-out infinite;
        }

        .glow1 {
          background: #2f7cff;
          top: -80px;
          left: -80px;
        }

        .glow2 {
          background: #7c3aed;
          bottom: -80px;
          right: -80px;
          animation-delay: 2s;
        }

        .gridLayer {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(255,255,255,0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.03) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
          opacity: 0.4;
        }

        .card {
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 2;
          background: rgba(12, 12, 12, 0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 28px;
          backdrop-filter: blur(24px);
          box-shadow: 0 20px 80px rgba(0,0,0,0.55);
          animation: rise 0.7s ease;
        }

        .brandRow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fff, #777);
          color: #000;
          font-size: 24px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brandRow h1 {
          font-size: 24px;
        }

        .brandRow p {
          color: #888;
          font-size: 13px;
          margin-top: 2px;
        }

        .tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: #111;
          padding: 6px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .tabs button {
          height: 42px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #999;
          font-weight: 600;
        }

        .tabs button.active {
          background: #fff;
          color: #000;
        }

        .head h2 {
          font-size: 28px;
          margin-bottom: 6px;
        }

        .head span {
          color: #8a8a8a;
          font-size: 14px;
        }

        .googleBtn {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 16px;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 22px;
          font-size: 15px;
        }

        .divider {
          text-align: center;
          color: #666;
          font-size: 13px;
          margin: 18px 0;
        }

        .formArea {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .field {
          height: 54px;
          border-radius: 16px;
          background: #0f0f0f;
          border: 1px solid #1c1c1c;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 10px;
        }

        .field input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 15px;
        }

        .eyeBtn {
          background: transparent;
          border: none;
          color: #999;
        }

        .miniLink {
          background: transparent;
          border: none;
          color: #8ca7ff;
          text-align: right;
          font-size: 14px;
        }

        .submitBtn {
          margin-top: 6px;
          height: 56px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #fff, #d6d6d6);
          color: #000;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .switchText {
          margin-top: 18px;
          text-align: center;
          color: #777;
          font-size: 14px;
        }

        .switchText button {
          background: transparent;
          border: none;
          color: #fff;
          margin-left: 6px;
          font-weight: 700;
        }

        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 600px) {
          .card {
            padding: 22px;
            border-radius: 24px;
          }

          .head h2 {
            font-size: 24px;
          }

          .logo {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </main>
  );
}
