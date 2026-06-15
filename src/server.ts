import { app } from "./app.js";
import { env } from "./env/index.js";

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

startServer();
