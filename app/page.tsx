"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="cover">
      <div className="hero">
        <h1>Thinksy</h1>
        <p>The future AI workspace</p>

        <div className="heroBtns">
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
          <Link href="/chat">Enter App</Link>
        </div>
      </div>
    </main>
  );
}
