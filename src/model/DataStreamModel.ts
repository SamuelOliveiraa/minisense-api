import { db } from "@/database/client.js";
import { dataStreams } from "@/database/schema.js";
import type {
  DataStream,
  DataStreamPost
} from "@/database/types/data-stream.js";
import { and, asc, eq } from "drizzle-orm";

export class DataStreamModel {
  async index(): Promise<DataStream[]> {
    return await db.select().from(dataStreams).orderBy(asc(dataStreams.label));
  }

  async findByDeviceId(deviceId: string): Promise<DataStream[]> {
    return await db.query.dataStreams.findMany({
      where: and(
        eq(dataStreams.deviceId, deviceId),
        eq(dataStreams.enabled, true)
      ),
      orderBy: asc(dataStreams.label)
    });
  }

  async findByKey(key: string): Promise<DataStream | null> {
    const dataStream = await db.query.dataStreams.findFirst({
      where: eq(dataStreams.key, key)
    });

    return dataStream || null;
  }

  async create({
    label,
    deviceId,
    unitId
  }: DataStreamPost): Promise<DataStream | null> {
    const newDataStream = await db
      .insert(dataStreams)
      .values({ label, deviceId, unitId })
      .returning();

    return newDataStream[0] || null;
  }
}
