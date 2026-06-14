import { app } from "./app.ts";
import { env } from "./env/index.ts";

// Local development
async function startServer() {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info({
      message: `Server is running on port ${env.PORT}`
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Vercel handler
export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit("request", req, res);
}

if (env.NODE_ENV !== "production") {
  startServer();
}
