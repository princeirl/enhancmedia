# Enhanc Media website — for agents and people working here

Read `README.md`. One rule above all others:

**Every change to the website lands on both sides — the site and the admin panel.** The admin
(github.com/princeirl/enhancmedia-admin) builds its forms from `content/_schema/`. A new page,
section, field or collection therefore means: its text in `content/`, its description in
`content/_schema/`, both in the same commit. No visible text or image path is written into a
component. `npm run check:content` enforces this and runs before every build.

The admin's code changes only when a new kind of field is needed (`lib/schema.mjs`, kept
byte-identical in both repositories).
