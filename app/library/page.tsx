"use client";

import { useEffect, useState } from "react";

export default function LibraryPage() {
  const [chats,setChats] = useState<string[]>([]);

  useEffect(()=>{
    const data = localStorage.getItem("thinksy_history");
    if(data) setChats(JSON.parse(data));
  },[]);

  return (
    <main className="page">
      <h1>Library</h1>

      {chats.length === 0 ? (
        <div className="empty">
          No chats saved yet.
        </div>
      ) : (
        chats.map((chat,i)=>(
          <div key={i} className="chatCard">
            {chat}
          </div>
        ))
      )}

      <style jsx>{`
        .page{
          min-height:100vh;
          background:#000;
          color:#fff;
          padding:24px;
        }

        .empty,.chatCard{
          margin-top:16px;
          background:#111;
          border:1px solid #1a1a1a;
          padding:18px;
          border-radius:18px;
        }
      `}</style>
    </main>
  );
}
