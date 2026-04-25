"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <main className="authPage">
      <div className="card">
        <h2>Create Account</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button>Create</button>

        <p>
          Already have account? <Link href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
