"use client";

export default function ExplorePage() {
  const cards = [
    "Recent Uploaded Images",
    "Trending Prompts",
    "Popular AI Uses",
    "Creative Ideas",
    "Smart Tools",
    "Study Help",
  ];

  return (
    <main className="page">
      <div className="top">
        <h1>Explore</h1>
        <p>Discover things you can do with Thinksy</p>
      </div>

      <div className="grid">
        {cards.map((item, i) => (
          <div key={i} className="card">
            <div className="thumb" />
            <h3>{item}</h3>
            <span>Open</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 24px;
        }

        .top {
          margin-bottom: 22px;
        }

        h1 {
          font-size: 34px;
          margin-bottom: 6px;
        }

        p {
          color: #8a8a8a;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .card {
          background: #0f0f0f;
          border: 1px solid #1b1b1b;
          border-radius: 22px;
          padding: 16px;
          transition: 0.2s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          border-color: #2a2a2a;
        }

        .thumb {
          height: 130px;
          border-radius: 16px;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #111, #222, #111);
        }

        h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        span {
          color: #9e9e9e;
          font-size: 14px;
        }

        @media (max-width: 700px) {
          .page {
            padding: 16px;
          }

          h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
