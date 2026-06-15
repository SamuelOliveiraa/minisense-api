import { env } from "@/env/index";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/database/schema";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 1
});

export const db = drizzle(pool, { schema });
