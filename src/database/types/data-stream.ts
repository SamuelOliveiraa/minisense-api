import type { dataStreams } from "../schema";

export type DataStream = typeof dataStreams.$inferSelect;

export type DataStreamPost = typeof dataStreams.$inferInsert;
