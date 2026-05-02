/** https://scryfall.com/docs/api — include descriptive User-Agent on all requests. */
export const SCRYFALL_API_BASE = "https://api.scryfall.com";

export const SCRYFALL_USER_AGENT =
  "MTGDeckBuilder/1.0 (+https://github.com/mtg-deck-builder; local development)";

export type ScryfallCardPreview = {
  id: string;
  name: string;
  mana_cost?: string | null;
  type_line?: string | null;
  image_uris?: { small?: string | null; normal?: string | null } | null;
  card_faces?: Array<{
    image_uris?: { small?: string | null };
  }>;
};

export function pickSmallImage(card: ScryfallCardPreview): string | undefined {
  const direct = card.image_uris?.small ?? undefined;
  if (direct) return direct;
  const face = card.card_faces?.[0]?.image_uris?.small;
  return face ?? undefined;
}

export function scryfallFetchInit(): RequestInit {
  return {
    headers: {
      Accept: "application/json",
      "User-Agent": SCRYFALL_USER_AGENT,
    },
    next: { revalidate: 60 },
  };
}
