// Build and deploy commands for Cloudflare Workers Builds, chosen by branch.
//   node scripts/ci.mjs build    — main: production build; any other branch: preview build (drafts shown, not indexed)
//   node scripts/ci.mjs deploy   — main: `wrangler deploy`; any other branch: `wrangler versions upload` (a preview version)
// Workers Builds sets WORKERS_CI_BRANCH. Locally, pass BRANCH=... to try either path.
import { execSync } from "node:child_process";

const branch = process.env.WORKERS_CI_BRANCH || process.env.BRANCH || "main";
const prod = branch === "main";
const step = process.argv[2];
const run = (cmd) => {
  console.log(`[${branch}] ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

if (step === "build") run(prod ? "npm run build" : "npm run build:preview");
else if (step === "deploy") {
  const alias = branch.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 40);
  run(prod ? "npx wrangler deploy" : `npx wrangler versions upload --preview-alias ${alias}`);
} else {
  console.error("usage: node scripts/ci.mjs build|deploy");
  process.exit(1);
}
