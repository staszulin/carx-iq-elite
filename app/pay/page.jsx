export default function PayPage() {
  const bitLink = "שים-כאן-קישור-bit-שלך";
  const payboxLink = "שים-כאן-קישור-paybox-שלך";

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#f5f5f5", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 18 }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-block", marginTop: 10, background: "#111", border: "1px solid #333", padding: "10px 14px", borderRadius: 12, color: "#f5f5f5", fontWeight: 700 }}>
          חזרה
        </a>

        <div style={{ marginTop: 18, background: "#111", border: "1px solid #333", borderRadius: 18, padding: 22, boxShadow: "0 0 60px rgba(0,0,0,0.7)" }}>
          <h1 style={{ margin: 0, color: "#d4af37", letterSpacing: 1 }}>תשלום למנוי Elite</h1>
          <p style={{ opacity: 0.85, marginTop: 10, lineHeight: 1.5 }}>
            התשלום הולך רק אליך.  
            אחרי התשלום אתה שולח ללקוח <b>קוד גישה</b> (לדוגמה: ELITE-2026).
          </p>

          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            <a href={bitLink} target="_blank" rel="noreferrer"
               style={{ textDecoration: "none", background: "#0f0f0f", border: "1px solid #333", padding: 14, borderRadius: 14, color: "#f5f5f5", fontWeight: 900 }}>
              לתשלום ב-bit
            </a>

            <a href={payboxLink} target="_blank" rel="noreferrer"
               style={{ textDecoration: "none", background: "#0f0f0f", border: "1px solid #333", padding: 14, borderRadius: 14, color: "#f5f5f5", fontWeight: 900 }}>
              לתשלום ב-PayBox
            </a>
          </div>

          <div style={{ marginTop: 16, opacity: 0.75, fontSize: 13, lineHeight: 1.5 }}>
            טיפ: תכתוב בוואטסאפ ללקוח:  
            “שילמת? הנה הקוד שלך: <b>ELITE-2026</b>”.
          </div>
        </div>
      </div>
    </main>
  );
}
