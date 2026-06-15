import type { dataStreams } from "../schema.js";

export type DataStream = typeof dataStreams.$inferSelect;

export type DataStreamPost = typeof dataStreams.$inferInsert;
