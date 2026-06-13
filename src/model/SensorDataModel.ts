import { db } from "@/database/client.ts";
import { sensorData } from "@/database/schema.ts";
import type {
  SensorData,
  SensorDataPost
} from "@/database/types/sensor-data.ts";
import { count, desc, eq } from "drizzle-orm";

export class SensorDataModel {
  async countByStreamId(streamId: string): Promise<number> {
    const total = await db
      .select({ count: count() })
      .from(sensorData)
      .where(eq(sensorData.streamId, streamId));

    return total[0]?.count ?? 0;
  }

  async findByStreamId(streamId: string): Promise<SensorData[]> {
    return db
      .select()
      .from(sensorData)
      .where(eq(sensorData.streamId, streamId))
      .orderBy(desc(sensorData.timestamp));
  }

  async findLatestByStreamId(
    streamId: string,
    limit = 5
  ): Promise<SensorData[]> {
    return db
      .select()
      .from(sensorData)
      .where(eq(sensorData.streamId, streamId))
      .orderBy(desc(sensorData.timestamp))
      .limit(limit);
  }

  async create({
    timestamp,
    value,
    streamId
  }: SensorDataPost): Promise<SensorData | null> {
    const sensorMeasurement = await db
      .insert(sensorData)
      .values({
        timestamp,
        value,
        streamId
      })
      .returning();

    return sensorMeasurement[0] || null;
  }
}
