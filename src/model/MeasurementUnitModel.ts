import { db } from "@/database/client";
import { measurementUnits } from "@/database/schema";
import type {
  MeasurementUnit,
  MeasurementUnitPost
} from "@/database/types/measurement-unit";
import { asc, eq } from "drizzle-orm";

export class MeasurementUnitModel {
  async index(): Promise<MeasurementUnit[]> {
    return await db
      .select()
      .from(measurementUnits)
      .orderBy(asc(measurementUnits.description));
  }

  async findById(id: string): Promise<MeasurementUnit | null> {
    const measurementUnitData = await db.query.measurementUnits.findFirst({
      where: eq(measurementUnits.id, id)
    });

    return measurementUnitData || null;
  }

  async delete(id: string): Promise<MeasurementUnit | null> {
    const deletedMeasurementUnit = await db
      .delete(measurementUnits)
      .where(eq(measurementUnits.id, id))
      .returning();

    return deletedMeasurementUnit[0] || null;
  }

  async create({
    symbol,
    description
  }: MeasurementUnitPost): Promise<MeasurementUnit | null> {
    const newMeasurementUnit = await db
      .insert(measurementUnits)
      .values({ description, symbol })
      .returning();

    return newMeasurementUnit[0] || null;
  }

  async update(
    id: string,
    { description, symbol }: MeasurementUnitPost
  ): Promise<MeasurementUnit | null> {
    const updatedMeasurementUnit = await db
      .update(measurementUnits)
      .set({ description, symbol })
      .where(eq(measurementUnits.id, id))
      .returning();

    return updatedMeasurementUnit[0] || null;
  }
}
