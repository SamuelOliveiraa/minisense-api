import type { measurementUnits } from "../schema.js";

export type MeasurementUnit = typeof measurementUnits.$inferSelect;

export type MeasurementUnitPost = typeof measurementUnits.$inferInsert;
