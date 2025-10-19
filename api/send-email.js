const sgMail = require("@sendgrid/mail");

function setCors(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) {}
  }

  const { to, subject = "Message from Travoru", text, html } = body;
  if (!to) return res.status(400).json({ ok: false, error: "Missing 'to' field" });
  if (!text && !html) return res.status(400).json({ ok: false, error: "Provide 'text' or 'html' content" });

  const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@travoru.com";
  const FROM_NAME = process.env.FROM_NAME || "Travoru";
  const REPLY_TO  = process.env.REPLY_TO  || "hello@travoru.com";

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: "Server not configured (SENDGRID_API_KEY missing)" });

  try {
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO,
      subject,
      text: text || undefined,
      html: html || undefined,
      trackingSettings: { clickTracking: { enable: false, enableText: false } }
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    const msg = err?.response?.body || err?.message || "Send failed";
    return res.status(500).json({ ok: false, error: msg });
  }
};
