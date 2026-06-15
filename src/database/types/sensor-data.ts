import type { sensorData } from "../schema";

export type SensorData = typeof sensorData.$inferSelect;

export type SensorDataPost = typeof sensorData.$inferInsert;
