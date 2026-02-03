"use client";

import React, { useMemo, useState } from "react";

const BRAND = {
  bg: "#0b0b0b",
  card: "#101010",
  border: "rgba(255,255,255,0.10)",
  soft: "rgba(255,255,255,0.70)",
  text: "rgba(255,255,255,0.92)",
  accent: "#d4af37",
  danger: "rgba(220, 38, 38, 0.18)",
  dangerBorder: "rgba(220, 38, 38, 0.35)",
};

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getUsage() {
  const key = `carx_websearch_${todayKey()}`;
  const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  const used = raw ? Number(raw) : 0;
  return { key, used: Number.isFinite(used) ? used : 0 };
}

function incUsage() {
  const { key, used } = getUsage();
  localStorage.setItem(key, String(used + 1));
  return used + 1;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function computeIq(item) {
  // הערכת שוק דמו (לוגיקה פשוטה ויציבה)
  const base = item.price * 0.87;
  const kmPenalty = (item.km / 1000) * 40;
  const handPenalty = (item.hand - 1) * 650;
  const fair = Math.max(0, Math.round(base - kmPenalty - handPenalty));

  const priceDiff = item.price - fair; // חיובי = יקר, שלילי = זול
  const scoreRaw = 70 - priceDiff / 500 - (item.km / 10000) - (item.hand - 1) * 1.5;
  const iq = clamp(Math.round(scoreRaw), 1, 100);

  let verdict = "סביר";
  if (iq >= 80) verdict = "מציאה";
  else if (iq >= 65) verdict = "טוב";
  else if (iq >= 45) verdict = "סביר";
  else verdict = "לא כדאי";

  const flags = [];
  if (item.hand >= 4) flags.push("ריבוי ידיים");
  if (item.km >= 140000) flags.push('ק"מ גבוה');
  if (priceDiff < -12000) flags.push("מתחת לשוק");
  if (priceDiff > 12000) flags.push("מעל שוק");

  return { iq, verdict, fair, flags, priceDiff };
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: BRAND.card,
        border: `1px solid ${BRAND.border}`,
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${BRAND.border}`,
        background: "rgba(255,255,255,0.03)",
        fontSize: 13,
        color: BRAND.soft,
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.text }}>{title}</div>
      {sub ? <div style={{ marginTop: 6, color: BRAND.soft }}>{sub}</div> : null}
    </div>
  );
}

function EliteCarList({ items, expanded, setExpanded }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item) => {
        const iqData = computeIq(item);
        const isOpen = expanded === item.id;
        return (
          <Card key={item.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  {item.title} · {item.year}
                </div>
                <div style={{ marginTop: 6, color: BRAND.soft }}>
                  {item.km.toLocaleString()} ק״מ · יד {item.hand} · {item.area}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Pill>
                    <b style={{ color: BRAND.accent }}>{iqData.iq}/100</b> · IQ · {iqData.verdict}
                  </Pill>
                  <Pill>הערכת שוק: ₪ {iqData.fair.toLocaleString()}</Pill>
                </div>
              </div>

              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: BRAND.accent }}>
                  ₪ {item.price.toLocaleString()}
                </div>
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => setExpanded(isOpen ? "" : item.id)}
                    style={{
                      borderRadius: 14,
                      padding: "10px 14px",
                      border: `1px solid ${BRAND.border}`,
                      background: "rgba(255,255,255,0.04)",
                      color: BRAND.text,
                      fontWeight: 700,
                    }}
                  >
                    {isOpen ? "סגור" : "פתח"}
                  </button>
                </div>
              </div>
            </div>

            {isOpen ? (
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    border: `1px solid ${BRAND.border}`,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: 240, objectFit: "cover" }}
                  />
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ color: BRAND.soft }}>איש קשר</div>
                    <div style={{ fontWeight: 800 }}>{item.phone}</div>
                  </div>

                  <div style={{ color: BRAND.soft }}>{item.notes}</div>

                  <Card style={{ padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>IQ Score</div>
                      <div style={{ fontWeight: 900, color: BRAND.accent }}>
                        {iqData.iq}/100 · {iqData.verdict}
                      </div>
                    </div>
                    <div style={{ marginTop: 10, color: BRAND.soft }}>
                      הערכת מחיר הוגן (דמו): ₪ {iqData.fair.toLocaleString()}
                    </div>
                    <div style={{ marginTop: 6, color: BRAND.soft }}>
                      דגלים: {iqData.flags.length ? iqData.flags.join(" · ") : "אין"}
                    </div>
                  </Card>
                </div>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

function WebSearch({ plan }) {
  const DAILY_LIMIT = 20;

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const remaining = useMemo(() => {
    if (plan === "VIP") return Infinity;
    const { used } = getUsage();
    return Math.max(0, DAILY_LIMIT - used);
  }, [plan]);

  async function runSearch() {
    const query = q.trim();
    if (!query) return;

    setErr("");
    setItems([]);

    // הגבלת ELITE ל-20 ביום (VIP ללא הגבלה)
    if (plan !== "VIP") {
      const { used } = getUsage();
      if (used >= DAILY_LIMIT) {
        setErr("הגעת למגבלה: 20 חיפושי רשת היום. שדרג ל-VIP כדי להסיר מגבלה.");
        return;
      }
    }

    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=1`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
      const j = await r.json();

      if (!r.ok || j?.error) {
        setErr(j?.error || "לא הצלחתי להביא תוצאות.");
        setLoading(false);
        return;
      }

      // count usage only on success
      if (plan !== "VIP") incUsage();

      const results = Array.isArray(j?.results) ? j.results : [];
      setItems(results);
      setLoading(false);
    } catch (e) {
      setErr("לא הצלחתי להביא תוצאות. בדוק שהאתר עלה וש-SERPAPI_KEY מוגדר ב-Vercel.");
      setLoading(false);
    }
  }

  return (
    <Card style={{ padding: 18 }}>
      <SectionTitle
        title="חיפוש רשת (כמו גוגל)"
        sub="תוצאות עם מקור גלוי ולינק החוצה. VIP: ללא הגבלה."
      />

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="לדוגמה: טויוטה קורולה 2015 יד 2"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 14,
            border: `1px solid ${BRAND.border}`,
            background: "rgba(255,255,255,0.03)",
            color: BRAND.text,
            outline: "none",
          }}
        />
        <button
          onClick={runSearch}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 14,
            border: "none",
            background: BRAND.accent,
            color: "#111",
            fontWeight: 900,
            minWidth: 92,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : "חפש"}
        </button>
      </div>

      <div style={{ marginTop: 10, color: BRAND.soft, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Pill>
          נשאר היום:{" "}
          <b style={{ color: BRAND.accent }}>
            {remaining === Infinity ? "∞" : remaining}
          </b>
        </Pill>
        <Pill>
          מצב: <b style={{ color: BRAND.accent }}>{plan}</b>
        </Pill>
      </div>

      {err ? (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 16,
            background: BRAND.danger,
            border: `1px solid ${BRAND.dangerBorder}`,
            color: "rgba(255,255,255,0.95)",
            fontWeight: 700,
          }}
        >
          {err}
        </div>
      ) : null}

      {items?.length ? (
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {items.map((it, idx) => (
            <Card key={idx} style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>{it.title}</div>
              {it.snippet ? (
                <div style={{ marginTop: 6, color: BRAND.soft, lineHeight: 1.4 }}>
                  {it.snippet}
                </div>
              ) : null}

              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ color: BRAND.soft }}>
                  מקור: <b style={{ color: BRAND.accent }}>{it.source || "web"}</b>
                </div>
                <a
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: BRAND.accent, fontWeight: 900, textDecoration: "none" }}
                >
                  פתח מקור
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export default function Page() {
  // החלפת מצב רק בשבילך (פשוט): אפשר לשנות ל-"VIP" וזהו.
  // אפשר גם להגיע עם: ?plan=VIP
  const [plan, setPlan] = useState(() => {
    if (typeof window === "undefined") return "ELITE";
    const url = new URL(window.location.href);
    const p = (url.searchParams.get("plan") || "").toUpperCase();
    return p === "VIP" ? "VIP" : "ELITE";
  });

  const [expanded, setExpanded] = useState("");

  const demoCars = [
    {
      id: "c1",
      title: "טויוטה קורולה",
      year: 2019,
      km: 82000,
      hand: 2,
      area: "מרכז",
      price: 74500,
      phone: "050-000-0000",
      notes: "יד ראשונה, היסטוריית טיפולים",
      image:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1400&q=60",
    },
    {
      id: "c2",
      title: "מאזדה 3",
      year: 2018,
      km: 105000,
      hand: 3,
      area: "דרום",
      price: 61900,
      phone: "050-000-0000",
      notes: "מצב מכני טוב, טסט ארוך",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=60",
    },
    {
      id: "c3",
      title: "יונדאי איוניק",
      year: 2020,
      km: 61000,
      hand: 1,
      area: "צפון",
      price: 89900,
      phone: "050-000-0000",
      notes: "חסכוני מאוד, שמור",
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=60",
    },
  ];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: BRAND.bg,
        color: BRAND.text,
        padding: 18,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button
            onClick={() => setPlan("ELITE")}
            style={{
              borderRadius: 16,
              padding: "10px 14px",
              border: `1px solid ${BRAND.border}`,
              background: "rgba(255,255,255,0.04)",
              color: BRAND.text,
              fontWeight: 800,
            }}
          >
            יציאה
          </button>

          <button
            onClick={() => setPlan("VIP")}
            style={{
              borderRadius: 16,
              padding: "10px 14px",
              border: `1px solid ${BRAND.border}`,
              background: "rgba(255,255,255,0.04)",
              color: BRAND.text,
              fontWeight: 800,
            }}
          >
            תשלום
          </button>
        </div>

        <div style={{ textAlign: "right", marginTop: 4 }}>
          <div style={{ fontSize: 34, fontWeight: 1000, letterSpacing: 1, color: BRAND.accent }}>
            CAR-X IQ Elite
          </div>
          <div style={{ marginTop: 6, color: BRAND.soft, fontSize: 18 }}>
            מודיעין רכבים. החלטות מהירות. גישה סגורה.
          </div>
        </div>

        <Card>
          <div style={{ fontSize: 22, fontWeight: 900, color: BRAND.accent }}>
            פתוח למנוי: {plan}
          </div>
          <div style={{ marginTop: 8, color: BRAND.soft, lineHeight: 1.5 }}>
            ELITE: 20 חיפושי רשת ביום · VIP: ללא הגבלה
          </div>
        </Card>

        <Card>
          <SectionTitle title="מנוע הצייד" sub="חיפוש במאגר הדמו." />
          <div style={{ color: BRAND.soft, marginBottom: 10 }}>
            פה נכנס חיפוש אמיתי. כרגע רשימת רכבים דמו לצורך UI.
          </div>
          <EliteCarList items={demoCars} expanded={expanded} setExpanded={setExpanded} />
        </Card>

        <WebSearch plan={plan} />

        <div style={{ textAlign: "center", color: BRAND.soft, marginTop: 6, paddingBottom: 18 }}>
          CAR-X IQ Elite · All Rights Reserved 2026 ©
        </div>
      </div>
    </main>
  );
}
