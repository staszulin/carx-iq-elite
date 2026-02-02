export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return Response.json({ ok: false, error: "Missing query" }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return Response.json({ ok: false, error: "Missing SERPAPI_KEY" }, { status: 500 });
    }

    const url =
      "https://serpapi.com/search.json" +
      `?engine=google&q=${encodeURIComponent(q)}` +
      `&hl=he&gl=il&num=10&api_key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, error: "SerpAPI error", details: t }, { status: 502 });
    }

    const data = await r.json();

    const items = (data.organic_results || []).map(x => ({
      title: x.title || "",
      link: x.link || "",
      snippet: x.snippet || "",
      source: (() => {
        try {
          return new URL(x.link).hostname.replace(/^www\./, "");
        } catch {
          return "";
        }
      })(),
    }));

    return Response.json({ ok: true, items });
  } catch (e) {
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
