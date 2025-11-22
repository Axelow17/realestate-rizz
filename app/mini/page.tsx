// app/mini/page.tsx
"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

type MiniAppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type HouseFromApi = {
  fid: number;
  username: string;
  houseType: string;
  absurdPrice: string;
  investmentScore: number;
  investmentNote: string;
  tagline: string;
  addressLine: string;
  city: string;
  neighborhood: string;
  vibeLabel: string;
  riskLabel: string;
};

type ApiResponse = {
  house: HouseFromApi;
  shareUrl: string;
  leaderboardUrl: string;
};

export default function MiniAppPage() {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null);
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [house, setHouse] = useState<HouseFromApi | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [leaderboardUrl, setLeaderboardUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // cek apakah sedang dibuka sebagai Mini App
        const inMini = await sdk.isInMiniApp();
        setIsMiniApp(inMini);

        if (!inMini) {
          setLoading(false);
          return;
        }

        // ambil context user dari Mini App
        const context = await sdk.context;
        const u = context.user;
        if (!u?.fid) {
          setErrorText("No user context from Mini App.");
          setLoading(false);
          return;
        }

        const miniUser: MiniAppUser = {
          fid: u.fid,
          username: u.username,
          displayName: u.displayName,
          pfpUrl: u.pfpUrl
        };
        setUser(miniUser);

        // fetch house dari backend
        const res = await fetch("/api/mini/house", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fid: miniUser.fid })
        });

        if (!res.ok) {
          const text = await res.text();
          setErrorText(`Failed to load house: ${text}`);
          setLoading(false);
          return;
        }

        const data: ApiResponse = await res.json();
        setHouse(data.house);
        setShareUrl(data.shareUrl);
        setLeaderboardUrl(data.leaderboardUrl);
      } catch (err: unknown) {
        console.error("Mini App init error:", err);
        setErrorText("Something went wrong initializing the mini app.");
      } finally {
        // kasih tahu host kalau app siap ditampilkan
        try {
          await sdk.actions.ready();
        } catch (e) {
          console.warn("sdk.actions.ready() failed (probably not in Mini App):", e);
        }
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleShareCast = async () => {
    if (!house || !shareUrl) return;

    const text = `My RealEstate Rizz house: "${house.houseType}" at ${house.addressLine} — price vibes: ${house.absurdPrice} 🏡 #RealEstateRizz`;

    try {
      await sdk.actions.composeCast({
        text,
        embeds: [shareUrl]
      });
    } catch (e) {
      console.error("composeCast error:", e);
      setErrorText("Failed to open cast composer.");
    }
  };

  const handleOpenLeaderboard = async () => {
    if (!leaderboardUrl) return;
    try {
      await sdk.actions.openUrl(leaderboardUrl);
    } catch (e) {
      console.error("openUrl error:", e);
      setErrorText("Failed to open leaderboard.");
    }
  };

  const handleAddMiniApp = async () => {
    try {
      await sdk.actions.addMiniApp();
    } catch (e) {
      console.error("addMiniApp error:", e);
      // user mungkin cancel, gak apa2
    }
  };

  // UI fallback: bukan di Mini App
  if (isMiniApp === false) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 16
        }}
      >
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>RealEstate Rizz</h1>
          <p style={{ opacity: 0.8 }}>
            This page is meant to run as a Farcaster Mini App.
            <br />
            Open it from the Farcaster / Base app Mini Apps interface to see your onchain house.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
    >
      <div
        style={{
          width: 424,
          maxWidth: "100%",
          minHeight: 695,
          borderRadius: 24,
          border: "1px solid #1f2937",
          padding: 16,
          background:
            "radial-gradient(circle at top left, #1d4ed8, transparent 55%), #020617",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(() => {
            const pfpUrl = user?.pfpUrl;
            return pfpUrl ? (
              <img
                src={pfpUrl}
                alt="pfp"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid #38bdf8",
                  objectFit: "cover"
                }}
              />
            ) : null;
          })()}
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>RealEstate Rizz</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              @{user?.username || "you"}
            </div>
          </div>
          <button
            onClick={handleAddMiniApp}
            style={{
              marginLeft: "auto",
              fontSize: 11,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #22c55e",
              background: "transparent",
              color: "#bbf7d0",
              cursor: "pointer"
            }}
          >
            + Add
          </button>
        </header>

        <div style={{ height: 12 }} />

        {loading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ opacity: 0.8 }}>Loading your onchain house… 🏡</p>
          </div>
        )}

        {!loading && errorText && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#f97373", textAlign: "center" }}>{errorText}</p>
          </div>
        )}

        {!loading && !errorText && house && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                borderRadius: 20,
                border: "1px solid #1f2937",
                padding: 12,
                background:
                  "radial-gradient(circle at bottom right, #22c55e33, transparent 55%), #020617"
              }}
            >
              <div style={{ fontSize: 14, opacity: 0.8 }}>Your house vibes:</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                {house.houseType}
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                <b>Address</b> <br />
                {house.addressLine}
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                <b>Price vibes</b> <br />
                {house.absurdPrice}
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                <b>Investment</b> <br />
                {house.investmentScore}/10 – {house.investmentNote}
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>✨ {house.vibeLabel}</span>
                <span>⚠️ {house.riskLabel}</span>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: "auto"
              }}
            >
              {/* Re-roll nanti bisa dihubungkan ke endpoint reroll */}
              <button
                onClick={() => {
                  // sementara cuma kasih notif
                  setErrorText("Re-roll via mini app coming soon – currently reuse the same house.");
                  setTimeout(() => setErrorText(null), 3000);
                }}
                style={{
                  padding: "10px 8px",
                  borderRadius: 999,
                  border: "1px solid #1f2937",
                  background: "#020617",
                  color: "white",
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                🔁 Re-roll
              </button>
              <button
                onClick={handleShareCast}
                style={{
                  padding: "10px 8px",
                  borderRadius: 999,
                  border: "none",
                  background: "#4ade80",
                  color: "#022c22",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                📝 Share house
              </button>
              <button
                onClick={handleOpenLeaderboard}
                style={{
                  gridColumn: "span 2",
                  padding: "10px 8px",
                  borderRadius: 999,
                  border: "1px solid #1f2937",
                  background: "#020617",
                  color: "white",
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                🏆 View leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}