import { NextResponse } from "next/server";

function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const apiKey = process.env.SERPAPI_KEY;

    if (!q) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing SERPAPI_KEY" },
        { status: 500 }
      );
    }

    // Google via SerpAPI
    const start = (page - 1) * 10;
    const url =
      `https://serpapi.com/search.json?` +
      `engine=google` +
      `&q=${encodeURIComponent(q)}` +
      `&hl=iw` +
      `&gl=il` +
      `&num=10` +
      `&start=${start}` +
      `&api_key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url, { cache: "no-store" });
    const data = await r.json();

    const organic = Array.isArray(data?.organic_results) ? data.organic_results : [];
    const results = organic
      .map((it) => {
        const link = it?.link || "";
        const title = it?.title || "";
        const snippet = it?.snippet || "";
        const domain = extractDomain(link);

        return {
          title,
          snippet,
          link,
          // "מקור" חוקי: דומיין בלבד (לא שם פלטפורמה בכותרת)
          source: domain || "web",
        };
      })
      .filter((x) => x.title && x.link);

    return NextResponse.json({
      ok: true,
      q,
      page,
      results,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
