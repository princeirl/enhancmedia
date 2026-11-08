// Refuses a production deploy while launch details are still missing.
// Run automatically by `npm run deploy`.
import fs from "node:fs";

const problems = [];
const url = process.env.SITE_URL ?? "";
if (!/^https:\/\//.test(url)) problems.push("SITE_URL is not set to the https:// domain.");
const site = JSON.parse(fs.readFileSync("content/site.json", "utf8"));
if (!site.forms.turnstileSiteKey && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  problems.push("Spam-protection site key missing (forms.turnstileSiteKey or NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
if (fs.readFileSync("wrangler.jsonc", "utf8").includes("REPLACE-WITH-DOMAIN"))
  problems.push("wrangler.jsonc still contains REPLACE-WITH-DOMAIN.");
if (process.env.SITE_PREVIEW === "1") problems.push("SITE_PREVIEW=1 is set; that is a preview build.");
if (!site.brand.logoOnLight) problems.push("Official logo not configured (brand.logoOnLight); the interim wordmark is in use.");

if (problems.length) {
  console.error("Pre-launch check failed:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("Pre-launch check passed.");
