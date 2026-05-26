import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { NewUser, User } from "@/db/schema";

export class UsersRepository {
  async findAll(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();

    return user!;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return !!deleted;
  }
}

// Singleton instance
export const usersRepository = new UsersRepository();
