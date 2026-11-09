# Enhanc Media — website

The official website of Enhanc Media. It is built with Next.js, TypeScript and Tailwind CSS
as a **static export**, and served by a single Cloudflare Worker that also handles the inquiry
form. The brief and the stack decision live in the project records, at
`.project/plans/2026-11/2026-11-08-website-brief.md` and
`.project/memory/2026-11-08-stack-decision.md`.

```
app/              pages (App Router), sitemap, robots, social image, icon
components/       header, footer, logo, form, shared UI — no visible text of their own
content/          ALL text, images and settings shown on the site (edited in the admin panel)
content/_schema/  the description of every content file: the contract with the admin panel
lib/              content loading, SEO helper, form validation (shared with the Worker), schema validator
worker/           the Worker: serves out/ and handles POST /api/contact
public/           static files; public/uploads/ for images added in the admin; public/_headers
scripts/          content check, pre-launch check
```

## The admin panel

Everything on the site is edited at **admin.enhancmedia.com** — a separate repository
(`codebase/admin/`, github.com/princeirl/enhancmedia-admin), deployed separately. It edits the
files in `content/` of this repository, on the branch `content-draft`:

1. An editor saves → a commit on `content-draft` → Cloudflare builds a preview version of the
   site on the branch's preview URL (about two minutes).
2. The editor presses **Publish** → `content-draft` is merged into `main` → the live site
   rebuilds. Publish is refused while the preview of those changes is building or has failed.

Editors sign in to the admin with their email and a one-time code. The draft preview is not
indexed by search engines; to make it editors-only as well, see Deployment.

### Adding or changing a page — the rule

Every change to the website must land on both sides. The admin has no page list of its own: it
builds its forms from `content/_schema/`. So:

- **No visible text or image path in components.** Put it in a content file, and read it with
  `page("<name>")`, `shared`, `navigation`, `forms` or `site` from `lib/content.ts`.
- **A new page** gets `content/pages/<name>.json` (with `seo` and `hero` like the others), a
  schema `content/_schema/page-<name>.json`, an entry in `pages` in `lib/content.ts`, and its URL
  in `app/sitemap.ts`.
- **A new field or section** is added to the content file *and* its schema, in the same commit.
- **A new collection** (a list of items, each with its own page) gets a schema of kind `list`
  (one JSON file) or `markdown-folder` (one Markdown file per item).
- `npm run check:content` (also run by every build) fails if a content file has no schema, a
  field is not described, or content breaks its schema. A website change that is not editable in
  the admin cannot be built.
- Once on `main`, the change appears in the admin by itself: the admin brings `main` into
  `content-draft` when it opens. **The admin's code changes only for a new kind of field.** The
  field types are listed in `lib/schema.mjs`; the admin carries an identical copy of that file
  (`npm run check:schema` there compares them).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local development at http://localhost:3000, with draft content shown |
| `npm run preview` | Preview build (drafts shown and labelled) served by the Worker at http://localhost:8787 |
| `npm run build` | Production build into `out/`; drafts and placeholders are left out |
| `npm run typecheck` | Type-checks the site and the Worker |
| `npm run check:content` | Validates every content file against `content/_schema/` (run by every build) |
| `npm run check:launch` | Lists any launch details still missing |
| `npm run build:ci` | Workers Builds build command: production build on `main`, preview build on other branches |
| `npm run deploy:ci` | Workers Builds deploy command: `wrangler deploy` on `main`, a preview version on other branches |
| `npm run deploy` | Runs the launch check, builds and deploys; it refuses while anything is missing |

## Drafts and placeholders

Every person, project and article has a `status`: `"draft"` or `"published"`.

- **The production build includes only `published` items.** Placeholders can never be published by accident.
- **The preview build** (`npm run preview`) shows drafts too. They are clearly labelled, a banner
  marks the build as not for publication, and search engines are told not to index it.
- Sections with nothing published are hidden on the home page: Selected Work and Insights. The
  Our Work and Insights pages show a short, honest note instead.

To publish an item, replace its placeholder fields with real, approved information and set
`"status": "published"`.

## Updating content

Normally in the admin panel. The files themselves, for reference:

| What | File |
|---|---|
| Site name, address, logo, sharing image, contact details, social links, booking link | `content/site.json` |
| Header menu, footer columns and links | `content/navigation.json` |
| Closing call to action, approach stages, principles, small labels | `content/shared.json` |
| Inquiry form labels and messages | `content/forms.json` |
| Each page's own text and search description | `content/pages/<page>.json` |
| Privacy Policy, Terms (Markdown; `## ` starts a numbered section) | `content/legal/*.md` |
| Services, industries, leadership, case studies | `content/services.json`, `industries.json`, `team.json`, `work.json` |
| Insights articles (Markdown with front matter) | `content/insights/<slug>.md` |
| Images added in the admin | `public/uploads/YYYY/MM/` |

Adding a service, industry, project or article means adding an entry or file. Navigation,
footer, sitemap and related links update automatically. Edits made directly to the files go
through git as usual; push them to `main` (or to `content-draft` to see them on the preview first).

The validation messages of the inquiry form (`lib/contact.ts`) and the Worker's replies stay in
code: they are shared with the Worker and checked on the server.

## Brand

- **Logo:** the official logo files have not been supplied yet. `components/Logo.tsx` shows a
  clearly marked typographic stand-in. When the files arrive, put them in `public/brand/` and
  set `brand.logoOnLight` and `brand.logoOnDark` in `content/site.json`. They then render
  unchanged.
