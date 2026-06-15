import type { users } from "../schema.js";

export type User = typeof users.$inferSelect;

export type UserPost = typeof users.$inferInsert;
