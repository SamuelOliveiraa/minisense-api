import type { sensorDevices } from "../schema.ts";

export type SensorDevice = typeof sensorDevices.$inferSelect;

export type SensorDevicePost = typeof sensorDevices.$inferInsert;
