import { defineConfig } from "drizzle-kit";
import { env } from "./src/env/index.js";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  },
  schema: "./src/database/schema.ts",
  out: "./drizzle"
});
