"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("lumina_user");

    if (user) {
      router.push("/");
    }
  }, [router]);

  async function login() {
    if (!email || !password) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "lumina_user",
        JSON.stringify({
          email,
        })
      );

      router.push("/");
    }, 1200);
  }

  return (
    <main className="page">
      {/* Animated Glow */}
      <div className="glow glow1" />
      <div className="glow glow2" />

      {/* Card */}
      <section className="card">
        <div className="brand">
          <div className="logoWrap">
            <Sparkles size={26} />
          </div>

          <h1>Lumina</h1>

          <p>
            Intelligent conversations.
            <br />
            Beautifully reimagined.
          </p>
        </div>

        {/* Inputs */}
        <div className="inputGroup">
          <div className="inputWrap">
            <Mail size={18} />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="inputWrap">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && login()
              }
            />
          </div>
        </div>

        {/* Button */}
        <button
          className="loginBtn"
          onClick={login}
          disabled={loading}
        >
          {loading ? (
            "Entering Lumina..."
          ) : (
            <>
              Continue
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="bottomText">
          Crafted for next-generation AI experiences
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
          overflow: hidden;
        }

        .page {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at top left,
              #141414,
              #000
            );
          position: relative;
          overflow: hidden;
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.35;
          animation: float 10s ease-in-out infinite;
        }

        .glow1 {
          width: 300px;
          height: 300px;
          background: #ffffff;
          top: -100px;
          left: -100px;
        }

        .glow2 {
          width: 260px;
          height: 260px;
          background: #5c5cff;
          bottom: -80px;
          right: -80px;
          animation-delay: 2s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-25px);
          }

          100% {
            transform: translateY(0px);
          }
        }

        .card {
          width: 100%;
          max-width: 430px;
          background: rgba(15, 15, 15, 0.75);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 42px 34px;
          position: relative;
          z-index: 10;
          box-shadow:
            0 10px 40px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .brand {
          text-align: center;
          margin-bottom: 34px;
        }

        .logoWrap {
          width: 74px;
          height: 74px;
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #fff,
              #bfbfbf
            );
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #000;
          box-shadow:
            0 10px 30px rgba(255,255,255,0.15);
        }

        .brand h1 {
          color: #fff;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .brand p {
          margin-top: 10px;
          color: #8b8b8b;
          font-size: 15px;
          line-height: 1.6;
        }

        .inputGroup {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .inputWrap {
          height: 58px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: 0.2s ease;
        }

        .inputWrap:focus-within {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
        }

        .inputWrap svg {
          color: #8a8a8a;
        }

        .inputWrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 15px;
        }

        .inputWrap input::placeholder {
          color: #777;
        }

        .loginBtn {
          margin-top: 22px;
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 18px;
          background: #fff;
          color: #000;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.25s ease;
        }

        .loginBtn:hover {
          transform: translateY(-2px);
        }

        .loginBtn:active {
          transform: scale(0.98);
        }

        .loginBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .bottomText {
          margin-top: 24px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }

        @media (max-width: 520px) {
          .card {
            margin: 18px;
            padding: 32px 24px;
            border-radius: 24px;
          }

          .brand h1 {
            font-size: 36px;
          }
        }
      `}</style>
    </main>
  );
}
