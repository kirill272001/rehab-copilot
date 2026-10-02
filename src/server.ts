import { createServer } from "node:http";
const host = "127.0.0.1";
const port = 3000;

const server = createServer((request, response) => {
  if (request.url === "/health") {
    if (request.method !== "GET") {
      response.writeHead(405, {
        "Content-Type": "application/json",
        Allow: "GET",
      });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    response.writeHead(200, {
      "Content-Type": "application/json",
    });

    response.end(
      JSON.stringify({
        status: "ok",
        service: "rehab-copilot",
      }),
    );
  } else {
    response.writeHead(404, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, host, () => {
  console.log(`Rehab Copilot running at http://${host}:${port}`);
});
