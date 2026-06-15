import type { sensorData } from "../schema.js";

export type SensorData = typeof sensorData.$inferSelect;

export type SensorDataPost = typeof sensorData.$inferInsert;
