import type { measurementUnits } from "../schema";

export type MeasurementUnit = typeof measurementUnits.$inferSelect;

export type MeasurementUnitPost = typeof measurementUnits.$inferInsert;
