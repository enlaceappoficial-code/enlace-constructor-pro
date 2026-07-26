const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src");
const port = Number(process.env.PORT || 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function safeResolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0] || "/");
  const rel = clean.replace(/^\/+/, "");
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root)) return null;
  return abs;
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = req.url || "/";
    let filePath = safeResolve(urlPath);
    if (!filePath) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad request");
      return;
    }

    if (urlPath === "/" || urlPath === "/index.html") {
      // La aplicación de producción usa index.html + assets/index.js.
      // app.html se conserva solamente como fuente auxiliar histórica.
      filePath = path.join(root, "index.html");
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexHtml = path.join(filePath, "index.html");
      if (fs.existsSync(indexHtml)) {
        filePath = indexHtml;
      } else {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Servidor local activo: http://localhost:${port}/`);
  console.log(`Sirviendo carpeta: ${root}`);
});
