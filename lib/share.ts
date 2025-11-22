// lib/share.ts

export function buildWarpcastComposeUrl(text: string, embedUrl: string): string {
  const base = "https://warpcast.com/~/compose";
  const params = new URLSearchParams();
  params.set("text", text);
  params.append("embeds[]", embedUrl);
  return `${base}?${params.toString()}`;
}
