"use client";

import { useState } from "react";
import { signUpEmail } from "../../lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function signup() {
    const { error } = await signUpEmail(email,password);

    if(error) return alert(error.message);

    alert("Account created");
    router.push("/login");
  }

  return (
    <main className="authPage">
      <div className="card">
        <h1>Sign Up</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={signup}>Create Account</button>
      </div>
    </main>
  );
}
