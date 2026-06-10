import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT }, () => {
  return app.log.info({
    message: `Server is running on port ${env.PORT}`
  });
});
