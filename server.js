import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || 3000);

function sendJson(response, status, value) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && url.pathname === "/healthz") return sendJson(response, 200, { status: "ok" });
  if (!(["GET", "HEAD"].includes(request.method))) return sendJson(response, 405, { error: "method_not_allowed" });

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  } catch {
    response.writeHead(400);
    return response.end("Bad request");
  }
  if (pathname.split("/").some((segment) => segment.startsWith("."))) {
    response.writeHead(404);
    return response.end("Not found");
  }
  const filePath = resolve(root, `.${pathname}`);
  const relativePath = relative(root, filePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    return response.end("Not found");
  }

  response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream", "cache-control": "no-cache" });
  if (request.method === "HEAD") return response.end();
  return response.end(readFileSync(filePath));
}).listen(port, "0.0.0.0", () => {
  console.log(`Ritmo is listening on port ${port}`);
});

