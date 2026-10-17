import { createServer } from "node:http";
import type { ServerResponse } from "node:http";
import { createCaseRepository } from "./cases/case.repository.js";
import { validateCreateCase } from "./cases/case.validation.js";
import { readFile } from "node:fs/promises";

const host = "127.0.0.1";
const port = 3000;
const repository = createCaseRepository();
const publicFiles = new Map([
  [
    "/",
    {
      file: new URL("../public/index.html", import.meta.url),
      contentType: "text/html; charset=utf-8",
    },
  ],
  [
    "/styles.css",
    {
      file: new URL("../public/styles.css", import.meta.url),
      contentType: "text/css; charset=utf-8",
    },
  ],
  [
    "/app.js",
    {
      file: new URL("../public/app.js", import.meta.url),
      contentType: "text/javascript; charset=utf-8",
    },
  ],
]);

// Общий способ отправить статус и данные в формате JSON.
function sendJson(
  response: ServerResponse,
  status: number,
  data: unknown,
): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(data));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    const path = url.pathname;
    const publicFile = publicFiles.get(path);

    if (publicFile) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.setHeader("Allow", "GET, HEAD");
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }

      const content = await readFile(publicFile.file);

      response.writeHead(200, {
        "Content-Type": publicFile.contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });

      response.end(request.method === "HEAD" ? undefined : content);
      return;
    }

    if (path === "/health") {
      if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }

      sendJson(response, 200, {
        status: "ok",
        service: "rehab-copilot",
      });
      return;
    }

    if (path === "/cases") {
      if (request.method === "GET") {
        const cases = repository.list();
        sendJson(response, 200, cases);
        return;
      }

      if (request.method === "POST") {
        const contentType = request.headers["content-type"]
          ?.split(";")[0]
          ?.trim()
          .toLowerCase();

        if (contentType !== "application/json") {
          sendJson(response, 415, {
            error: "Content-Type must be application/json",
          });
          return;
        }

        // Данные запроса могут приходить несколькими частями.
        request.setEncoding("utf8");

        let body = "";
        let size = 0;
        const maxBytes = 64 * 1024;

        for await (const chunk of request) {
          const text = String(chunk);
          size += Buffer.byteLength(text, "utf8");

          // Не накапливаем в памяти слишком большой запрос.
          if (size <= maxBytes) {
            body += text;
          }
        }

        if (size > maxBytes) {
          sendJson(response, 413, { error: "Request body is too large" });
          return;
        }

        let input: unknown;

        try {
          input = JSON.parse(body);
        } catch {
          sendJson(response, 400, { error: "Invalid JSON" });
          return;
        }

        const result = validateCreateCase(input);

        if (!result.success) {
          sendJson(response, 400, {
            error: "Validation failed",
            errors: result.errors,
          });
          return;
        }

        const saved = repository.create(result.data);

        response.setHeader("Location", `/cases/${saved.id}`);
        sendJson(response, 201, saved);
        return;
      }

      response.setHeader("Allow", "GET, POST");
      sendJson(response, 405, { error: "Method not allowed" });
      return;
    }

    if (path.startsWith("/cases/")) {
      if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }

      const id = path.slice("/cases/".length);
      const foundCase = repository.findById(id);

      if (foundCase === undefined) {
        sendJson(response, 404, { error: "Case not found" });
        return;
      }

      sendJson(response, 200, foundCase);
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    console.error("Request failed:", error);

    if (!response.headersSent && !response.destroyed) {
      sendJson(response, 500, { error: "Internal server error" });
    } else if (!response.destroyed) {
      response.destroy();
    }
  }
});

server.listen(port, host, () => {
  console.log(`Rehab Copilot running at http://${host}:${port}`);
});
