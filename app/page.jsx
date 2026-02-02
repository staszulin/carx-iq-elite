"use client";

import { useEffect, useMemo, useState } from "react";

const BRAND = {
  name: "CAR-X IQ Elite",
  accent: "#d4af37",
};

const ACCESS_CODES = [
  // כאן אתה מחליט קודים למנויים. אפשר להחליף בכל רגע.
  "ELITE-2026",
  "VIP-9999",
];

function isValidCode(code) {
  const c = String(code || "").trim().toUpperCase();
  return ACCESS_CODES.includes(c);
}

export default function Page() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("carx_access") || "";
    if (isValidCode(saved)) setUnlocked(true);
  }, []);

  function unlock() {
    const c = String(code || "").trim().toUpperCase();
    if (!c) return setMsg("תכתוב קוד ואז לחץ כניסה");
    if (!isValidCode(c)) return setMsg("קוד לא נכון. אחרי תשלום תקבל קוד גישה.");
    localStorage.setItem("carx_access", c);
    setUnlocked(true);
    setMsg("");
  }

  function logout() {
    localStorage.removeItem("carx_access");
    setUnlocked(false);
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
          <div
            style={{
              marginTop: 18,
              background: "#111",
              border: "1px solid #333",
              borderRadius: 18,
              padding: 22,
              boxShadow: "0 0 60px rgba(0,0,0,0.7)",
            }}
          >
            <h1 style={{ margin: 0, color: BRAND.accent, letterSpacing: 1 }}>גישה ל-Elite</h1>
            <p style={{ opacity: 0.85, marginTop: 10, lineHeight: 1.5 }}>
              כדי להיכנס צריך <b>קוד גישה</b>. אחרי תשלום אתה מקבל קוד.  
              זה מוצר פרימיום, לא “לוח”.
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

            <div style={{ marginTop: 18, opacity: 0.7, fontSize: 13 }}>
              עדיין לא שילמת? לחץ למעלה על <b>תשלום</b>.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            <div style={{ background: "#111", border: "1px solid #333", borderRadius: 18, padding: 18 }}>
              <div style={{ color: BRAND.accent, fontWeight: 900, letterSpacing: 1 }}>פתוח למנוי Elite</div>
              <div style={{ opacity: 0.85, marginTop: 8 }}>
                כרגע זה MVP נעול עם קוד. בשלב הבא נוסיף: חיפוש, IQ Score, ניתוח עסקה, ניהול מנויים אוטומטי.
              </div>
            </div>

            <div style={{ background: "#0f0f0f", border: "1px solid #333", borderRadius: 18, padding: 18 }}>
              <div style={{ fontWeight: 900 }}>מנוע הצייד (דמו)</div>
              <div style={{ opacity: 0.8, marginTop: 10, lineHeight: 1.5 }}>
                פה ייכנס חיפוש אמיתי. כרגע אתה בפנים והנעילה עובדת.
              </div>
            </div>
          </div>
        )}

        <footer style={{ marginTop: 26, opacity: 0.55, fontSize: 12, padding: "0 6px 20px" }}>
          © {new Date().getFullYear()} CAR-X IQ Elite · All Rights Reserved
        </footer>
      </div>
    </main>
  );
}
