import type { users } from "../schema";

export type User = typeof users.$inferSelect;

export type UserPost = typeof users.$inferInsert;
