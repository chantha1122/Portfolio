export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 | Chantha Portfolio</title>

        <meta
          name="description"
          content="The requested page could not be found."
        />

        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 15% 15%, rgba(99,102,241,.18), transparent 35%), radial-gradient(circle at 85% 70%, rgba(34,211,238,.10), transparent 35%), #08091c",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                margin: "0 auto 28px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)",
                fontSize: "25px",
                fontWeight: 700,
                boxShadow: "0 15px 45px rgba(99,102,241,.28)",
              }}
            >
              C
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                letterSpacing: "0.18em",
                color: "#67e8f9",
                fontWeight: 700,
              }}
            >
              ERROR 404
            </p>

            <h1
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(42px, 8vw, 78px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              THIS PAGE GOT LOST.
            </h1>

            <p
              style={{
                maxWidth: "520px",
                margin: "24px auto 0",
                color: "#9ca3af",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              The page you are looking for does not exist, may have been moved,
              or the address may be incorrect.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "12px",
                marginTop: "32px",
              }}
            >
              <a
                href="/en"
                style={{
                  textDecoration: "none",
                  padding: "13px 22px",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                }}
              >
                Back Home
              </a>

              <a
                href="/en/projects"
                style={{
                  textDecoration: "none",
                  padding: "13px 22px",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(255,255,255,.05)",
                }}
              >
                View Projects
              </a>
            </div>

            <div
              style={{
                marginTop: "45px",
                padding: "16px 20px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.035)",
                color: "#6b7280",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            >
              chantha.portfolio / 404 / page-not-found
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
