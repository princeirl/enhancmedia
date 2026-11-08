# Enhanc Media — website

The official website of Enhanc Media. It is built with Next.js, TypeScript and Tailwind CSS
as a **static export**, and served by a single Cloudflare Worker that also handles the inquiry
form. The brief and the stack decision live in the project records, at
`.project/plans/2026-11/2026-11-08-website-brief.md` and
`.project/memory/2026-11-08-stack-decision.md`.

```
app/            pages (App Router), sitemap, robots, social image, icon
components/     header, footer, logo, form, shared UI
content/        ALL editable content: site settings, services, industries, team, work, insights
lib/            content loading, SEO helper, form validation (shared with the Worker)
worker/         the Worker: serves out/ and handles POST /api/contact
public/         static files; public/brand/ for logo files; public/_headers for security headers
scripts/        pre-launch check
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local development at http://localhost:3000, with draft content shown |
| `npm run preview` | Preview build (drafts shown and labelled) served by the Worker at http://localhost:8787 |
| `npm run build` | Production build into `out/`; drafts and placeholders are left out |
| `npm run typecheck` | Type-checks the site and the Worker |
| `npm run check:launch` | Lists any launch details still missing |
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

All content is in `content/`. Changing it needs no knowledge of the components.

| What | File | Notes |
|---|---|---|
| Contact details, social links, booking link, logo files, legal name | `content/site.json` | `null` hides a field |
| Home page hero, introduction, approach, principles | `content/site.json` → `home`, `approach`, `principles` | |
| Services (7) | `content/services.json` | Each entry builds its own page at `/services/<slug>` |
| Industries (7) | `content/industries.json` | Each builds `/industries/<slug>`. `services` lists the related service slugs |
| Leadership (3 profiles) | `content/team.json` | Photos go in `public/team/`, e.g. `"photo": "/team/prince-yadav.jpg"`, ideally 4:5 at about 1200×1500 |
| Case studies | `content/work.json` | `category` must be one of the six portfolio categories. Images go in `public/work/<slug>/`. Leave `results` as `null` unless verified |
| Insights articles | `content/insights/<slug>.md` | Markdown with a front-matter block: title, category, date, status, excerpt, optional cover |

Adding a service, industry, project or article means adding an entry or file. Navigation,
footer, sitemap and related links update automatically.

A login-protected editing screen (a Git-based CMS working on these same files) is an open
decision in the project records. The file format was chosen so one can be added without
changing anything here.

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
- sends the inquiry as an email to the business mailbox, with Reply-To set to the visitor.

Nothing is stored. If any configuration is missing, the form returns a polite "temporarily
unavailable" message rather than failing silently.

To set it up, once the domain and mailbox exist:

1. Enable Email Routing on the domain and verify the destination mailbox.
2. In `wrangler.jsonc`, replace every `REPLACE-WITH-DOMAIN` (`send_email.destination_address`,
   `CONTACT_TO`, `CONTACT_FROM`, `ALLOWED_ORIGINS`).
3. Create a Turnstile widget for the domain. Put its **site key** in
   `content/site.json → forms.turnstileSiteKey`, or pass it as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   at build time. Store its **secret** with `npx wrangler secret put TURNSTILE_SECRET`, reading
   it from the vault. It is never committed.

For local testing, `.dev.vars` (git-ignored) holds the provider's public **test** keys. Build
with `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`. Local emails are written to
`.wrangler/tmp/email/` instead of being sent.

## Consultation booking

There is no scheduling account yet, so `/book-a-consultation` uses the same form in
"consultation" mode, with a preferred-times field. This is a real, working request, not a fake
calendar.

To connect a scheduling service:

1. Set `booking.url` in `content/site.json`. The page will then embed it, with a direct link
   as a fallback.
2. Add the scheduling service's origin to `frame-src` in `public/_headers`.

## Deployment

```bash
SITE_URL=https://<domain> npm run deploy
```

`SITE_URL` sets canonical URLs, the sitemap, robots.txt and social metadata. Security headers
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
- [ ] Email Routing, Turnstile and `wrangler.jsonc` configured; `npm run check:launch` passes
- [ ] Performance and accessibility audit on the deployed preview, on real phones and desktops
- [ ] Founder reviews every page of the preview build and gives final approval
