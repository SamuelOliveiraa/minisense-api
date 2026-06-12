import { db } from "@/database/client.ts";
import { dataStreams } from "@/database/schema.ts";
import type { DataStream, DataStreamPost } from "@/database/types/data-stream.ts";
import { asc, eq } from "drizzle-orm";

export class DataStreamModel {
  async index(): Promise<DataStream[]> {
    return await db.select().from(dataStreams).orderBy(asc(dataStreams.label));
  }

  async findByID(id: string): Promise<DataStream | null> {
    const dataStreamSelected = await db.query.dataStreams.findFirst({
      where: eq(dataStreams.id, id)
    });

    return dataStreamSelected || null;
  }

  async findByKey(key: string): Promise<DataStream | null> {
    const dataStreamSelected = await db.query.dataStreams.findFirst({
      where: eq(dataStreams.key, key)
    });

    return dataStreamSelected || null;
  }

  async delete(id: string): Promise<DataStream | null> {
    const dataStreamSelected = await db
      .delete(dataStreams)
      .where(eq(dataStreams.id, id))
      .returning();

    return dataStreamSelected[0] || null;
  }

  async create({ label, deviceId, unitId, enabled }: DataStreamPost): Promise<DataStream | null> {
    const createdDataStream = await db
      .insert(dataStreams)
      .values({ label, deviceId, unitId, enabled })
      .returning();

    return createdDataStream[0] || null;
  }

//   async update(
//     id: string,
//     { label, enabled }: DataStreamPost
//   ): Promise<DataStream | null> {
//     const updatedUser = await db
//       .update(users)
//       .set({ label })
//       .where(eq(users.id, id))
//       .returning();

//     return updatedUser[0] || null;
//   }
}
