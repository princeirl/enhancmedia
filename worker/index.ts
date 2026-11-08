/**
 * Enhanc Media — site Worker.
 *
 * Serves the static site from `out/` and handles one dynamic route: POST /api/contact,
 * which validates an inquiry, checks it for spam and delivers it as an email to the
 * business mailbox. Nothing is stored.
 *
 * Configuration (wrangler.jsonc + secrets): see README → "Inquiry form".
 */
import { EmailMessage } from "cloudflare:email";
import { validateContact, type ContactInput } from "../lib/contact";

interface Env {
  ASSETS: Fetcher;
  SEND_EMAIL?: SendEmail;
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
  if (!env.SEND_EMAIL || !env.CONTACT_TO || !env.CONTACT_FROM || !env.TURNSTILE_SECRET) {
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

  const msg = new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, buildMime(result.data, env));
  await env.SEND_EMAIL.send(msg);
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
const noCrlf = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const encodeHeader = (s: string) =>
  /^[\x20-\x7E]*$/.test(s) ? s : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(s)))}?=`;

function buildMime(d: ContactInput, env: Env): string {
  const kind = d.intent === "consultation" ? "Consultation request" : "New inquiry";
  const subject = encodeHeader(noCrlf(`${kind}: ${d.name}${d.organization ? ` (${d.organization})` : ""} | ${d.service}`));
  const domain = env.CONTACT_FROM!.split("@")[1] ?? "localhost";
  const lines = [
    `${kind} received through the website.`,
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
  ];
  // Base64 body: safe for any characters and line lengths.
  const bodyB64 = btoa(String.fromCharCode(...new TextEncoder().encode(lines.join("\r\n"))))
    .replace(/.{76}/g, "$&\r\n");
  return [
    `From: ${encodeHeader("Enhanc Media Website")} <${env.CONTACT_FROM}>`,
    `To: <${env.CONTACT_TO}>`,
    `Reply-To: <${noCrlf(d.email)}>`,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    bodyB64,
  ].join("\r\n");
}

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
