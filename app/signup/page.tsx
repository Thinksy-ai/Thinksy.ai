"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [msg, setMsg] = useState("");

  async function signup() {
    setLoading(true);
    setMsg("");

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg(
      "Account created. Check email if confirmation is enabled."
    );

    setTimeout(() => {
      router.push("/login");
    }, 1200);

    setLoading(false);
  }

  return (
    <main className="wrap">
      <div className="card">
        <h1>Thinksy</h1>
        <p>Create your account</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={signup}
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Sign Up"}
        </button>

        {msg && (
          <div className="msg">
            {msg}
          </div>
        )}

        <Link href="/login">
          Already have account?
          Login
        </Link>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          color: #fff;
          font-family: Inter,
            sans-serif;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: #0b0b0b;
          border: 1px solid #1a1a1a;
          border-radius: 26px;
          padding: 28px;
        }

        h1 {
          font-size: 34px;
          margin-bottom: 8px;
        }

        p {
          color: #888;
          margin-bottom: 22px;
        }

        input {
          width: 100%;
          height: 52px;
          margin-bottom: 14px;
          border: none;
          outline: none;
          border-radius: 16px;
          padding: 0 16px;
          background: #111;
          color: #fff;
        }

        button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 16px;
          background: #fff;
          color: #000;
          font-weight: 700;
          cursor: pointer;
        }

        .msg {
          margin-top: 14px;
          color: #9f9f9f;
          font-size: 14px;
        }

        a {
          display: block;
          margin-top: 18px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
