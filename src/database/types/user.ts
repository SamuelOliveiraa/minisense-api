import type { users } from "../schema.ts";

export type User = typeof users.$inferSelect;

export type UserPost = typeof users.$inferInsert;
