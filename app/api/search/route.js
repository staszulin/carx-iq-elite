export const runtime = "nodejs";

function pickPhone(text = "") {
  const m = text.match(/05\d[- ]?\d{3}[- ]?\d{4}/);
  return m ? m[0].replace(/\s/g, "") : "";
}

function normalizeItem(r) {
  const title = r.title || "";
  const snippet = r.snippet || "";
  const phone = pickPhone(`${title} ${snippet}`);
  const images = Array.isArray(r.thumbnail) ? r.thumbnail : r.thumbnail ? [r.thumbnail] : [];
  return {
    title,
    price: null,
    km: null,
    year: null,
    hand: null,
    area: null,
    contactName: null,
    contactPhone: phone || "050-000-0000",
    images: images.length ? images : ["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&q=80&auto=format&fit=crop"],
    // לא מחזירים מקור/דומיין ללקוח (חוק ה-Black Box שלך)
    _sourceHidden: true
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Number(searchParams.get("page") || "1");

    if (!q) {
      return Response.json({ ok: false, error: "Missing q" }, { status: 400 });
    }

    const key = process.env.SERPAPI_KEY;
    if (!key) {
      return Response.json({ ok: false, error: "Missing SERPAPI_KEY" }, { status: 500 });
    }

    // שאילתה שמכוונת למודעות רכב בישראל
    const query = `${q} למכירה טלפון מחיר ק"מ יד`;

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google");
    url.searchParams.set("q", query);
    url.searchParams.set("hl", "iw");
    url.searchParams.set("gl", "il");
    url.searchParams.set("num", "10");
    url.searchParams.set("start", String((page - 1) * 10));
    url.searchParams.set("api_key", key);

    const r = await fetch(url.toString(), { method: "GET" });
    const data = await r.json();

    const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
    const results = organic.slice(0, 10).map(normalizeItem);

    return Response.json({ ok: true, q, page, results });
  } catch (e) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
