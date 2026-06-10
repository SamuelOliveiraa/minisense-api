import { config } from "dotenv";
import { z } from "zod";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

config({ path: envFile });

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev")
});

const envConfig = envSchema.safeParse(process.env);

if (envConfig.success === false) {
  console.error("Invalid enviroment variables", envConfig.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = envConfig.data;
