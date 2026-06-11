import { app } from "./app.ts";
import { env } from "./env/index.ts";

app.listen({ port: env.PORT }, () => {
  return app.log.info({
    message: `Server is running on port ${env.PORT}`
  });
});
