// app/houses/page.tsx

import { getAllHouses, getVoteCount } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function HousesPage() {
  const houses = await getAllHouses();
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        padding: 24
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>
          🏡 All Generated Houses
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          Every user who tried the mini app gets a silly onchain house. This is
          the global gallery.
        </p>

        {houses.length === 0 && <p>No houses generated yet. Be the first!</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16
          }}
        >
          {houses.map((h) => {
            const ogImage = `${baseUrl}/og/house-card?fid=${h.fid}`;
            const shareUrl = `${baseUrl}/share?fid=${h.fid}`;
            const voteCount = getVoteCount(h.fid);

            return (
              <a
                key={h.fid}
                href={shareUrl}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 16,
                  border: "1px solid #1f2937",
                  overflow: "hidden",
                  background:
                    "radial-gradient(circle at top left, #1d4ed8, transparent 50%), #020617",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <img
                  src={ogImage}
                  alt={h.tagline}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderBottom: "1px solid #1f2937"
                  }}
                />
                <div style={{ padding: 12 }}>
                  <div
                    style={{
                      fontSize: 14,
                      opacity: 0.8,
                      marginBottom: 4
                    }}
                  >
                    fid: {h.fid}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    @{h.username}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      marginTop: 4
                    }}
                  >
                    {h.houseType}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 4,
                      opacity: 0.9
                    }}
                  >
                    {h.addressLine}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 4,
                      opacity: 0.8
                    }}
                  >
                    {h.absurdPrice}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>✨ {h.vibeLabel}</span>
                    <span>❤️ {voteCount} votes</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
