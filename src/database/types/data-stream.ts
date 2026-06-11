import type { dataStreams } from "../schema.ts";

export type DataStream = typeof dataStreams.$inferSelect;

export type DataStreamPost = typeof dataStreams.$inferInsert;
