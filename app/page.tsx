// app/page.tsx

export default function HomePage() {
  const baseUrl = process.env.BASE_URL || "";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          maxWidth: 600,
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>
          🏡 RealEstate Rizz
        </h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          A Farcaster mini app that turns your profile into a ridiculous onchain
          house: price vibes, risk, and all.
        </p>
        <p style={{ opacity: 0.7 }}>
          Use this as a Frame URL:
          <br />
          <code
            style={{
              display: "inline-block",
              marginTop: 8,
              padding: "4px 8px",
              background: "#0f172a",
              borderRadius: 8,
              fontSize: 14
            }}
          >
            {baseUrl}/frame
          </code>
        </p>
      </div>
    </main>
  );
}
