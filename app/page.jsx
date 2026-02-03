"use client";

import { useEffect, useMemo, useState } from "react";
import { LISTINGS } from "./data/listings";

const BRAND = { name: "CAR-X IQ Elite", accent: "#d4af37" };

const ACCESS_CODES = ["ELITE-2026", "VIP-9999"];

function isValidCode(code) {
  const c = String(code || "").trim().toUpperCase();
  return ACCESS_CODES.includes(c);
}

function getPlanFromCode(code) {
  const c = String(code || "").trim().toUpperCase();
  if (c.startsWith("VIP-")) return "VIP";
  if (c.startsWith("ELITE-")) return "ELITE";
  return "NONE";
}

function formatNis(n) {
  const num = Number(n || 0);
  return num.toLocaleString("he-IL") + " ₪";
}

function computeIq(item) {
  const yearScore = Math.min(30, Math.max(0, (item.year - 2014) * 3));
  const kmScore = Math.min(30, Math.max(0, 30 - Math.floor((item.km || 0) / 15000)));
  const handScore = Math.min(20, Math.max(0, 20 - ((item.hand || 1) - 1) * 6));

  const fair = Math.round((item.year - 2010) * 4500 + Math.max(0, 140000 - item.km) * 0.25);
  const priceDiff = fair - (item.price || 0);

  let priceScore = 20;
  if (priceDiff > 15000) priceScore = 20;
  else if (priceDiff > 7000) priceScore = 16;
  else if (priceDiff > 0) priceScore = 12;
  else if (priceDiff > -8000) priceScore = 7;
  else priceScore = 3;

  const iq = Math.max(1, Math.min(100, yearScore + kmScore + handScore + priceScore));
  let verdict = "סביר";
  if (iq >= 80) verdict = "מציאה";
  else if (iq >= 60) verdict = "סביר";
  else if (iq >= 45) verdict = "גבולי";
  else verdict = "לא כדאי";

  const flags = [];
  if (item.hand >= 4) flags.push("ריבוי ידיים");
  if (item.km >= 140000) flags.push("ק״מ גבוה");
  if (priceDiff < -12000) flags.push("מחיר מעל הערכת שוק");

  return { iq, verdict, fair, flags };
}

