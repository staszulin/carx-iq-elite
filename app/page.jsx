export default function Page() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#0b0b0b",
      color: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>
      <div style={{
        maxWidth: 520,
        padding: 32,
        borderRadius: 18,
        background: "#111",
        boxShadow: "0 0 60px rgba(0,0,0,0.7)",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#d4af37", letterSpacing: 1 }}>
          CAR-X IQ Elite
        </h1>

        <p style={{ opacity: 0.85, marginTop: 12 }}>
          מערכת מודיעין חכמה לשוק הרכב בישראל<br />
          <strong>גישה סגורה · יתרון מוחלט</strong>
        </p>

        <div style={{
          marginTop: 28,
          padding: 22,
          border: "1px solid #333",
          borderRadius: 14,
          background: "#0f0f0f"
        }}>
          <p>🔒 גישה זמינה למנויים מאושרים בלבד</p>
          <p>💎 IQ Score · ניתוח עסקה · חיסכון בכסף</p>
        </div>

        <p style={{ marginTop: 30, fontSize: 12, opacity: 0.55 }}>
          © {new Date().getFullYear()} CAR-X IQ Elite<br />
          All Rights Reserved
        </p>
      </div>
    </main>
  );
}
