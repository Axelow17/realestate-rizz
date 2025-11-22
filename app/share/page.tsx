// app/share/page.tsx

import type { Metadata } from "next";
import { getUserByFid } from "@/lib/neynar";
import { getOrCreateHouseForUser, getHouseByFid } from "@/lib/storage";
import { generateHouseForUser } from "@/lib/house-generator";

type Props = {
  searchParams: Promise<{ fid?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const fid = Number(params.fid || "0");
  if (!fid) return {};

  const user = await getUserByFid(fid);
  if (!user) return {};

  const stored = await getHouseByFid(fid);
  const result =
    stored ??
    generateHouseForUser({
      username: user.username,
      followers: user.follower_count,
      following: user.following_count
    });

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const imageUrl = `${baseUrl}/og/house-card?fid=${fid}`;

  return {
    title: `House version of @${result.username}`,
    description: `${result.houseType} · ${result.absurdPrice}`,
    openGraph: {
      title: `House version of @${result.username}`,
      description: `${result.houseType} · ${result.absurdPrice}`,
      images: [imageUrl]
    },
    twitter: {
      card: "summary_large_image",
      title: `House version of @${result.username}`,
      description: `${result.houseType} · ${result.absurdPrice}`,
      images: [imageUrl]
    }
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const fid = Number(params.fid || "0");
  if (!fid) return <div>Missing fid</div>;

  const user = await getUserByFid(fid);
  if (!user) return <div>User not found</div>;

  const result = await getOrCreateHouseForUser({
    fid,
    username: user.username,
    followers: user.follower_count,
    following: user.following_count
  });

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
        padding: 24
      }}
    >
      <div
        style={{
          borderRadius: 24,
          padding: 24,
          maxWidth: 600,
          border: "1px solid #334155",
          background:
            "radial-gradient(circle at top left, #1d4ed8, transparent 50%), #020617"
        }}
      >
        <h1>RealEstate Rizz – Your Onchain House</h1>
        <p style={{ opacity: 0.8 }}>@{result.username}</p>
        <hr style={{ opacity: 0.2, margin: "12px 0" }} />
        <p>
          <b>House type:</b> {result.houseType}
        </p>
        <p>
          <b>Address:</b> {result.addressLine}
        </p>
        <p>
          <b>Price vibes:</b> {result.absurdPrice}
        </p>
        <p>
          <b>Investment score:</b> {result.investmentScore}/10 (
          {result.investmentNote})
        </p>
        <p>
          <b>Vibe:</b> {result.vibeLabel}
        </p>
        <p>
          <b>Risk:</b> {result.riskLabel}
        </p>
        <p style={{ marginTop: 16, opacity: 0.7 }}>
          Share this URL on Farcaster – the embed will show your house card
          automatically. 🏡
        </p>
      </div>
    </main>
  );
}