/** ---------- דמו פנימי ---------- */
function SearchElite() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return LISTINGS;
    return LISTINGS.filter(x =>
      `${x.make} ${x.model} ${x.year} ${x.area}`.toLowerCase().includes(needle)
    );
  }, [q]);

  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #333", borderRadius: 18, padding: 18 }}>
      <div style={{ fontWeight: 900, fontSize: 16 }}>מנוע הצייד</div>
      <div style={{ opacity: 0.8, marginTop: 8, lineHeight: 1.5 }}>
        חיפוש במאגר הדמו.
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="לדוגמה: קורולה 2019, איוניק, מרכז..."
          style={{
            flex: "1 1 240px",
            background: "#0b0b0b",
            border: "1px solid #333",
            color: "#f5f5f5",
            padding: "12px 14px",
            borderRadius: 12,
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {filtered.map(item => {
          const r = computeIq(item);
          return (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                textAlign: "right",
                background: "#111",
                border: "1px solid #333",
                borderRadius: 16,
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{item.make} {item.model} · {item.year}</div>
                  <div style={{ opacity: 0.8, marginTop: 6 }}>
                    {item.km.toLocaleString("he-IL")} ק״מ · יד {item.hand} · {item.area}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: BRAND.accent, fontWeight: 900 }}>{formatNis(item.price)}</div>
                  <div style={{ opacity: 0.75, marginTop: 6 }}>IQ {r.iq}/100 · {r.verdict}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div style={{ marginTop: 14, background: "#0b0b0b", border: "1px solid #333", borderRadius: 16, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 900 }}>{selected.make} {selected.model} · {selected.year}</div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: "transparent", border: "1px solid #333", color: "#f5f5f5", padding: "8px 12px", borderRadius: 12, fontWeight: 700 }}
            >
              סגור
            </button>
          </div>

          <img
            src={selected.images?.[0]}
            alt={`${selected.make} ${selected.model}`}
            style={{ width: "100%", borderRadius: 14, marginTop: 12, border: "1px solid #222" }}
          />

          {(() => {
            const r = computeIq(selected);
            return (
              <div style={{ marginTop: 12, background: "#111", border: "1px solid #333", borderRadius: 14, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>IQ Score</div>
                  <div style={{ fontWeight: 900, color: BRAND.accent }}>{r.iq}/100 · {r.verdict}</div>
                </div>
                <div style={{ opacity: 0.8, marginTop: 8 }}>
                  הערכת מחיר הוגן (דמו): {formatNis(r.fair)}
                </div>
                <div style={{ marginTop: 8, opacity: 0.9 }}>
                  {r.flags.length ? `דגלים: ${r.flags.join(" · ")}` : "אין דגלים חריגים."}
                </div>
              </div>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
}

/** ---------- חיפוש רשת (כמו גוגל) עם מגבלה ---------- */
function WebSearch({ plan }) {
  const DAILY_LIMIT = 20;

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState("");
  const [err, setErr] = useState("");

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getUsage() {
    const key = `carx_websearch_${todayKey()}`;
    const raw = localStorage.getItem(key);
    const used = raw ? Number(raw) : 0;
    return { key, used: Number.isFinite(used) ? used : 0 };
  }

  function incUsage() {
    const { key, used } = getUsage();
    localStorage.setItem(key, String(used + 1));
  }

  async function runSearch() {
    const query = q.trim();
    if (!query) return;

    if (plan !== "VIP") {
      const { used } = getUsage();
      if (used >= DAILY_LIMIT) {
        setErr("הגעת למגבלה: 20 חיפושי רשת היום. שדרג ל-VIP ללא הגבלה.");
        setItems([]);
        return;
      }
    }

    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "שגיאה");
      setItems(data.items || []);
      setExpanded(data.expandedQuery || "");

      if (plan !== "VIP") incUsage();
    } catch (e) {
      setErr("לא הצלחתי להביא תוצאות. בדוק שיש SERPAPI_KEY ב-Vercel.");
      setItems([]);
      setExpanded("");
    } finally {
      setLoading(false);
    }
  }

  const remaining = plan === "VIP" ? "∞" : Math.max(0, DAILY_LIMIT - (typeof window !== "undefined" ? getUsage().used : 0));

  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #333", borderRadius: 18, padding: 18 }}>
      <div style={{ fontWeight: 900, fontSize: 16 }}>חיפוש רשת (כמו גוגל)</div>

      <div style={{ opacity: 0.8, marginTop: 8, lineHeight: 1.5 }}>
        תוצאות עם מקור גלוי ולינק החוצה. {plan === "VIP" ? "VIP ללא הגבלה." : `מגבלה: ${DAILY_LIMIT} ביום.`}
      </div>

      <div style={{ marginTop: 10, opacity: 0.85, fontSize: 13 }}>
        נשאר היום: <span style={{ color: BRAND.accent, fontWeight: 900 }}>{remaining}</span>
      </div>

      {expanded ? (
        <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13, lineHeight: 1.4 }}>
          מחפש בפועל: <span style={{ color: BRAND.accent, fontWeight: 800 }}>{expanded}</span>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="לדוגמה: קורולה 2019"
          style={{
            flex: "1 1 240px",
            background: "#0b0b0b",
            border: "1px solid #333",
            color: "#f5f5f5",
            padding: "12px 14px",
            borderRadius: 12,
            outline: "none",
          }}
        />
        <button
          onClick={runSearch}
          style={{
            background: BRAND.accent,
            color: "#0b0b0b",
            border: "none",
            padding: "12px 18px",
            borderRadius: 12,
            fontWeight: 900,
            cursor: "pointer",
            minWidth: 110,
          }}
        >
          {loading ? "מחפש..." : "חפש"}
        </button>
      </div>

      {err ? (
        <div style={{ marginTop: 12, background: "rgba(255,70,70,0.12)", border: "1px solid rgba(255,70,70,0.25)", padding: 10, borderRadius: 12 }}>
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {items.map((x, i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #333", borderRadius: 16, padding: 14 }}>
            <div style={{ opacity: 0.75, fontSize: 12 }}>{x.source}</div>
            <div style={{ fontWeight: 900, marginTop: 6 }}>{x.title}</div>
            <div style={{ opacity: 0.85, marginTop: 8, lineHeight: 1.5 }}>{x.snippet}</div>
            <a
              href={x.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 10,
                textDecoration: "none",
                background: "#0b0b0b",
                border: "1px solid #333",
                padding: "10px 12px",
                borderRadius: 12,
                color: "#f5f5f5",
                fontWeight: 800,
              }}
            >
              פתח מקור
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [plan, setPlan] = useState("NONE");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("carx_access") || "";
    if (isValidCode(saved)) {
      setUnlocked(true);
      setPlan(getPlanFromCode(saved));
    }
  }, []);

  function unlock() {
    const c = String(code || "").trim().toUpperCase();
    if (!c) return setMsg("תכתוב קוד ואז לחץ כניסה");
    if (!isValidCode(c)) return setMsg("קוד לא נכון. אחרי תשלום תקבל קוד גישה.");
    localStorage.setItem("carx_access", c);
    setUnlocked(true);
    setPlan(getPlanFromCode(c));
    setMsg("");
  }

  function logout() {
    localStorage.removeItem("carx_access");
    setUnlocked(false);
    setPlan("NONE");
    setCode("");
    setMsg("");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#f5f5f5", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 18 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 6px" }}>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 1, color: BRAND.accent, fontSize: 20 }}>
              {BRAND.name}
            </div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              מודיעין רכבים. החלטות מהירות. גישה סגורה.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href="/pay"
              style={{
                textDecoration: "none",
                background: "#111",
                border: "1px solid #333",
                padding: "10px 14px",
                borderRadius: 12,
                color: "#f5f5f5",
                fontWeight: 700,
              }}
            >
              תשלום
            </a>
            {unlocked ? (
              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: "1px solid #333",
                  padding: "10px 14px",
                  borderRadius: 12,
                  color: "#f5f5f5",
                  fontWeight: 700,
                }}
              >
                יציאה
              </button>
            ) : null}
          </div>
        </header>

        {!unlocked ? (
          <div style={{ marginTop: 18, background: "#111", border: "1px solid #333", borderRadius: 18, padding: 22 }}>
            <h1 style={{ margin: 0, color: BRAND.accent, letterSpacing: 1 }}>גישה ל-Elite</h1>
            <p style={{ opacity: 0.85, marginTop: 10, lineHeight: 1.5 }}>
              כדי להיכנס צריך <b>קוד גישה</b>.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="הכנס קוד גישה (לדוגמה: ELITE-2026)"
                style={{
                  flex: "1 1 240px",
                  background: "#0f0f0f",
                  border: "1px solid #333",
                  color: "#f5f5f5",
                  padding: "12px 14px",
                  borderRadius: 12,
                  outline: "none",
                }}
              />
              <button
                onClick={unlock}
                style={{
                  background: BRAND.accent,
                  color: "#0b0b0b",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                כניסה
              </button>
            </div>

            {msg ? (
              <div style={{ marginTop: 12, background: "rgba(255,70,70,0.12)", border: "1px solid rgba(255,70,70,0.25)", padding: 10, borderRadius: 12 }}>
                {msg}
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            <div style={{ background: "#111", border: "1px solid #333", borderRadius: 18, padding: 18 }}>
              <div style={{ color: BRAND.accent, fontWeight: 900, letterSpacing: 1 }}>
                פתוח למנוי: {plan}
              </div>
              <div style={{ opacity: 0.85, marginTop: 8 }}>
                ELITE: 20 חיפושי רשת ביום · VIP: ללא הגבלה
              </div>
            </div>

            <SearchElite />
            <WebSearch plan={plan} />
          </div>
        )}

        <footer style={{ marginTop: 26, opacity: 0.55, fontSize: 12, padding: "0 6px 20px" }}>
          © {new Date().getFullYear()} CAR-X IQ Elite · All Rights Reserved
        </footer>
      </div>
    </main>
  );
}
