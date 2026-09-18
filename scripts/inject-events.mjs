import fs from "fs";

const path = "src/config/global.ts";
const jsonPath = "data/objects.customer.events.json";
const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const eventsBySlug = Object.fromEntries(j.objects.map((o) => [o.slug, o.events]));

function toTs(value, indent) {
  const pad = " ".repeat(indent);
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => `${pad}  ${toTs(v, indent + 2)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    const lines = keys.map((k) => {
      const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : JSON.stringify(k);
      return `${pad}  ${key}: ${toTs(value[k], indent + 2)}`;
    });
    return `{\n${lines.join(",\n")}\n${pad}}`;
  }
  return JSON.stringify(value);
}

let src = fs.readFileSync(path, "utf8");

for (const [slug, events] of Object.entries(eventsBySlug)) {
  const slugMarker = `slug: "${slug}"`;
  const slugIdx = src.indexOf(slugMarker);
  if (slugIdx < 0) {
    console.error("slug not found", slug);
    process.exit(1);
  }
  const after = src.slice(slugIdx);
  const updatedMatch = after.match(/updated_at: "[^"]+"/);
  if (!updatedMatch) {
    console.error("updated_at not found for", slug);
    process.exit(1);
  }
  const updatedAbs = slugIdx + updatedMatch.index + updatedMatch[0].length;
  const chunk = src.slice(slugIdx, updatedAbs);
  if (/\nevents:\s*\{/.test(chunk)) {
    console.log("skip existing", slug);
    continue;
  }
  const eventsTs = `,\n    events: ${toTs(events, 4)}`;
  src = src.slice(0, updatedAbs) + eventsTs + src.slice(updatedAbs);
  console.log("injected", slug);
}

fs.writeFileSync(path, src);
console.log("done");
