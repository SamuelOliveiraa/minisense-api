import type { sensorData } from "../schema.ts";

export type SensorData = typeof sensorData.$inferSelect;

export type SensorDataPost = typeof sensorData.$inferInsert;
