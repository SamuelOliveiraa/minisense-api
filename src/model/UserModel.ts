import { db } from "@/database/client.ts";
import { users } from "@/database/schema.ts";
import type { User, UserPost } from "@/database/types/user.ts";
import { asc, eq } from "drizzle-orm";

export class UserModel {
  async index(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.username));
  }

  async show(id: string): Promise<User | null> {
    const userData = await db.query.users.findFirst({
      where: eq(users.id, id)
    });

    return userData || null;
  }

  async delete(id: string): Promise<User | null> {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deletedUser[0] || null;
  }

  async create({ username, email }: UserPost): Promise<User | null> {
    const createdUser = await db
      .insert(users)
      .values({ username, email })
      .returning();

    return createdUser[0] || null;
  }

  async update(
    id: string,
    { username, email }: UserPost
  ): Promise<User | null> {
    const updatedUser = await db
      .update(users)
      .set({ username, email })
      .where(eq(users.id, id))
      .returning();

    return updatedUser[0] || null;
  }
}
