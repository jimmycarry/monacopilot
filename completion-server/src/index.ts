import { Hono } from "hono";
// import { rateLimiter } from "hono-rate-limiter";

// const limiter = rateLimiter({
//   limit: 2,
//   windowMs: 3000,
//   keyGenerator: (c) => c.req.header("x-api-key")!,
//   message: { message: "Request is cancelled" },
// });

const app = new Hono();
// app.use(limiter);

const lastRequestTime = new Map();

app.get("/", (c) => {
  return c.json({
    message: "Welcome to the rich-monaco-editor completion server",
  });
});

app.post("/run", async (c) => {
  const api_key = c.req.header("x-api-key");
  const now = Date.now();

  if (
    lastRequestTime.has(api_key) &&
    now - lastRequestTime.get(api_key) < 3000
  ) {
    return c.json({ message: "Request is cancelled" });
  }

  lastRequestTime.set(api_key, now);

  const { provider_api_endpoint, provider_body, provider_headers } =
    await c.req.json();

  const response = await fetch(provider_api_endpoint, {
    method: "POST",
    body: JSON.stringify(provider_body),
    headers: provider_headers,
  });

  const completion = await response.json();
  return c.json(completion);
});

export default app;
