// app/leaderboard/page.tsx

import { getLeaderboard } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(20);
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
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>
          🏆 RealEstate Rizz Leaderboard
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          Top voted houses from the community. Vote from Frames and share your
          favorite chaos.
        </p>

        {leaderboard.length === 0 && (
          <p>No votes yet. Start voting from the Frame!</p>
        )}

        <ol style={{ paddingLeft: 0, listStyle: "none" }}>
          {leaderboard.map((entry, idx) => {
            const shareUrl = `${baseUrl}/share?fid=${entry.fid}`;
            const ogImage = `${baseUrl}/og/house-card?fid=${entry.fid}`;

            return (
              <li
                key={entry.fid}
                style={{
                  marginBottom: 16,
                  borderRadius: 16,
                  border: "1px solid #1f2937",
                  background:
                    "radial-gradient(circle at top left, #22c55e33, transparent 55%), #020617",
                  overflow: "hidden",
                  display: "flex"
                }}
              >
                <div
                  style={{
                    width: 80,
                    minWidth: 80,
                    borderRight: "1px solid #1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  #{idx + 1}
                </div>
                <a
                  href={shareUrl}
                  style={{
                    flex: 1,
                    padding: 12,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    gap: 12
                  }}
                >
                  <img
                    src={ogImage}
                    alt={entry.houseType}
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 12
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600
                        }}
                      >
                        @{entry.username}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          marginTop: 4
                        }}
                      >
                        {entry.houseType}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          marginTop: 4,
                          opacity: 0.9
                        }}
                      >
                        {entry.absurdPrice}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        marginTop: 4
                      }}
                    >
                      ❤️ {entry.voteCount} votes
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
