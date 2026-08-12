import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "out");
const BASE = "/siesta-altay";
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function stripBase(url) {
  const [pathname, search = ""] = url.split("?");
  const qs = search ? `?${search}` : "";

  if (pathname === BASE || pathname === `${BASE}/`) {
    return `/${qs}`;
  }
  if (pathname.startsWith(`${BASE}/`)) {
    return `${pathname.slice(BASE.length)}${qs}`;
  }
  return url;
}

function resolveFile(urlPath) {
  const clean = stripBase(urlPath).split("?")[0];
  const rel = clean === "/" ? "/index.html" : clean;
  const normalized = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(OUT, normalized);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, "index.html");
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  if (!path.extname(filePath) && fs.existsSync(`${filePath}.html`)) {
    return `${filePath}.html`;
  }

  const nestedIndex = path.join(filePath, "index.html");
  if (fs.existsSync(nestedIndex)) {
    return nestedIndex;
  }

  return null;
}

createServer((req, res) => {
  const url = req.url ?? "/";

  if (url === "/" || url === "") {
    res.writeHead(302, { Location: `${BASE}/` });
    res.end();
    return;
  }

  const filePath = resolveFile(url);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}${BASE}/`);
});
