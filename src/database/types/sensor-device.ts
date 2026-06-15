import type { sensorDevices } from "../schema";

export type SensorDevice = typeof sensorDevices.$inferSelect;

export type SensorDevicePost = typeof sensorDevices.$inferInsert;
