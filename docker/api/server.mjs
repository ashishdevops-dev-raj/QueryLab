import http from "node:http";

const port = Number(process.env.PORT ?? 8080);

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }
  response.writeHead(501);
  response.end(
    JSON.stringify({
      message: "QueryLab API stub. Point the frontend at a real backend when ready.",
      path: request.url,
    }),
  );
});

server.listen(port, () => {
  console.log(`querylab-api stub listening on ${port}`);
});
