import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || 3000);
let aiUsageDay = new Date().toISOString().slice(0, 10);
let dailyAIRequests = 0;

function loadLocalEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[2].startsWith("#") || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
}

loadLocalEnv();

const recommendationSchema = {
  type: "object",
  properties: {
    reply: { type: "string" },
    mood: { type: "string", enum: ["inicio", "concentrarme", "subir el ánimo", "relajarme", "descubrir algo nuevo"] },
    tracks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          artist: { type: "string" },
          reason: { type: "string" }
        },
        required: ["title", "artist", "reason"],
        additionalProperties: false
      }
    }
  },
  required: ["reply", "mood", "tracks"],
  additionalProperties: false
};

function sendJson(response, status, value) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_000) throw new Error("request_too_large");
  }
  return JSON.parse(body || "{}");
}

async function handleChat(request, response) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "pega_tu_clave_aqui") {
    return sendJson(response, 503, { error: "assistant_not_configured" });
  }

  let payload;
  try {
    payload = await readJson(request);
  } catch {
    return sendJson(response, 400, { error: "invalid_request" });
  }

  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 700) : "";
  if (!message) return sendJson(response, 400, { error: "message_required" });

  const today = new Date().toISOString().slice(0, 10);
  if (today !== aiUsageDay) {
    aiUsageDay = today;
    dailyAIRequests = 0;
  }
  const dailyLimit = Math.max(1, Number(process.env.AI_DAILY_REQUEST_LIMIT || 100));
  if (dailyAIRequests >= dailyLimit) return sendJson(response, 429, { error: "daily_limit_reached" });
  dailyAIRequests += 1;

  const history = Array.isArray(payload.history)
    ? payload.history.slice(-8).filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
        .map((item) => ({ role: item.role, content: item.content.slice(0, 700) }))
    : [];

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6-astra",
        store: false,
        max_output_tokens: 600,
        instructions: "Eres Ritmo, una asistente musical amable que habla español. Recomienda cuatro canciones reales que encajen con lo que la persona pide. Escribe una respuesta breve y cálida, y explica cada elección en una frase. Marca el estado de ánimo más apropiado. No inventes enlaces ni afirmes que verificaste disponibilidad; la app abrirá búsquedas. No reproduzcas letras de canciones ni prometas que una canción está disponible en YouTube Music.",
        input: [...history.map(({ role, content }) => ({ role, content })), { role: "user", content: message }],
        text: {
          format: {
            type: "json_schema",
            name: "music_recommendations",
            strict: true,
            schema: recommendationSchema
          }
        }
      })
    });

    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error("OpenAI request failed with status", apiResponse.status);
      return sendJson(response, 502, { error: "assistant_unavailable" });
    }

    const outputText = result.output?.flatMap((item) => item.content || []).find((part) => part.type === "output_text")?.text || result.output_text;
    if (!outputText) return sendJson(response, 502, { error: "assistant_unavailable" });

    const answer = JSON.parse(outputText);
    const tracks = Array.isArray(answer.tracks) ? answer.tracks.slice(0, 4).map((track) => ({
      title: String(track.title || "").slice(0, 100),
      artist: String(track.artist || "").slice(0, 100),
      mood: String(track.reason || "Para ti").slice(0, 100),
      search: `${String(track.title || "")} ${String(track.artist || "")}`.trim()
    })).filter((track) => track.title && track.artist) : [];

    return sendJson(response, 200, {
      reply: String(answer.reply || "Encontré algunas canciones para ti.").slice(0, 500),
      mood: answer.mood || "descubrir algo nuevo",
      tracks
    });
  } catch {
    return sendJson(response, 502, { error: "assistant_unavailable" });
  }
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

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && url.pathname === "/healthz") return sendJson(response, 200, { status: "ok" });
  if (request.method === "POST" && url.pathname === "/api/chat") return handleChat(request, response);
  if (!["GET", "HEAD"].includes(request.method)) return sendJson(response, 405, { error: "method_not_allowed" });

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

