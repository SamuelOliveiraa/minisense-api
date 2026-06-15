import { db } from "@/database/client";
import { users } from "@/database/schema";
import type { User, UserPost } from "@/database/types/user";
import { asc, eq } from "drizzle-orm";

export class UserModel {
  async index(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.username));
  }

  async findById(id: string): Promise<User | null> {
    const userData = await db.query.users.findFirst({
      where: eq(users.id, id)
    });

    return userData || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await db.query.users.findFirst({
      where: eq(users.email, email)
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
    const newUser = await db
      .insert(users)
      .values({ username, email })
      .returning();

    return newUser[0] || null;
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
