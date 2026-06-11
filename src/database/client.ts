import { env } from "@/env/index.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/database/schema.ts";
import { Client } from "pg";

const connectionString = env.DATABASE_URL;

const client = new Client({ connectionString });

await client.connect();

export const db = drizzle(client, { schema });
