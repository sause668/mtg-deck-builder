import { NextResponse } from "next/server";

import {
  SCRYFALL_API_BASE,
  scryfallFetchInit,
} from "@/app/lib/scryfall";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing card id" }, { status: 400 });
  }

  const url = `${SCRYFALL_API_BASE}/cards/${encodeURIComponent(id)}`;
  const res = await fetch(url, scryfallFetchInit());
  const body = await res.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { object: "error", details: "Invalid response from Scryfall." },
      { status: 502 },
    );
  }

  return NextResponse.json(body, { status: res.status });
}
