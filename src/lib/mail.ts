import nodemailer from "nodemailer";

/* =========================================================
   ENV
   ========================================================= */

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

/* =========================================================
   TRANSPORTER
   ========================================================= */

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || "465");

  const secure =
    String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";

  return nodemailer.createTransport({
    host: requiredEnv("SMTP_HOST"),

    port,

    secure,

    auth: {
      user: requiredEnv("SMTP_USER"),

      pass: requiredEnv("SMTP_PASS"),
    },
  });
}

/* =========================================================
   HELPERS
   ========================================================= */

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function getPortfolioUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

/* =========================================================
   NEW CONTACT NOTIFICATION
   Sent to portfolio owner
   ========================================================= */

export async function sendContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;

  email: string;

  subject: string | null;

  message: string;
}) {
  const transporter = createTransporter();

  const from = requiredEnv("CONTACT_FROM_EMAIL");

  const to = requiredEnv("CONTACT_TO_EMAIL");

  const safeName = escapeHtml(name);

  const safeEmail = escapeHtml(email);

  const safeSubject = escapeHtml(subject || "No subject");

  const safeMessage = textToHtml(message);

  const dashboardUrl = `${getPortfolioUrl()}/en/dashboard/messages`;

  await transporter.sendMail({
    from: `"Chantha Portfolio" <${from}>`,

    to,

    replyTo: email,

    subject: `New portfolio message — ${subject || name}`,

    text: [
      "NEW PORTFOLIO MESSAGE",
      "",
      `From: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject || "No subject"}`,
      "",
      "Message:",
      message,
    ].join("\n"),

    html: `
      <!doctype html>
      <html>
        <body
          style="
            margin:0;
            padding:0;
            background:#f5f6ff;
            font-family:Arial,Helvetica,sans-serif;
            color:#17192d;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              width:100%;
              background:#f5f6ff;
              padding:36px 16px;
            "
          >
            <tr>
              <td align="center">

                <table
                  width="620"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    width:100%;
                    max-width:620px;
                    background:#ffffff;
                    border:1px solid #e6e7f2;
                    border-radius:22px;
                    overflow:hidden;
                    box-shadow:0 14px 50px rgba(45,39,110,.08);
                  "
                >

                  <!-- HEADER -->

                  <tr>
                    <td
                      style="
                        padding:30px 32px;
                        background:
                          linear-gradient(
                            135deg,
                            #7048ff 0%,
                            #4e6fff 55%,
                            #27c5e5 100%
                          );
                        color:#ffffff;
                      "
                    >
                      <div
                        style="
                          font-size:11px;
                          font-weight:700;
                          letter-spacing:2px;
                          opacity:.82;
                          margin-bottom:8px;
                        "
                      >
                        CHANTHA PORTFOLIO
                      </div>

                      <div
                        style="
                          font-size:27px;
                          font-weight:700;
                          line-height:1.2;
                        "
                      >
                        New Contact Message
                      </div>

                      <div
                        style="
                          margin-top:8px;
                          font-size:13px;
                          line-height:1.6;
                          opacity:.86;
                        "
                      >
                        Someone submitted a message from your Get In Touch section.
                      </div>
                    </td>
                  </tr>

                  <!-- CONTENT -->

                  <tr>
                    <td style="padding:30px 32px;">

                      <div
                        style="
                          padding:20px;
                          border:1px solid #e8e8f4;
                          border-radius:16px;
                          background:#f8f8ff;
                        "
                      >

                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td
                              style="
                                padding-bottom:14px;
                                font-size:12px;
                                color:#777b91;
                                width:90px;
                              "
                            >
                              Name
                            </td>

                            <td
                              style="
                                padding-bottom:14px;
                                font-size:14px;
                                font-weight:700;
                                color:#17192d;
                              "
                            >
                              ${safeName}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding-bottom:14px;
                                font-size:12px;
                                color:#777b91;
                              "
                            >
                              Email
                            </td>

                            <td style="padding-bottom:14px;">
                              <a
                                href="mailto:${safeEmail}"
                                style="
                                  font-size:14px;
                                  color:#6548e8;
                                  text-decoration:none;
                                "
                              >
                                ${safeEmail}
                              </a>
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                font-size:12px;
                                color:#777b91;
                              "
                            >
                              Subject
                            </td>

                            <td
                              style="
                                font-size:14px;
                                color:#17192d;
                              "
                            >
                              ${safeSubject}
                            </td>
                          </tr>
                        </table>
                      </div>

                      <div
                        style="
                          margin-top:26px;
                          margin-bottom:9px;
                          font-size:12px;
                          font-weight:700;
                          letter-spacing:.8px;
                          color:#777b91;
                          text-transform:uppercase;
                        "
                      >
                        Message
                      </div>

                      <div
                        style="
                          border-left:3px solid #714cff;
                          border-radius:0 14px 14px 0;
                          background:#fafaff;
                          padding:18px 20px;
                          font-size:14px;
                          line-height:1.8;
                          color:#34364a;
                        "
                      >
                        ${safeMessage}
                      </div>

                      <!-- ACTIONS -->

                      <table
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="margin-top:28px;"
                      >
                        <tr>

                          <td style="padding-right:10px;">
                            <a
                              href="mailto:${safeEmail}?subject=${encodeURIComponent(
                                `Re: ${subject || "Portfolio message"}`,
                              )}"
                              style="
                                display:inline-block;
                                padding:12px 18px;
                                border-radius:11px;
                                background:#7048ff;
                                color:#ffffff;
                                font-size:13px;
                                font-weight:700;
                                text-decoration:none;
                              "
                            >
                              Reply by Email
                            </a>
                          </td>

                          <td>
                            <a
                              href="${dashboardUrl}"
                              style="
                                display:inline-block;
                                padding:11px 18px;
                                border:1px solid #dedfec;
                                border-radius:11px;
                                color:#46495d;
                                font-size:13px;
                                font-weight:700;
                                text-decoration:none;
                              "
                            >
                              Open Dashboard
                            </a>
                          </td>

                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- FOOTER -->

                  <tr>
                    <td
                      style="
                        padding:20px 32px;
                        border-top:1px solid #eeeeF6;
                        background:#fbfbfe;
                        font-size:11px;
                        line-height:1.6;
                        color:#9295a7;
                      "
                    >
                      This message was submitted through the
                      Get In Touch form on Chantha Portfolio.
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

/* =========================================================
   REPLY TO VISITOR
   ========================================================= */

export async function sendContactReplyEmail({
  to,
  visitorName,
  originalSubject,
  reply,
}: {
  to: string;

  visitorName: string;

  originalSubject: string | null;

  reply: string;
}) {
  const transporter = createTransporter();

  const from = requiredEnv("CONTACT_FROM_EMAIL");

  const safeName = escapeHtml(visitorName);

  const safeReply = textToHtml(reply);

  const subject = originalSubject
    ? `Re: ${originalSubject}`
    : "Reply from Chantha";

  await transporter.sendMail({
    from: `"Chantha" <${from}>`,

    to,

    subject,

    text: [
      `Hello ${visitorName},`,
      "",
      reply,
      "",
      "Best regards,",
      "Chantha",
    ].join("\n"),

    html: `
      <!doctype html>
      <html>
        <body
          style="
            margin:0;
            padding:0;
            background:#f5f6ff;
            font-family:Arial,Helvetica,sans-serif;
            color:#17192d;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              width:100%;
              background:#f5f6ff;
              padding:36px 16px;
            "
          >
            <tr>
              <td align="center">

                <table
                  width="620"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    width:100%;
                    max-width:620px;
                    overflow:hidden;
                    border:1px solid #e6e7f2;
                    border-radius:22px;
                    background:#ffffff;
                    box-shadow:0 14px 50px rgba(45,39,110,.08);
                  "
                >

                  <!-- TOP ACCENT -->

                  <tr>
                    <td
                      style="
                        height:6px;
                        background:
                          linear-gradient(
                            90deg,
                            #7048ff,
                            #4e6fff,
                            #27c5e5
                          );
                      "
                    ></td>
                  </tr>

                  <!-- BODY -->

                  <tr>
                    <td style="padding:34px 34px 30px;">

                      <div
                        style="
                          font-size:11px;
                          font-weight:700;
                          letter-spacing:1.8px;
                          color:#7048ff;
                          margin-bottom:20px;
                        "
                      >
                        CHANTHA PORTFOLIO
                      </div>

                      <div
                        style="
                          font-size:20px;
                          font-weight:700;
                          color:#17192d;
                        "
                      >
                        Hello ${safeName},
                      </div>

                      <div
                        style="
                          margin-top:22px;
                          padding:20px 22px;
                          border:1px solid #e9e9f3;
                          border-radius:16px;
                          background:#fafaff;
                          font-size:14px;
                          line-height:1.9;
                          color:#34364a;
                        "
                      >
                        ${safeReply}
                      </div>

                      <div
                        style="
                          margin-top:30px;
                          font-size:14px;
                          line-height:1.7;
                          color:#626579;
                        "
                      >
                        Best regards,
                        <br />

                        <strong
                          style="
                            color:#17192d;
                            font-size:15px;
                          "
                        >
                          Chantha
                        </strong>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER -->

                  <tr>
                    <td
                      style="
                        border-top:1px solid #eeeeF6;
                        background:#fbfbfe;
                        padding:18px 34px;
                        font-size:11px;
                        color:#9799aa;
                      "
                    >
                      Sent from Chantha Portfolio
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
      </html>
    `,
  });
}
