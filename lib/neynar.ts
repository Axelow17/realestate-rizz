// lib/neynar.ts

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY as string;

if (!NEYNAR_API_KEY) {
  console.warn("NEYNAR_API_KEY is not set. Neynar calls will fail.");
}

export type NeynarUser = {
  fid: number;
  username: string;
  follower_count: number;
  following_count: number;
  pfp_url?: string;
};

export async function getUserByFid(fid: number): Promise<NeynarUser | null> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user?fid=${fid}`,
      {
        headers: {
          api_key: NEYNAR_API_KEY
        },
        cache: "no-store"
      }
    );

    if (!res.ok) {
      console.error("Neynar error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const user = data.user || data.result?.user || data;

    return {
      fid,
      username: user.username,
      follower_count: user.follower_count ?? user.followerCount ?? 0,
      following_count: user.following_count ?? user.followingCount ?? 0,
      pfp_url: user.pfp_url || user.pfp?.url
    };
  } catch (e) {
    console.error("Error fetching user from Neynar:", e);
    return null;
  }
}
