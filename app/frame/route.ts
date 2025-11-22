// app/frame/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserByFid } from "@/lib/neynar";
import { getOrCreateHouseForUser } from "@/lib/storage";
import { buildWarpcastComposeUrl } from "@/lib/share";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

async function parseFid(req: NextRequest): Promise<number | null> {
  try {
    const body = await req.json().catch(() => null);
    const fid = body?.untrustedData?.fid ?? body?.fid ?? null;
    if (!fid) return null;
    return Number(fid);
  } catch (e) {
    console.error("Error parsing fid:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const fid = await parseFid(req);
  if (!fid) {
    return NextResponse.json({ message: "Missing fid" }, { status: 400 });
  }

  const user = await getUserByFid(fid);
  if (!user) {
    return NextResponse.json(
      { message: "User not found in Neynar" },
      { status: 404 }
    );
  }

  const house = await getOrCreateHouseForUser({
    fid,
    username: user.username,
    followers: user.follower_count,
    following: user.following_count
  });

  const imageUrl = `${BASE_URL}/api/house-image?username=${encodeURIComponent(
    house.username
  )}&houseType=${encodeURIComponent(house.houseType)}`;

  const shareUrl = `${BASE_URL}/share?fid=${fid}`;
  const composeText = `My onchain house is: "${house.houseType}" at ${house.addressLine} — price vibes: ${house.absurdPrice} 🏡 #RealEstateRizz`;
  const composeUrl = buildWarpcastComposeUrl(composeText, shareUrl);

  const textLines = [
    `@${house.username}`,
    `🏡 House type: ${house.houseType}`,
    `📍 Address: ${house.addressLine}`,
    `💸 Price vibes: ${house.absurdPrice}`,
    `📊 Investment: ${house.investmentScore}/10 – ${house.investmentNote}`,
    `✨ Vibe: ${house.vibeLabel}`,
    `⚠️ Risk: ${house.riskLabel}`
  ];

  return NextResponse.json({
    image: imageUrl,
    imageAlt: house.tagline,
    text: textLines.join("\n"),
    buttons: [
      {
        label: "🔁 Re-roll my house",
        action: "post",
        target: `${BASE_URL}/frame`
      },
      {
        label: "📤 Open share page",
        action: "link",
        target: shareUrl
      },
      {
        label: "📝 Cast this house",
        action: "link",
        target: composeUrl
      },
      {
        label: "🏆 View leaderboard",
        action: "link",
        target: `${BASE_URL}/leaderboard`
      }
    ]
  });
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST from Farcaster Frame to get result."
  });
}
