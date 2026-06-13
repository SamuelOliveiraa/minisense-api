import { db } from "@/database/client.ts";
import { dataStreams } from "@/database/schema.ts";
import type {
  DataStream,
  DataStreamPost
} from "@/database/types/data-stream.ts";
import { asc, eq } from "drizzle-orm";

export class DataStreamModel {
  async index(): Promise<DataStream[]> {
    return await db.select().from(dataStreams).orderBy(asc(dataStreams.label));
  }

  async findByID(id: string): Promise<DataStream | null> {
    const dataStream = await db.query.dataStreams.findFirst({
      where: eq(dataStreams.id, id)
    });

    return dataStream || null;
  }

  async findByKey(key: string): Promise<DataStream | null> {
    const dataStream = await db.query.dataStreams.findFirst({
      where: eq(dataStreams.key, key)
    });

    return dataStream || null;
  }

  async delete(id: string): Promise<DataStream | null> {
    const deletedDataStream = await db
      .delete(dataStreams)
      .where(eq(dataStreams.id, id))
      .returning();

    return deletedDataStream[0] || null;
  }

  async create({
    label,
    deviceId,
    unitId,
    enabled
  }: DataStreamPost): Promise<DataStream | null> {
    const newDataStream = await db
      .insert(dataStreams)
      .values({ label, deviceId, unitId, enabled })
      .returning();

    return newDataStream[0] || null;
  }
}
