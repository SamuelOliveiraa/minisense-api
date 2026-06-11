import type { measurementUnits } from "../schema.ts";

export type MeasurementUnit = typeof measurementUnits.$inferSelect;

export type MeasurementUnitPost = typeof measurementUnits.$inferInsert;
