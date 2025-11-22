// lib/house-generator.ts

export type HouseResult = {
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

type SimpleUser = {
  username: string;
  followers: number;
  following: number;
};

function rng<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateHouseForUser(user: SimpleUser): HouseResult {
  const ratio = user.followers / Math.max(user.following, 1);

  let tier: "low" | "mid" | "high" = "mid";
  if (ratio < 0.5) tier = "low";
  else if (ratio > 2) tier = "high";

  const houseTypesLow = [
    "Shoebox rental with borrowed Wi-Fi",
    "3×3 boarding room that smells like air freshener",
    "Tiny row house next to the train tracks",
    "Budget studio above a noisy street food stall"
  ];

  const houseTypesMid = [
    "Type 21++ but renovation failed halfway",
    "Minimalist cluster, maximalist mortgage",
    "Corner house but neighbors own the parking",
    "Starter home with a forever ‘under construction’ balcony"
  ];

  const houseTypesHigh = [
    "3-floor minimalist mansion just for ‘healing’",
    "Crypto bro penthouse with no realized profit",
    "Bali-style villa but somehow still in the suburbs",
    "Skyline loft with plants that cost more than rent"
  ];

  const pricePoolLow = [
    "Rp 7.2M… kidding, Rp 7.2M in emotional damage, Rp 7.2M vibes only.",
    "Rp 15M including 1 free water dispenser and instant noodles.",
    "Rp 3.5M + two boxes of instant noodles as deposit.",
    "Rp 9.9M flash sale, only today (emotionally)."
  ];

  const pricePoolMid = [
    "Rp 420M because you’re loyal but over-decorate.",
    "Rp 690M, includes a budget for changing your mind.",
    "Rp 350M, minus repainting the pastel walls.",
    "Rp 500M, but the neighborhood group chat is priceless."
  ];

  const pricePoolHigh = [
    "Rp 7.2B because your aura is high risk, high return.",
    "Rp 12B, but you’ll be paying it off in your next life.",
    "Rp 4.5B, discount applied for overthinking.",
    "Rp 9B including private ‘don’t text my ex’ security system."
  ];

  const neighborhoods = [
    "Soft-Launch District",
    "Overthinker’s Corner",
    "Low-Profile High-Drama Block",
    "Semi-Rich but Tired Avenue",
    "Always-Renovating Street",
    "Late-Rent Lane"
  ];

  const cities = [
    "Base City",
    "Onchain Heights",
    "Warpcast Bay",
    "Layer2 Valley",
    "Gas-Saver Town",
    "Emoji District"
  ];

  const vibeLabels = [
    "Main character energy",
    "Side quest enjoyer",
    "Low maintenance, high chaos",
    "Cozy but emotionally expensive",
    "Minimalist aesthetic, maximalist feelings",
    "Air fryer and LED strip supremacy"
  ];

  const riskLabelsLow = [
    "High emotional risk, low financial upside.",
    "More risk from neighbors than from the market.",
    "Main hazard: leaks, drama, and group chats.",
    "Beware: thin walls, thick emotions."
  ];

  const riskLabelsMid = [
    "Moderate risk: flood of feelings once a year.",
    "Safe for living, dangerous for online shopping.",
    "Stable investment, unstable sleep schedule.",
    "Risk: accidental house parties every weekend."
  ];

  const riskLabelsHigh = [
    "High upside, high drama, billionaire neighbor potential.",
    "Volatile like crypto, but at least you can live in it.",
    "Luxury returns, influencer problems.",
    "Big gains, bigger HOA group chats."
  ];

  let houseType: string;
  let price: string;
  let score: number;
  let invNote: string;
  let riskLabel: string;

  if (tier === "low") {
    houseType = rng(houseTypesLow);
    price = rng(pricePoolLow);
    score = 2 + Math.floor(Math.random() * 3); // 2–4
    invNote = "High chance of flooding and feelings.";
    riskLabel = rng(riskLabelsLow);
  } else if (tier === "high") {
    houseType = rng(houseTypesHigh);
    price = rng(pricePoolHigh);
    score = 7 + Math.floor(Math.random() * 4); // 7–10
    invNote = "Good for long-term value, bad for soft quitting.";
    riskLabel = rng(riskLabelsHigh);
  } else {
    houseType = rng(houseTypesMid);
    price = rng(pricePoolMid);
    score = 3 + Math.floor(Math.random() * 4); // 3–6
    invNote = "Medium chance of flooding, 100% chance of group chat drama.";
    riskLabel = rng(riskLabelsMid);
  }

  const city = rng(cities);
  const neighborhood = rng(neighborhoods);
  const houseNumber = 1 + Math.floor(Math.random() * 200);
  const streetEmoji = rng(["🏡", "🌆", "🌃", "🌴", "🛸", "✨"]);

  const addressLine = `${houseNumber} ${neighborhood} ${streetEmoji}, ${city}`;
  const vibeLabel = rng(vibeLabels);

  const tagline = `House version of @${user.username}: ${houseType}`;

  return {
    username: user.username,
    houseType,
    absurdPrice: price,
    investmentScore: score,
    investmentNote: invNote,
    tagline,
    addressLine,
    city,
    neighborhood,
    vibeLabel,
    riskLabel
  };
}
