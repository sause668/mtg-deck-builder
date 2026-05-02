import { NextResponse } from "next/server";

import {
  SCRYFALL_API_BASE,
  scryfallFetchInit,
} from "@/app/lib/scryfall";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json(
      { object: "error", details: "Missing search query `q`." },
      { status: 400 },
    );
  }

  const page = searchParams.get("page") ?? "1";
  const url = new URL(`${SCRYFALL_API_BASE}/cards/search`);
  url.searchParams.set("q", q);
  url.searchParams.set("page", page);

  const res = await fetch(url.toString(), scryfallFetchInit());

  const body = await res.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { object: "error", details: "Invalid response from Scryfall." },
      { status: 502 },
    );
  }

  return NextResponse.json(body, { status: res.status });
}
