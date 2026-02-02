export const metadata = {
  title: "CAR-X IQ Elite",
  description: "Car intelligence platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, background: "#0b0b0b" }}>
        {children}
      </body>
    </html>
  );
}
