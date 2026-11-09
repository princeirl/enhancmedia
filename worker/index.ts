/**
 * Enhanc Media — site Worker.
 *
 * Serves the static site from `out/` and handles one dynamic route: POST /api/contact,
 * which validates an inquiry, checks it for spam and delivers it as an email to the
 * business mailbox. Nothing is stored.
 *
 * Configuration: variables in the Cloudflare dashboard — see README → "Inquiry form".
 * Email goes through an HTTP email API (worker/mail.ts: Zoho ZeptoMail; Resend or Brevo also work).
 */
import { validateContact, type ContactInput } from "../lib/contact";
import { mailProvider, sendMail } from "./mail";

interface Env {
  ASSETS: Fetcher;
  ZEPTOMAIL_API_KEY?: string; // secret: Zoho ZeptoMail Send Mail token
  ZEPTOMAIL_HOST?: string; // default api.zeptomail.in
  RESEND_API_KEY?: string; // secret, used if ZEPTOMAIL_API_KEY is not set
  BREVO_API_KEY?: string; // secret, used if neither is set
  CONTACT_LIMITER?: RateLimit;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  ALLOWED_ORIGINS?: string; // comma-separated, e.g. "https://www.example.com,https://example.com"
  TURNSTILE_SECRET?: string;
}

const MAX_BODY = 20_000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return json({ message: "Method not allowed." }, 405, { Allow: "POST" });
      try {
        return await handleContact(request, env);
      } catch (err) {
        console.error("contact: unexpected error", err instanceof Error ? err.message : String(err));
        return json({ message: "Something went wrong on our side. Please try again shortly." }, 500);
      }
    }
    if (url.pathname.startsWith("/api/")) return json({ message: "Not found." }, 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env): Promise<Response> {
  // Configuration must be complete before the form is accepted.
  if (!mailProvider(env) || !env.CONTACT_TO || !env.CONTACT_FROM || !env.TURNSTILE_SECRET) {
    console.error("contact: not configured");
    return json({ message: "Our inquiry form is temporarily unavailable. Please try again later." }, 503);
  }

  // Same-origin only
  const origin = request.headers.get("Origin");
  const allowed = (env.ALLOWED_ORIGINS ?? new URL(request.url).origin).split(",").map((s) => s.trim());
  if (!origin || !allowed.includes(origin)) return json({ message: "Forbidden." }, 403);

  if (!(request.headers.get("Content-Type") ?? "").includes("application/json"))
    return json({ message: "Unsupported content type." }, 415);

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) return json({ message: "Too many requests. Please wait a minute and try again." }, 429);
  }

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ message: "Your message is too long." }, 413);
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("not an object");
  } catch {
    return json({ message: "Invalid request." }, 400);
  }

  // Honeypot: pretend success so automated senders learn nothing.
  if (typeof raw.website === "string" && raw.website.trim() !== "") return json({ ok: true }, 200);

  const result = validateContact(raw);
  if (!result.ok) return json({ errors: result.errors }, 422);

  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : "";
  if (!(await verifyTurnstile(token, ip, env.TURNSTILE_SECRET)))
    return json({ message: "We could not verify that you are human. Please try again." }, 400);

  const d = result.data;
  const sent = await sendMail(env, {
    from: env.CONTACT_FROM,
    fromName: "Enhanc Media Website",
    to: env.CONTACT_TO,
    replyTo: d.email,
    subject: subjectFor(d),
    text: bodyFor(d),
  });
  if (!sent.ok) {
    console.error("contact: email not sent", sent.error);
    return json({ message: "We could not send your message just now. Please try again in a few minutes." }, 502);
  }
  return json({ ok: true }, 200);
}

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip !== "unknown") body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

// ---------- Email ----------
function subjectFor(d: ContactInput): string {
  const kind = d.intent === "consultation" ? "Consultation request" : "New inquiry";
  return `${kind}: ${d.name}${d.organization ? ` (${d.organization})` : ""} | ${d.service}`;
}

function bodyFor(d: ContactInput): string {
  const kind = d.intent === "consultation" ? "Consultation request" : "New inquiry";
  return [
    `${kind} received through the website. Reply to this email to answer ${d.name} directly.`,
    "",
    `Name:               ${d.name}`,
    `Organization:       ${d.organization || "—"}`,
    `Email:              ${d.email}`,
    `Phone:              ${d.phone || "—"}`,
    `Country:            ${d.country}`,
    `Service:            ${d.service}`,
    `Budget:             ${d.budget || "—"}`,
    `Preferred contact:  ${d.contactMethod}`,
    ...(d.intent === "consultation" ? [`Preferred times:    ${d.preferredTimes || "—"}`] : []),
    `Consent given:      yes`,
    "",
    "Message:",
    d.message,
    "",
    `Received: ${new Date().toISOString()}`,
  ].join("\n");
}

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