- **Colours** are in `app/globals.css` (`@theme`), taken from the brief. Two accessible shades
  were added:
  - `muted #6A6A6A` for small secondary text on light backgrounds, where `#777777` falls just
    below a 4.5:1 contrast ratio;
  - `gold-ink #86694A` for small gold text on light backgrounds. `#B99A70` is kept for lines,
    marks and text on dark backgrounds.
- **Fonts:** Manrope for headings and Inter for body text. Both are downloaded at build time
  and served from our own domain.
- **Imagery:** abstract brand-coloured line compositions (`Artwork` in `components/ui.tsx`)
  stand in for photography. No stock images are used.

## Inquiry form

The browser checks every field before sending. The Worker then checks again and:

- accepts requests only from our own domain (`ALLOWED_ORIGINS`);
- requires JSON under 20 KB and rate-limits each IP address to 5 requests a minute;
- uses a hidden honeypot field and a human verification check (Cloudflare Turnstile);
- sends the inquiry as an email to the business mailbox, with Reply-To set to the visitor,
  through an email API (`worker/mail.ts`: Zoho ZeptoMail; Resend or Brevo work too, chosen by
  which key is set). The same file sends the admin panel's sign-in codes.

Nothing is stored. If any configuration is missing, the form returns a polite "temporarily
unavailable" message rather than failing silently.

To set it up, once the domain and mailbox exist:

1. In Zoho ZeptoMail (zeptomail.zoho.in), add and verify the domain `enhancmedia.com` (a DKIM
   TXT record and a bounce CNAME, added in Cloudflare DNS; the domain's Zoho Mail MX and SPF
   records stay as they are). Then Mail Agents → your agent → SMTP/API → API → copy the
   *Send Mail token*.
2. In the Cloudflare dashboard (Worker → Settings → Variables and Secrets) add the secret
   `ZEPTOMAIL_API_KEY` (the token, with or without its `Zoho-enczapikey` prefix) and the text variables `CONTACT_TO` (the mailbox that receives inquiries),
   `CONTACT_FROM` (an address on the verified domain, e.g. `website@enhancmedia.com`) and
   `ALLOWED_ORIGINS` (`https://www.enhancmedia.com,https://enhancmedia.com`). `wrangler.jsonc`
   has `keep_vars: true`, so deploys never remove them.
3. Create a Turnstile widget for the domain. Put its **site key** in
   `content/site.json → forms.turnstileSiteKey`, or pass it as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   at build time. Add its **secret** as the secret `TURNSTILE_SECRET` in the same dashboard
   page, from the vault. It is never committed.

For local testing, `.dev.vars` (git-ignored) holds the provider's public **test** keys. Build
with `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`. With a real `ZEPTOMAIL_API_KEY` in
`.dev.vars`, local tests send real emails. `ZEPTOMAIL_HOST` is only needed for an account outside
India (`api.zeptomail.com`, `api.zeptomail.eu`).

## Consultation booking

There is no scheduling account yet, so `/book-a-consultation` uses the same form in
"consultation" mode, with a preferred-times field. This is a real, working request, not a fake
calendar.

To connect a scheduling service:

1. Set `booking.url` in `content/site.json`. The page will then embed it, with a direct link
   as a fallback.
2. Add the scheduling service's origin to `frame-src` in `public/_headers`.

## Deployment

Cloudflare Workers Builds, connected to this repository (Worker `enhancmedia` →
Settings → Build). No deploy credentials or variables live in GitHub.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build:ci` |
| Deploy command | `npm run deploy:ci` |
| Non-production branch deploy command | `npm run deploy:ci` (not Cloudflare's default `npx wrangler preview` or `npx wrangler versions upload`) |
| Builds for non-production branches | on (the admin's `content-draft`) |

- A push to `main` (a Publish from the admin, or a code change) builds and deploys the live site.
- A push to `content-draft` (a save in the admin) builds a preview build (drafts shown, never
  indexed) and uploads it as a preview version, at
  `https://content-draft-enhancmedia.<account-subdomain>.workers.dev`. It is never indexed,
  but anyone with the address can open it. To restrict it, turn on Cloudflare Access for preview
  URLs (Worker → Settings → Domains & Routes → Preview URLs), or switch preview URLs off and
  check drafts locally.
- A build that fails the content check never deploys; the live site stays as it was.

Manual deploys still work: `npm run deploy` (with the launch check) or `npx wrangler deploy`
after `npm run build`.

The canonical address is `url` in `content/site.json` (`SITE_URL` overrides it at build time).
It sets canonical URLs, the sitemap, robots.txt and social metadata. Security headers
(HSTS, CSP, frame and referrer policies) are in `public/_headers`. The site is plain static
files plus one small Worker, so it can move to any host by copying `out/` and re-implementing
`/api/contact`.

## Before launch (brief §16 and §19)

Still needed from the founder:

- [ ] Official logo files (SVG and PNG) and any brand guidelines
- [ ] Founder photograph, short biography and profile link
- [ ] Two leadership profiles: name, designation, photograph, 10–15-word introduction
- [ ] Business email, phone, WhatsApp, social profiles; address, if it should be shown
- [ ] Domain name; legal entity name for the footer and legal pages
- [ ] Confirmation of every service description and FAQ (all are drafted for review)
- [ ] Genuine portfolio projects with client permission, and verified results only
- [ ] Testimonials: none are shown, and none will be until genuine, authorized ones are supplied
- [ ] Approval of the three draft Insights articles, or replacements
- [ ] Scheduling service, if wanted; analytics preference

Technical checks:

- [ ] Privacy Policy and Terms reviewed by legal counsel
- [ ] ZeptoMail domain, Turnstile and the dashboard variables configured; `npm run check:launch` passes
- [ ] Performance and accessibility audit on the deployed preview, on real phones and desktops
- [ ] Founder reviews every page of the preview build and gives final approval
