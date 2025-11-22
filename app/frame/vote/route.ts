// app/frame/vote/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserByFid } from "@/lib/neynar";
import { getOrCreateHouseForUser, voteForHouse } from "@/lib/storage";
import { buildWarpcastComposeUrl } from "@/lib/share";

const BASE_URL = process.env.BASE_URL || "https://realestate-rizz.vercel.app";

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
  const voterFid = await parseFid(req);
  if (!voterFid) {
    return NextResponse.json(
      { message: "Missing voter fid" },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const targetFidParam = url.searchParams.get("targetFid");
  if (!targetFidParam) {
    return NextResponse.json(
      { message: "Missing targetFid" },
      { status: 400 }
    );
  }

  const targetFid = Number(targetFidParam);

  const targetUser = await getUserByFid(targetFid);
  if (!targetUser) {
    return NextResponse.json(
      { message: "Target user not found" },
      { status: 404 }
    );
  }

  const targetHouse = await getOrCreateHouseForUser({
    fid: targetFid,
    username: targetUser.username,
    followers: targetUser.follower_count,
    following: targetUser.following_count
  });

  const voteResult = await voteForHouse(voterFid, targetFid);

  const imageUrl = `${BASE_URL}/og/house-card?fid=${targetFid}`;
  const shareUrl = `${BASE_URL}/share?fid=${targetFid}`;

  const baseText = voteResult.ok
    ? `I just voted for @${targetHouse.username}'s house: "${targetHouse.houseType}" at ${targetHouse.addressLine} 🏡 #RealEstateRizz`
    : `Tried voting for @${targetHouse.username}'s house, but: ${voteResult.reason}`;

  const composeUrl = buildWarpcastComposeUrl(baseText, shareUrl);

  const textLines = [
    voteResult.ok
      ? `✅ Vote recorded! Total votes: ${voteResult.voteCount}`
      : `⚠️ ${voteResult.reason}`,
    "",
    `Target house: "${targetHouse.houseType}"`,
    `Address: ${targetHouse.addressLine}`,
    `Price vibes: ${targetHouse.absurdPrice}`
  ];

  return NextResponse.json({
    image: imageUrl,
    imageAlt: `Voting for @${targetHouse.username}'s house`,
    text: textLines.join("\n"),
    buttons: [
      {
        label: "📝 Cast about this vote",
        action: "link",
        target: composeUrl
      },
      {
        label: "🏆 View leaderboard",
        action: "link",
        target: `${BASE_URL}/leaderboard`
      },
      {
        label: "🔙 Back to main frame",
        action: "post",
        target: `${BASE_URL}/frame`
      }
    ]
  });
}
