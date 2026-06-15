import type { sensorDevices } from "../schema.js";

export type SensorDevice = typeof sensorDevices.$inferSelect;

export type SensorDevicePost = typeof sensorDevices.$inferInsert;
