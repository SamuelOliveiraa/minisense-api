import { db } from "@/database/client.ts";
import { sensorDevices } from "@/database/schema.ts";
import type {
  SensorDevice,
  SensorDevicePost
} from "@/database/types/sensor-device.ts";
import { eq } from "drizzle-orm";

export class SensorDeviceModel {
  async index(): Promise<SensorDevice[]> {
    return await db.select().from(sensorDevices).orderBy(sensorDevices.label);
  }

  async findById(id: string): Promise<SensorDevice | null> {
    const sensorDeviceData = await db.query.sensorDevices.findFirst({
      where: eq(sensorDevices.id, id)
    });

    return sensorDeviceData || null;
  }

  async findByKey(key: string): Promise<SensorDevice | null> {
    const sensorDeviceData = await db.query.sensorDevices.findFirst({
      where: eq(sensorDevices.key, key)
    });

    return sensorDeviceData || null;
  }

  async delete(id: string): Promise<SensorDevice | null> {
    const deletedSensorDevice = await db
      .delete(sensorDevices)
      .where(eq(sensorDevices.id, id))
      .returning();

    return deletedSensorDevice[0] || null;
  }

  async create({
    label,
    description,
    userId
  }: SensorDevicePost): Promise<SensorDevice | null> {
    const newSensorDevice = await db
      .insert(sensorDevices)
      .values({ label, description, userId })
      .returning();

    return newSensorDevice[0] || null;
  }
}
