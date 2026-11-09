// Validates every content file against content/_schema/ (see lib/schema.mjs).
// Runs before every build. It fails when:
//  - a schema is malformed or two schemas share an id or a file;
//  - a content file breaks its schema (missing, extra or wrongly typed fields, broken references,
//    images that do not exist in public/);
//  - a content file has no schema. Adding a page or a field to the website therefore means
//    describing it in content/_schema/ too, which is what makes it editable in the admin panel.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPath, validateDocument, validateSchema } from "../lib/schema.mjs";

const root = process.cwd();
const rel = (p) => path.relative(root, p).split(path.sep).join("/");
const schemaDir = path.join(root, "content", "_schema");
const problems = [];

const schemas = fs
  .readdirSync(schemaDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(schemaDir, f), "utf8"));
    } catch (e) {
      problems.push(`content/_schema/${f}: not valid JSON (${e.message})`);
      return null;
    }
  })
  .filter(Boolean);

const ids = new Set();
const covered = new Set();
for (const s of schemas) {
  problems.push(...validateSchema(s));
  if (ids.has(s.id)) problems.push(`schema id “${s.id}” is used twice`);
  ids.add(s.id);
  const target = s.file ?? s.folder;
  if (covered.has(target)) problems.push(`${target} is described by two schemas`);
  covered.add(target);
}

// ---------- Load every document ----------
const cache = new Map();
function readJson(file) {
  if (!cache.has(file)) cache.set(file, JSON.parse(fs.readFileSync(path.join(root, file), "utf8")));
  return cache.get(file);
}
const docs = []; // { schema, file, doc }
for (const s of schemas) {
  try {
    if (s.kind === "object" || s.kind === "list") docs.push({ schema: s, file: s.file, doc: readJson(s.file) });
    else if (s.kind === "markdown") {
      const { data, content } = matter(fs.readFileSync(path.join(root, s.file), "utf8"));
      docs.push({ schema: s, file: s.file, doc: { data, body: content } });
    } else if (s.kind === "markdown-folder") {
      for (const f of fs.readdirSync(path.join(root, s.folder)).filter((f) => f.endsWith(".md"))) {
        const file = `${s.folder}/${f}`;
        const { data, content } = matter(fs.readFileSync(path.join(root, file), "utf8"));
        // An unquoted date in front matter is read as a Date; the schema expects YYYY-MM-DD.
        for (const [k, v] of Object.entries(data)) if (v instanceof Date) data[k] = v.toISOString().slice(0, 10);
        docs.push({ schema: s, file, doc: { slug: f.replace(/\.md$/, ""), data, body: content } });
      }
    }
  } catch (e) {
    problems.push(`${s.file ?? s.folder}: cannot be read (${e.message})`);
  }
}

// ---------- Validate ----------
const byId = Object.fromEntries(schemas.map((s) => [s.id, s]));
const ctx = {
  lookup: (file, p) => getPath(readJson(file), p),
  keys: (id) => {
    const s = byId[id];
    if (!s) return [];
    if (s.kind === "list") return readJson(s.file).map((i) => i[s.item.key]);
    return docs.filter((d) => d.schema.id === id).map((d) => d.doc.slug);
  },
  imageExists: (p) => fs.existsSync(path.join(root, "public", decodeURI(p))),
};
for (const { schema, file, doc } of docs) {
  for (const e of validateDocument(schema, doc, ctx)) problems.push(`${file}: ${e}`);
}

// ---------- Every content file has a schema ----------
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "_schema" ? [] : walk(p);
    return /\.(json|md)$/.test(d.name) ? [rel(p)] : [];
  });
}
for (const file of walk(path.join(root, "content"))) {
  const ok = covered.has(file) || [...covered].some((c) => file.startsWith(c + "/"));
  if (!ok) problems.push(`${file}: has no schema in content/_schema/, so it cannot be edited in the admin panel`);
}

if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n - ` + problems.join("\n - "));
  process.exit(1);
}
console.log(`Content check passed: ${schemas.length} schemas, ${docs.length} documents.`);
