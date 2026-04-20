import { useState } from "react";
import { signIn } from "@/lib/supabase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    await signIn(email, pass);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
