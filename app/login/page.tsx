"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setError("");

    if (!email || !password) {
      setError("Fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          window.location.origin,
      },
    });
  }

  return (
    <main className="loginWrap">
      {/* LEFT SIDE */}
      <section className="leftPanel">
        <div className="brandBox">
          <div className="logoGlow" />
          <h1>Thinksy</h1>
          <p>
            Intelligent chat.
            Premium experience.
          </p>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="rightPanel">
        <div className="card">
          <h2>Welcome back</h2>
          <p className="sub">
            Login to continue
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="field">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="field">
            <Lock size={18} />
            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="eyeBtn"
              onClick={() =>
                setShowPass(
                  !showPass
                )
              }
            >
              {showPass ? (
                <EyeOff
                  size={18}
                />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* LOGIN */}
          <button
            className="mainBtn"
            onClick={login}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : "Login"}
            <ArrowRight size={18} />
          </button>

          {/* GOOGLE */}
          <button
            className="googleBtn"
            onClick={
              googleLogin
            }
          >
            Continue with Google
          </button>

          {/* SIGNUP */}
          <div className="bottomText">
            New here?{" "}
            <span
              onClick={() =>
                router.push(
                  "/signup"
                )
              }
            >
              Create account
            </span>
          </div>
        </div>
      </section>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Inter,
            sans-serif;
          background: #000;
          color: #fff;
        }

        .loginWrap {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              circle at top left,
              #111,
              #000 45%
            );
        }

        .leftPanel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border-right: 1px solid
            #151515;
        }

        .brandBox {
          max-width: 420px;
        }

        .logoGlow {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #fff,
              #444
            );
          margin-bottom: 24px;
          box-shadow: 0 0 40px
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .brandBox h1 {
          font-size: 52px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .brandBox p {
          color: #9c9c9c;
          font-size: 18px;
          line-height: 1.6;
        }

        .rightPanel {
          width: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .card {
          width: 100%;
          background: #090909;
          border: 1px solid
            #1a1a1a;
          border-radius: 28px;
          padding: 34px;
        }

        .card h2 {
          font-size: 34px;
          margin-bottom: 8px;
        }

        .sub {
          color: #8b8b8b;
          margin-bottom: 24px;
        }

        .error {
          background: #170909;
          border: 1px solid
            #401414;
          color: #ff8b8b;
          padding: 12px;
          border-radius: 14px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .field {
          height: 58px;
          border-radius: 18px;
          background: #111;
          border: 1px solid
            #1d1d1d;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          margin-bottom: 14px;
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
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
        }

        .mainBtn,
        .googleBtn {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          margin-top: 10px;
        }

        .mainBtn {
          background: #fff;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .googleBtn {
          background: #121212;
          color: #fff;
          border: 1px solid
            #222;
        }

        .bottomText {
          margin-top: 22px;
          text-align: center;
          color: #8f8f8f;
          font-size: 14px;
        }

        .bottomText span {
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .loginWrap {
            flex-direction: column;
          }

          .leftPanel {
            border-right: none;
            border-bottom: 1px
              solid #151515;
            padding: 32px 22px;
          }

          .brandBox h1 {
            font-size: 40px;
          }

          .brandBox p {
            font-size: 15px;
          }

          .rightPanel {
            width: 100%;
            padding: 18px;
          }

          .card {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}
