export default function ExplorePage() {
  return (
    <main className="page">
      <h1>Explore</h1>

      <div className="grid">
        <div className="card">Recent Uploaded Images</div>
        <div className="card">Trending Prompts</div>
        <div className="card">Popular AI Uses</div>
        <div className="card">Creative Ideas</div>
      </div>

      <style jsx>{`
        .page{
          min-height:100vh;
          background:#000;
          color:#fff;
          padding:24px;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:16px;
          margin-top:20px;
        }

        .card{
          height:180px;
          background:#101010;
          border:1px solid #1a1a1a;
          border-radius:20px;
          padding:18px;
        }
      `}</style>
    </main>
  );
}
